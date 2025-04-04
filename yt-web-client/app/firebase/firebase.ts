// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    User
} from "firebase/auth";

import { firebaseConfig } from './firebase-config';


// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

/**
 * Signs in the user with Google.
 *
 * @returns A promise that resolves with a result object containing the signed in user and the credential.
 */
export function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
}

/**
 * Signs out the current user.
 *
 * @returns A promise that resolves when the sign out is complete.
 */
export function signOut() {
    return auth.signOut();
}

/**
 * Subscribes to changes in the authentication state.
 *
 * @param callback - A function that receives the current user when the authentication state changes,
 *                   or null if no user is signed in.
 * @returns A function that can be called to unsubscribe from the auth state changes.
 */

export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}