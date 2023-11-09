import { 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    UserCredential,
} from 'firebase/auth'

import { auth } from './instances'

export { signInUser, signUpUser }


async function signInUser(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(auth, email, password)
}


async function signUpUser(email: string, password: string) {
    return await createUserWithEmailAndPassword(auth, email, password)
}
