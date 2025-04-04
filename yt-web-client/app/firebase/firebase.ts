// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    onAuthStateChanged,
    signInWithPopup,
    User
} from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDPTZ8EvftPG6apiRFRrreTPm8hJsX4Iq4",
    authDomain: "yt-clone-f52b3.firebaseapp.com",
    projectId: "yt-clone-f52b3",
    appId: "1:665132061758:web:a285c68368871557cd2d6f"
};

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