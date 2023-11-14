import { reactive, watch } from "vue";
import { collection, doc, onSnapshot, setDoc, query, where } from 'firebase/firestore';
import { auth, db, initFirebaseInstances } from "../firebase/instances";
import type { Chore, User, FirestoreType, Home } from "../firebase/types";
import type { CollectionReference, DocumentReference, Unsubscribe } from "firebase/firestore";

export const chores = reactive<Map<string, FirebaseWrapper<Chore>>>(new Map());
export const members = reactive<Map<string, FirebaseWrapper<User>>>(new Map());
export const user = newFirebaseWrapper<User>({
    email: '',
    homeId: '',
    isHomeAdmin: false,
});
export const home = newFirebaseWrapper<Home>({
    name: '',
    members: [],
    chores: [],
    inviteCode: ''
});

initFirebaseInstances();

type SnapshotCallback<T> = (wrap: FirebaseWrapper<T>, remoteData: T) => void;

interface FirebaseWrapper<T = FirestoreType> {
    meta: {
        listenerUnsub: Unsubscribe | null;
        docRef: DocumentReference<T> | null;
        snapshotSubscribers: SnapshotCallback<T>[];
        cleanupCallbacks: CallableFunction[];
    };
    model: T | null;
    connect(docPath: string): void;
    startListening(): void;
    addSnapshotCallback(cb: SnapshotCallback<T>): void;
    stopListening(): void;
    pushData(): void;
    cleanup(): void;
    connected(): boolean;
    hasModel(): boolean;
}


function newFirebaseWrapper<T = FirestoreType>(initialModel?: T): FirebaseWrapper<T> {
    const nullMeta = {
        listenerUnsub: null,
        docRef: null,
        snapshotSubscribers: [],
        cleanupCallbacks: [],
    };

    const wrapper = reactive<FirebaseWrapper<T>>({
        meta: { ...nullMeta },
        model: initialModel ? { ...initialModel } : null,
        connect(docPath: string) {
            if (this.connected()) {
                throw new Error('wrapper already connected');
            }

            this.meta.docRef = doc(db, docPath) as DocumentReference<T>;
        },
        connected(): boolean {
            return this.meta.docRef !== null;
        },
        hasModel(): boolean {
            return this.model !== null;
        },
        cleanup() {
            this.meta.cleanupCallbacks.forEach((cb) => cb())
            this.meta = { ...nullMeta };
            this.model = null;
        },
        startListening() {
            if (!this.connected()) {
                throw new Error('not connected');
            }

            this.stopListening();

            const cancel = onSnapshot(this.meta.docRef!, (doc) => {
                if (!doc.exists()) return;
                this.model ??= {} as T;
                const new_: T = doc.data();
                const old: T = this.model!;
        
                const updatedModel: T = { ...old }; // Clone the existing model
        
                // Update only the changed fields from new_ to updatedModel
                for (const key in new_) {
                    if (old[key] !== new_[key]) {
                        updatedModel[key] = new_[key];
                    }
                }
        
                // Assign the updated fields back to this.model
                this.model = { ...old, ...updatedModel };
                
                this.meta.snapshotSubscribers.forEach((cb) => {
                    cb(this, new_);
                });
            });

            this.meta.listenerUnsub = cancel;
            this.meta.cleanupCallbacks.push(cancel);
        },
        addSnapshotCallback(cb: SnapshotCallback<T>) {
            this.meta.snapshotSubscribers.push(cb);
        },
        stopListening() {
            if (this.meta.listenerUnsub === null) {
                return;
            } else {
                this.meta.listenerUnsub();
                this.meta.listenerUnsub = null;
            }
        },
        async pushData() {
            if (this.meta.docRef === null) {
                throw new Error('You must set the docRef first');
            }

            await setDoc(
                this.meta.docRef,
                this.model,
                { merge: true }
            );
        }
    });

    return wrapper as FirebaseWrapper<T>;
}

function difference<T>(old: T[], new_: T[]): { removed: T[], added: T[] } {
    const oldSet = new Set(old);
    const newSet = new Set(new_);

    return {
        removed: old.filter((t) => !newSet.has(t)),
        added: new_.filter((t) => !oldSet.has(t))
    }
}

// clear data and update user on auth change
auth.onAuthStateChanged((authUser) => {
    user.cleanup();
    home.cleanup()

    if (!authUser) {
        return;
    }

    user.connect(`/users/${authUser.uid}`);
    user.startListening();
});

// update home when user's homeId changes
watch(() => user.model, (old, new_) => {
    if (new_ === null) {
        return;
    }

    const oldHomeId = old?.homeId;
    const newHomeId = new_.homeId;

    if (newHomeId === oldHomeId || newHomeId === '') {
        return;
    }

    home.cleanup();
    home.connect(`/homes/${newHomeId}`);
    home.startListening();

    const choresCancel = onSnapshot(
        query(
            collection(db, '/chores') as CollectionReference<Chore>,
            where('homeId', '==', newHomeId)
        ),
        (querySnap) => {
            for (let change of querySnap.docChanges()) {
                const changeDoc = change.doc;
                if (change.type === 'added') {
                    const wrapper = newFirebaseWrapper(changeDoc.data());
                    wrapper.connect(`/chores/${changeDoc.id}`);
                    wrapper.startListening();
                    chores.set(changeDoc.id, wrapper);
                } else if (change.type === 'removed') {
                    const chore = chores.get(changeDoc.id);
                    if (chore) chore.cleanup();
                    chores.delete(changeDoc.id);
                }
            }
        }
    )
    
    const membersCancel = onSnapshot(
        query(
            collection(db, '/users') as CollectionReference<User>,
            where('homeId', '==', newHomeId)
        ),
        (querySnap) => {
            for (let change of querySnap.docChanges()) {
                const changeDoc = change.doc;
                if (change.type === 'added') {
                    const wrapper = newFirebaseWrapper(changeDoc.data());
                    wrapper.connect(`/users/${changeDoc.id}`);
                    wrapper.startListening();
                    members.set(changeDoc.id, wrapper);
                } else if (change.type === 'removed') {
                    const chore = chores.get(changeDoc.id);
                    if (chore) chore.cleanup();
                    chores.delete(changeDoc.id);
                }
            }
        }
    );
    
    home.meta.cleanupCallbacks.push(choresCancel);
    home.meta.cleanupCallbacks.push(membersCancel);
    home.meta.cleanupCallbacks.push(() => {
        Array(...chores.values()).forEach(chore => {
            chore.cleanup();
        });
        chores.clear();
    })
    home.meta.cleanupCallbacks.push(() => {
        Array(...members.values()).forEach(member => {
            member.cleanup();
        });
        members.clear();
    });
});