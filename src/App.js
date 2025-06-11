import React, { useState, useEffect } from "react";
import "./App.css";
import {
    auth,
    signInWithGoogle,
    signOutUser,
    saveLikedSongs,
    fetchLikedSongs,
    fetchRecentlyPlayed,
    saveRecentlyPlayed,
    removeRecentlyPlayedSong,
} from "./firebase";
import { searchSpotifyTracks } from "./services/spotifyService";
import { getEnhancedRecommendations } from "./services/enhancedRecommendationService";
import EnhancedSidebar from "./components/EnhancedSidebar";
import MainContent from "./components/MainContent";
import EnhancedMusicPlayer from "./components/EnhancedMusicPlayer";
import SearchDialog from "./components/SearchDialog";
import ProfileDialog from "./components/ProfileDialog";
import { AnimatePresence } from "framer-motion";
import { Toaster, toast } from "react-hot-toast";

export default function App() {
    const [activeView, setActiveView] = useState("home");
    const [currentSong, setCurrentSong] = useState(null);
    const [recentlyPlayed, setRecentlyPlayed] = useState([]);
    const [likedSongs, setLikedSongs] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [user, setUser] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                try {
                    const fetchedLikedSongs = await fetchLikedSongs(currentUser.uid);
                    setLikedSongs(fetchedLikedSongs);
                    
                    const fetchedRecentlyPlayed = await fetchRecentlyPlayed(currentUser.uid);
                    setRecentlyPlayed(fetchedRecentlyPlayed);
                    
                    // Get enhanced recommendations
                    if (fetchedLikedSongs.length > 0 || fetchedRecentlyPlayed.length > 0) {
                        const recs = await getEnhancedRecommendations({
                            likedSongs: fetchedLikedSongs,
                            recentlyPlayed: fetchedRecentlyPlayed,
                            timeOfDay: getTimeOfDay(),
                            mood: 'neutral'
                        });
                        setRecommendations(recs);
                    }
                } catch (error) {
                    console.error("Error fetching songs:", error);
                    toast.error("Failed to fetch songs.", {
                        position: "top-right",
                    });
                }
            } else {
                setLikedSongs([]);
                setRecentlyPlayed([]);
                setRecommendations([]);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const saveSongsOnUnload = async () => {
            if (user) {
                try {
                    await saveLikedSongs(user.uid, likedSongs);
                    await saveRecentlyPlayed(user.uid, recentlyPlayed);
                } catch (error) {
                    console.error("Error saving songs on browser close:", error);
                }
            }
        };

        window.addEventListener("beforeunload", saveSongsOnUnload);
        return () => window.removeEventListener("beforeunload", saveSongsOnUnload);
    }, [user, likedSongs, recentlyPlayed]);

    const getTimeOfDay = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        if (hour < 22) return 'evening';
        return 'night';
    };

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

    const handleSignOut = async () => {
        try {
            if (user) {
                await saveLikedSongs(user.uid, likedSongs);
                await saveRecentlyPlayed(user.uid, recentlyPlayed);
            }
            await signOutUser();
            setUser(null);
            setLikedSongs([]);
            setRecentlyPlayed([]);
            setRecommendations([]);
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

    const handleSetCurrentSong = (song) => {
        if (!song?.id && !song?.videoId) {
            toast.error("This song is not available for playback.");
            return;
        }
        setCurrentSong(song);
        setIsPlaying(true);
        
        // Add to recently played
        setRecentlyPlayed((prev) => {
            const songId = song.id || song.videoId;
            const filtered = prev.filter((item) => (item.id || item.videoId) !== songId);
            return [song, ...filtered].slice(0, 20);
        });
    };

    const handleLikeToggle = async (song, isCurrentlyLiked) => {
        setLikedSongs((prev) => {
            const songId = song.id || song.videoId;
            if (isCurrentlyLiked) {
                return prev.filter((item) => (item.id || item.videoId) !== songId);
            } else {
                return [song, ...prev];
            }
        });

        // Update recommendations when liked songs change
        if (!isCurrentlyLiked && likedSongs.length >= 0) {
            try {
                const recs = await getEnhancedRecommendations({
                    likedSongs: [...likedSongs, song],
                    recentlyPlayed,
                    timeOfDay: getTimeOfDay(),
                    mood: 'neutral'
                });
                setRecommendations(recs);
            } catch (error) {
                console.error("Error updating recommendations:", error);
            }
        }
    };

    const handleDeleteSong = async (songId) => {
        if (!user) {
            toast.error("You must be signed in to delete songs.", {
                position: "top-right",
            });
            return;
        }

        try {
            await removeRecentlyPlayedSong(user.uid, songId);
            setRecentlyPlayed((prevSongs) =>
                prevSongs.filter((song) => (song.id || song.videoId) !== songId)
            );
            toast.success("Song removed from Recently Played.", {
                position: "top-right",
            });
        } catch (error) {
            console.error("Failed to delete song:", error);
            toast.error("Failed to delete the song. Please try again.", {
                position: "top-right",
            });
        }
    };

    const handleSearch = async (query) => {
        try {
            const results = await searchSpotifyTracks(query);
            return results;
        } catch (error) {
            console.error("Search error:", error);
            toast.error("Search failed. Please try again.", {
                position: "top-right",
            });
            return [];
        }
    };

    return (
        <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
            <Toaster position="top-right" reverseOrder={false} />
            
            <div className="flex flex-1 min-h-0">
                {/* Enhanced Sidebar */}
                <EnhancedSidebar
                    activeView={activeView}
                    setActiveView={setActiveView}
                    user={user}
                    onSignIn={handleSignIn}
                    onSignOut={handleSignOut}
                    onSearch={() => setIsSearchOpen(true)}
                    onProfile={() => setIsProfileOpen(true)}
                    likedSongs={likedSongs}
                />

                {/* Main Content */}
                <MainContent
                    activeView={activeView}
                    currentSong={currentSong}
                    recentlyPlayed={recentlyPlayed}
                    likedSongs={likedSongs}
                    recommendations={recommendations}
                    onSelectSong={handleSetCurrentSong}
                    onLikeToggle={handleLikeToggle}
                    onDeleteSong={handleDeleteSong}
                    user={user}
                />
            </div>

            {/* Enhanced Music Player */}
            <EnhancedMusicPlayer
                song={currentSong}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                likedSongs={likedSongs}
                onLikeToggle={handleLikeToggle}
            />

            {/* Dialogs */}
            <AnimatePresence>
                {isSearchOpen && (
                    <SearchDialog
                        onClose={() => setIsSearchOpen(false)}
                        onSearch={handleSearch}
                        onSelectSong={handleSetCurrentSong}
                    />
                )}
                {isProfileOpen && user && (
                    <ProfileDialog
                        onClose={() => setIsProfileOpen(false)}
                        user={user}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}