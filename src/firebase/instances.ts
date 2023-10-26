import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth'
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore'
import { getFunctions, connectFunctionsEmulator, Functions } from "firebase/functions";

export let app: FirebaseApp
export let auth: Auth
export let db: Firestore
export let functions: Functions
export let ready = false;

/**
 * Initializes Firebase instances, including the Firebase app, authentication, and Firestore.
 */
export function initFirebaseInstances() {
    if (ready) return

    // load appropriate config (prod or dev) from vite environment
    const firebaseConfig = JSON.parse(import.meta.env.VITE_FIREBASE_APP_CONFIG_JSON)
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    functions = getFunctions(app)
    
    // connect emulators if in dev (vite environment object)
    if (import.meta.env.DEV) {
        const emulatorHost = import.meta.env.VITE_FIREBASE_EMULATOR_HOST
        const authPort = Number(import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_PORT)
        const firestorePort = Number(import.meta.env.VITE_FIREBASE_FIRESTORE_EMULATOR_PORT)
        const functionsPort = Number(import.meta.env.VITE_FIREBASE_FUNCTIONS_EMULATOR_PORT)
        connectAuthEmulator(auth, `http://${emulatorHost}:${authPort}`)
        connectFirestoreEmulator(db, emulatorHost, firestorePort)
        connectFunctionsEmulator(functions, emulatorHost, functionsPort)
    }

    ready = true;
    
    auth.onAuthStateChanged((user) => {
        if (!user) {
            console.log('current user logged out')
        } else {
            console.log('user logged in:', user)
        }
    })

}