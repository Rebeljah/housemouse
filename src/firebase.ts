import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

export { app, auth, db }

const firebaseConfig = {
    apiKey: "AIzaSyAukOUS32AdMTC-biuUOmj1gpFB1gYI544",
    authDomain: "housemouse-ef143.firebaseapp.com",
    projectId: "housemouse-ef143",
    storageBucket: "housemouse-ef143.appspot.com",
    messagingSenderId: "59902509704",
    appId: "1:59902509704:web:9c30ca5d26d7b78f0b953d",
    measurementId: "G-Q3PEPXKF4D"
}
  
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)