import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'

export let app: FirebaseApp
export let auth: Auth
export let db: Firestore
export let initialized = false;

/**
 * Initializes Firebase instances, including the Firebase app, authentication, and Firestore.
 */
export function initFirebaseInstances() {
    if (initialized) return

    const firebaseConfig = {
        apiKey: "AIzaSyAukOUS32AdMTC-biuUOmj1gpFB1gYI544",
        authDomain: "housemouse-ef143.firebaseapp.com",
        projectId: "housemouse-ef143",
        storageBucket: "housemouse-ef143.appspot.com",
        messagingSenderId: "59902509704",
        appId: "1:59902509704:web:9c30ca5d26d7b78f0b953d",
        measurementId: "G-Q3PEPXKF4D"
    }

    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
      
    
    auth.onAuthStateChanged((user) => {
        if (!user) {
            console.log('current user logged out')
        } else {
            console.log('user logged in:', user)
        }
    })

    initialized = true;
}
