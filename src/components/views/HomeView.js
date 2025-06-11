import React from 'react';
import { motion } from 'framer-motion';
import SongCard from '../SongCard';
import { Clock, Sparkles } from 'lucide-react';

export default function HomeView({ 
    recentlyPlayed, 
    recommendations, 
    onSelectSong, 
    onLikeToggle, 
    likedSongs,
    user 
}) {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="p-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <h1 className="text-4xl font-bold text-white mb-2">
                    {getGreeting()}{user ? `, ${user.displayName?.split(' ')[0]}` : ''}
                </h1>
                <p className="text-gray-400">
                    Discover new music and enjoy your favorites
                </p>
            </motion.div>

            {/* Recently Played */}
            {recentlyPlayed.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="mb-12"
                >
                    <div className="flex items-center space-x-2 mb-6">
                        <Clock className="w-6 h-6 text-green-400" />
                        <h2 className="text-2xl font-bold text-white">Recently Played</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {recentlyPlayed.slice(0, 6).map((song, index) => (
                            <motion.div
                                key={song.id || song.videoId}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                            >
                                <SongCard
                                    song={song}
                                    onPlay={onSelectSong}
                                    onLikeToggle={onLikeToggle}
                                    isLiked={likedSongs.some(liked => 
                                        (liked.id || liked.videoId) === (song.id || song.videoId)
                                    )}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Recommendations */}
            {recommendations.length > 0 && (
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-12"
                >
                    <div className="flex items-center space-x-2 mb-6">
                        <Sparkles className="w-6 h-6 text-purple-400" />
                        <h2 className="text-2xl font-bold text-white">Made for You</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                        {recommendations.slice(0, 12).map((song, index) => (
                            <motion.div
                                key={song.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                <SongCard
                                    song={song}
                                    onPlay={onSelectSong}
                                    onLikeToggle={onLikeToggle}
                                    isLiked={likedSongs.some(liked => 
                                        (liked.id || liked.videoId) === (song.id || song.videoId)
                                    )}
                                />
                            </motion.div>
                        ))}
                    </div>
                </motion.section>
            )}

            {/* Welcome Message for New Users */}
            {!user && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="text-center py-16"
                >
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Welcome to Echo
                    </h2>
                    <p className="text-gray-400 text-lg mb-8">
                        Sign in to discover personalized music recommendations and save your favorites
                    </p>
                </motion.div>
            )}
        </div>
    );
}