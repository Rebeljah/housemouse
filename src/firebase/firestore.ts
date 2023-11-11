import { collection } from 'firebase/firestore'
import type {
    DocumentData,
    CollectionReference,
    FirestoreDataConverter,
    QueryDocumentSnapshot,
} from 'firebase/firestore'

import { db, initFirebaseInstances } from './instances'
import type { User } from './types/User'
import type { Home } from './types/Home'
import type { Chore } from './types/Chore'

export { collections }

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
