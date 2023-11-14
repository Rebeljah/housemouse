// Start writing functions
// https://firebase.google.com/docs/functions/typescript


import { initializeApp } from "firebase-admin";
import { DocumentData, DocumentReference, FieldValue, getFirestore } from "firebase-admin/firestore";
import { onCall, HttpsError, CallableRequest } from "firebase-functions/v2/https";
import { beforeUserCreated } from "firebase-functions/v2/identity";

let APP = null;

function adminInstances() {
    APP ??= initializeApp({projectId: process.env.PROJECT_ID});
    return { firestore: getFirestore(APP) }
}

function isLoggedIn(request: CallableRequest): boolean {
    return Boolean(request.auth && request.auth.uid);
}
function ensureLogin(request: CallableRequest) {
    if (!isLoggedIn(request)) {
        throw new HttpsError("unauthenticated", "user not logged in")
    }
}

async function addUserToHome(userDoc: DocumentReference, homeDoc: DocumentReference, makeAdmin?: boolean) {
    await Promise.all([
        userDoc.update({homeId: homeDoc.id, isHomeAdmin: Boolean(makeAdmin)}),
        homeDoc.update({members: FieldValue.arrayUnion(userDoc.id)})
    ]);
}
async function removeUserFromHome(userDoc: DocumentReference, homeDoc: DocumentReference) {
    await Promise.all([
        userDoc.update({homeId: '', isHomeAdmin: false}),
        homeDoc.update({members: FieldValue.arrayRemove(userDoc.id)})
    ]);
}

export const createNewHome = onCall(async (request) => {
    ensureLogin(request);
    const uid = request.auth!.uid;

    const { firestore } = adminInstances();

    const userDocRef = firestore.doc(`/users/${uid}`);
    const userSnap = await userDocRef.get();
    // verify user exists in firestore
    if (userSnap.data === undefined) {
        throw new HttpsError("unauthenticated", "user not in firestore")
    }

    // check that user is not part of a home already
    if ((userSnap.data as DocumentData).homeId) {
        throw new HttpsError('permission-denied', 'user already has home');
    }

    // add home document
    const homeDocRef = firestore.collection('/homes').doc();
    await homeDocRef.create({
        name: request.data.name,
        members: [],
        chores: [],
    });

    // add requesting user to home
    await addUserToHome(userDocRef, homeDocRef, true);

    return homeDocRef.id;
});

export const joinHomeWithInviteCode = onCall(async (request) => {
    ensureLogin(request)

    const code = request.data.inviteCode;
    if (!code) {
        throw new HttpsError('invalid-argument', 'request data did not have inviteCode');
    }

    const { firestore } = adminInstances();;
    const inviteQuery = firestore.collection('invites')
        .where('inviteCode', '==', code)
        .limit(1);
    
    const querySnap = await inviteQuery.get()
    if (querySnap.empty) {
        throw new HttpsError('not-found', 'invalid invite code');
    }

    const inviteDoc = querySnap.docs[0];
    const homeId: string = inviteDoc.data().homeId

    const userDoc = firestore.doc('/users/' + request.auth!.uid);
    const homeDoc = firestore.doc('/homes/' + homeId);

    await addUserToHome(userDoc, homeDoc, false);

    return homeId;
})

export const removeMemberFromHome = onCall(async (req) => {
    ensureLogin(req);
    const { firestore } = adminInstances();

    const authUid = req.auth!.uid
    const uidRemove = req.data.uid;
    const homeId = req.data.homeId;

    if (! (uidRemove && homeId)) {
        throw new HttpsError('invalid-argument', 'must provide uid and homeId');
    }
    
    const authUserSnap = await firestore.doc('/users/'+authUid).get();
    if (!authUserSnap.exists) {
        throw new HttpsError('permission-denied', 'requesting user not in firestore');
    }
    const authUserData = authUserSnap.data as DocumentData;
    // check if requester is admin for home
    if ((authUserData.homeId !== homeId) || (!authUserData.isHomeAdmin)) {
        throw new HttpsError('permission-denied', 'user not authorized to make this change');
    }

    const homeRef = firestore.doc('/homes/' + homeId);
    const userRemoveRef = firestore.doc('/users/'+uidRemove);
    await removeUserFromHome(userRemoveRef, homeRef);
});

export const addUserToFirestore = beforeUserCreated(async (authEvent) => {
    const { firestore } = adminInstances();

    const userDoc = firestore.doc('/users/' + authEvent.data.uid);
    const userData = {
        email: authEvent.data.email,
        homeId: '',
        isHomeAdmin: false,
    };

    try {
        await userDoc.create(userData);
    } catch (e) {  // stop account creation entirely
        throw new HttpsError('aborted', 'could not create new user');
    }
});