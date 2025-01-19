// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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

const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, provider);
        console.log("User signed in:", result.user);
    } catch (error) {
        console.error("Error during sign in:", error.message);
    }
};

const signOutUser = async () => {
    try {
        await signOut(auth);
        console.log("User signed out");
    } catch (error) {
        console.error("Error during sign out:", error.message);
    }
};

// Save liked songs to Firestore
const saveLikedSongs = async (userId, likedSongs) => {
    try {
        const docRef = doc(db, "users", userId);
        await setDoc(docRef, { likedSongs }, { merge: true });
        console.log("Liked songs saved successfully.");
    } catch (error) {
        console.error("Error saving liked songs:", error.message);
    }
};

const fetchLikedSongs = async (userId) => {
    try {
        const docRef = doc(db, "users", userId); // Reference to the user's document
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Liked songs fetched:", docSnap.data().likedSongs);
            return docSnap.data().likedSongs || [];
        } else {
            console.log("No liked songs found.");
            return [];
        }
    } catch (error) {
        console.error("Error fetching liked songs:", error.message);
        return [];
    }
};
export { db, auth, provider, signInWithGoogle, signOutUser, fetchLikedSongs, saveLikedSongs };
