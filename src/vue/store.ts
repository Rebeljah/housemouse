import { reactive } from "vue";
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { auth, db } from "../firebase/instances";
import type { Chore, User, FirestoreType, Home } from "../firebase/types";
import type { DocumentReference, Unsubscribe } from "firebase/firestore";


interface FirebaseWrapper<T = FirestoreType> {
    meta: {
        listenerUnsub: Unsubscribe | null,
        docRef: DocumentReference<T> | null

    };
    model: T | null;
    id(): string | null;
    setDocRef(docPath: string): void;
    reset(): void;
    startListening(): void;
    stopListening(): void;
    pushData(): void;
}


function newFirebaseWrapper<T = FirestoreType>(initialModel?: T) {
    const nullMeta = {
        listenerUnsub: null,
        docRef: null
    };

    const wrapper = reactive<FirebaseWrapper<T>>({
        meta: { ...nullMeta },
        model: initialModel ? {...initialModel} : null,
        setDocRef: function(docPath: string) {
            this.meta.docRef = doc(db, docPath) as DocumentReference<T>;
        },
        id: function(): string {
            if (this.meta.docRef === null) {
                throw new Error('You must set the docRef first');
            }

            return this.meta.docRef.id;
        },
        reset: function() {
            this.stopListening();
            this.meta = { ...nullMeta };
            this.model = null;
        },
        startListening: function () {
            if (this.meta.docRef === null) {
                throw new Error('You must set the docRef first');
            }

            this.stopListening();

            this.meta.listenerUnsub = onSnapshot(this.meta.docRef, (doc) => {
                if (!doc.exists()) return;
                const data: T = doc.data();
                const model: T = this.model!;

                for (const key in model) {
                    if (model[key as keyof T] !== data[key as keyof T]) {
                        model[key as keyof T] = data[key as keyof T];
                    }
                }
            });
        },
        stopListening: function () {
            if (this.meta.listenerUnsub === null) {
                return;
            } else {
                this.meta.listenerUnsub();
                this.meta.listenerUnsub = null;
            }
        },
        pushData: async function () {
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

    return wrapper;
}


export const chores = reactive<FirebaseWrapper<Chore>[]>([]);
export const members = reactive<FirebaseWrapper<User>[]>([]);
export const user = newFirebaseWrapper<User>({
    name: '',
    homeId: '',
    isHomeAdmin: '',
});
export const home = newFirebaseWrapper<Home>({
    name: '',
    members: [],
    chores: [],
    inviteCode: ''
});


auth.onAuthStateChanged((authUser) => {
    [user, home, ...chores, ...members].forEach((wrapper) => {
        wrapper.reset();
    });

    [chores, members].forEach((arr: any[]) => arr.length = 0)

    if (authUser) {
        user.setDocRef(`/users/${authUser.uid}`);
        user.startListening();
    } 
});