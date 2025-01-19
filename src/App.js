// App.jsx
import React, { useState, useEffect } from "react";
import "./App.css";
import {
    auth,
    signInWithGoogle,
    signOutUser,
    saveLikedSongs,
    fetchLikedSongs,
} from "./firebase"; // Firebase integration
import AnimatedBackground from "./components/AnimatedBackground";
import Visualizer from "./components/Visualizer";
import Navbar from "./components/Navbar";
import MobileNavbar from "./components/MobileNavbar";
import SearchBarDialog from "./components/SearchBarDialog";
import ProfileDialog from "./components/ProfileDialog";
import MusicPlayer from "./components/MusicPlayer";
import RecentlyPlayed from "./components/RecentlyPlayed";
import LikedSongs from "./components/LikedSongs";
import { AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

export default function App() {
    const [activePanel, setActivePanel] = useState(null);
    const [currentSong, setCurrentSong] = useState(null);
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);
    const [user, setUser] = useState(null); // Manage user authentication state

    // Determine if the main content should be blurred based on active panels
    const shouldBlur = ["search", "profile", "settings"].includes(activePanel);

    useEffect(() => {
        // Listen for Firebase Auth State changes
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const fetchedSongs = await fetchLikedSongs(currentUser.uid);
                    setLikedSongs(fetchedSongs);
                    console.log("Liked songs fetched on sign-in or app load.");
                } catch (error) {
                    console.error("Error fetching liked songs:", error);
                    toast.error("Failed to fetch liked songs.", { position: "top-right" });
                }
            } else {
                setLikedSongs([]);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Save liked songs when the user closes the browser or refreshes
        const saveSongsOnUnload = async () => {
            if (user) {
                try {
                    await saveLikedSongs(user.uid, likedSongs);
                    console.log("Liked songs saved successfully on browser close.");
                } catch (error) {
                    console.error("Error saving liked songs on browser close:", error);
                }
            }
        };

        window.addEventListener("beforeunload", saveSongsOnUnload);

        return () => {
            window.removeEventListener("beforeunload", saveSongsOnUnload);
        };
    }, [user, likedSongs]);

    /**
     * Handle user sign-in with Google
     */
    const handleSignIn = async () => {
        try {
            const signedInUser = await signInWithGoogle();
            setUser(signedInUser);
            toast.success(`Welcome, ${signedInUser.displayName}!`, {
                position: "top-right",
            });
        } catch (error) {
            console.error("Error during sign-in:", error.message);
            toast.error(`Sign in failed: ${error.message}`, {
                position: "top-right",
            });
        }
    };

    /**
     * Handle user sign-out
     */
    const handleSignOut = async () => {
        try {
            if (user) {
                await saveLikedSongs(user.uid, likedSongs);
                console.log("Liked songs saved successfully before sign-out.");
            }

            await signOutUser();
            setUser(null);
            setLikedSongs([]);
            toast.success("You have been signed out.", {
                position: "top-right",
            });
        } catch (error) {
            console.error("Error during sign-out:", error.message);
            toast.error(`Sign out failed: ${error.message}`, {
                position: "top-right",
            });
        }
    };

    /**
     * Close all active panels/dialogs
     */
    const closeAllPanels = () => setActivePanel(null);

    /**
     * Set the current song and update recently played list
     * @param {Object} song - The selected song object
     */
    const handleSetCurrentSong = (song) => {
        if (!song?.videoId) {
            alert("This song does not have a valid YouTube videoId.");
            return;
        }
        setCurrentSong(song);
        setRecentlyPlayed((prev) => {
            const filtered = prev.filter((item) => item.videoId !== song.videoId);
            return [song, ...filtered].slice(0, 10);
        });
    };

    /**
     * Toggle like status of a song
     * @param {Object} song - The song to toggle
     * @param {boolean} isCurrentlyLiked - Whether the song is currently liked
     */
    const handleLikeToggle = (song, isCurrentlyLiked) => {
        setLikedSongs((prev) => {
            if (isCurrentlyLiked) {
                return prev.filter((item) => item.videoId !== song.videoId);
            } else {
                return [song, ...prev];
            }
        });
    };

    /**
     * Reorder liked songs in the list
     * @param {number} fromIndex - The current index of the song
     * @param {number} toIndex - The new index to move the song to
     */
    const handleReorderLikedSongs = (fromIndex, toIndex) => {
        setLikedSongs((prev) => {
            if (toIndex < 0 || toIndex >= prev.length) return prev;
            const arr = [...prev];
            const [removed] = arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, removed);
            return arr;
        });
    };

    /**
     * Play the previous liked song
     */
    const handlePrevLikedSong = () => {
        if (!currentSong) return;
        const idx = likedSongs.findIndex((s) => s.videoId === currentSong.videoId);
        if (idx > 0) {
            setCurrentSong(likedSongs[idx - 1]);
        }
    };

    /**
     * Play the next liked song
     */
    const handleNextLikedSong = () => {
        if (!currentSong) return;
        const idx = likedSongs.findIndex((s) => s.videoId === currentSong.videoId);
        if (idx >= 0 && idx < likedSongs.length - 1) {
            setCurrentSong(likedSongs[idx + 1]);
        }
    };

    const isLikedPanelActive = activePanel === "liked";

    return (
        <div className="relative w-screen h-screen text-white overflow-hidden">
            {/* Toast Notifications */}
            <Toaster position="top-right" reverseOrder={false} />

            {/* Background and Visualizer */}
            <AnimatedBackground />
            <Visualizer />

            {/* Desktop Navbar */}
            <div className="hidden md:block z-20">
                <Navbar
                    activePanel={activePanel}
                    setActivePanel={setActivePanel}
                    user={user}
                    onSignIn={handleSignIn}
                    onSignOut={handleSignOut}
                />
            </div>

            {/* Main Content */}
            <div
                className={`relative z-10 p-6 md:ml-20 h-full flex flex-col transition-all duration-300 ${
                    shouldBlur ? "blur-sm" : ""
                }`}
            >
                <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-purple-800 bg-clip-text text-transparent">
                    Discover the Future
                </h1>

                {/* Scrollable Section */}
                <div className="flex-1 overflow-y-auto scrollbar-hidden mb-20">
                    {isLikedPanelActive ? (
                        <LikedSongs
                            songs={likedSongs}
                            onSelectSong={handleSetCurrentSong}
                            onReorder={handleReorderLikedSongs}
                        />
                    ) : (
                        <RecentlyPlayed
                            songs={recentlyPlayed}
                            onSelectSong={handleSetCurrentSong}
                        />
                    )}
                </div>
            </div>

            {/* Dialog Overlays */}
            <AnimatePresence>
                {activePanel === "search" && (
                    <SearchBarDialog
                        key="search"
                        onClose={closeAllPanels}
                        setSong={handleSetCurrentSong}
                    />
                )}
                {activePanel === "profile" && user && (
                    <ProfileDialog key="profile" onClose={closeAllPanels} user={user} />
                )}
            </AnimatePresence>

            {/* Desktop Music Player */}
            <div className="hidden md:block fixed bottom-0 left-0 right-0 h-20 z-50">
                <MusicPlayer
                    song={currentSong}
                    likedSongs={likedSongs}
                    isLikedPanelActive={isLikedPanelActive}
                    onLikeToggle={handleLikeToggle}
                    onPrevLikedSong={handlePrevLikedSong}
                    onNextLikedSong={handleNextLikedSong}
                />
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col">
                <div className="h-20">
                    <MusicPlayer
                        song={currentSong}
                        likedSongs={likedSongs}
                        isLikedPanelActive={isLikedPanelActive}
                        onLikeToggle={handleLikeToggle}
                        onPrevLikedSong={handlePrevLikedSong}
                        onNextLikedSong={handleNextLikedSong}
                    />
                </div>
                <div className="h-16">
                    <MobileNavbar
                        activePanel={activePanel}
                        setActivePanel={setActivePanel}
                    />
                </div>
            </div>
        </div>
    );
}

