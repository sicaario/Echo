// firebase.js
import { initializeApp } from "firebase/app";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    doc,
    setDoc,
    getDoc,
} from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration.
// You can find these details in your Firebase project settings.
const firebaseConfig = {
    apiKey: "AIzaSyDZV7V_nk4NpMNko5ud0W-FnYMURsituh8",
    authDomain: "echo2025-8c347.firebaseapp.com",
    projectId: "echo2025-8c347",
    storageBucket: "echo2025-8c347.firebasestorage.app",
    messagingSenderId: "16747528456",
    appId: "1:16747528456:web:fd7b72b8575b8ab868acbd",
    measurementId: "G-PLMQQ5RNCD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

/**
 * Sign in with Google using a popup.
 * @returns {Promise<Object>} - The authenticated user object.
 * @throws {Error} - If sign-in fails.
 */
const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        return result.user;
    } catch (error) {
        console.error("Error during sign-in:", error);
        throw error;
    }
};

/**
 * Sign out the current user.
 * @returns {Promise<void>}
 * @throws {Error} - If sign-out fails.
 */
const signOutUser = async () => {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error during sign-out:", error);
        throw error;
    }
};

/**
 * Save liked songs to Firestore for a given user.
 * @param {string} userId - The user's unique ID.
 * @param {Array} likedSongs - An array of liked songs.
 * @returns {Promise<void>}
 * @throws {Error} - If saving fails.
 */
const saveLikedSongs = async (userId, likedSongs) => {
    try {
        const docRef = doc(db, "users", userId);
        await setDoc(docRef, { likedSongs }, { merge: true });
        console.log("Liked songs saved successfully.");
    } catch (error) {
        console.error("Error saving liked songs:", error);
        throw error;
    }
};

/**
 * Fetch liked songs from Firestore for a given user.
 * @param {string} userId - The user's unique ID.
 * @returns {Promise<Array>} - An array of liked songs.
 * @throws {Error} - If fetching fails.
 */
const fetchLikedSongs = async (userId) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Liked songs fetched successfully.");
            return docSnap.data().likedSongs || [];
        } else {
            console.log("No liked songs found for this user.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching liked songs:", error);
        throw error;
    }
};

export {
    db,
    auth,
    provider,
    signInWithGoogle,
    signOutUser,
    fetchLikedSongs,
    saveLikedSongs,
};
