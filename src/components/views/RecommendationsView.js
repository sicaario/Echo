import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import SongCard from '../SongCard';

export default function RecommendationsView({ 
    songs, 
    onSelectSong, 
    onLikeToggle, 
    likedSongs,
    user 
}) {
    if (!user) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Sign in to get recommendations</h1>
                <p className="text-gray-400">We'll create personalized playlists based on your music taste</p>
            </div>
        );
    }

    return (
        <div className="p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="flex items-center space-x-3 mb-4">
                    <Sparkles className="w-8 h-8 text-purple-400" />
                    <h1 className="text-4xl font-bold text-white">Made for You</h1>
                </div>
                <p className="text-gray-400">Personalized recommendations based on your music taste</p>
            </motion.div>

            {songs.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-16"
                >
                    <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">No recommendations yet</h2>
                    <p className="text-gray-400">Like some songs to get personalized recommendations.</p>
                </motion.div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                    {songs.map((song, index) => (
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
            )}
        </div>
    );
}