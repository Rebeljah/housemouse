import { collection, getDoc, doc, addDoc } from 'firebase/firestore'
import type {
    DocumentData,
    CollectionReference,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
} from 'firebase/firestore'

import { db, initFirebaseInstances } from './instances'
import { auth } from './instances'
import type { User } from './types/User'
import type { Home } from './types/Home'
import type { Chore } from './types/Chore'

export { collections, getUserData }

initFirebaseInstances()

// type annotated collections in firestore
const collections = {
    users: getCollection<User>('users'),
    homes: getCollection<Home>('homes'),
    chores: getCollection<Chore>('chores')
}

function getConverter<T>(): FirestoreDataConverter<T> {
    return {
        toFirestore: (data: T) => data as DocumentData,
        fromFirestore: (snap: QueryDocumentSnapshot) =>
            snap.data() as T
    }
}

function getCollection<T>(collectionPath: string): CollectionReference<T> {
    return collection(db, collectionPath).withConverter(getConverter<T>())
}

//////////////

async function getUserData(uid: string): Promise<User> {
    const docRef = doc(collections.users, uid)
    const snap = await getDoc(docRef)

    if (snap.exists()) {
        return snap.data()
    } else {
        throw new Error('No user found in firestore with uid: ' + uid)
    } 
}
