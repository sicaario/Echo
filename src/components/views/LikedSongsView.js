import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Play, Clock } from 'lucide-react';
import SongRow from '../SongRow';

export default function LikedSongsView({ 
    songs, 
    onSelectSong, 
    onLikeToggle, 
    currentSong,
    user 
}) {
    const formatDuration = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    if (!user) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Sign in to see your liked songs</h1>
                <p className="text-gray-400">Create an account to save and organize your favorite music</p>
            </div>
        );
    }

    return (
        <div className="h-full">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-b from-purple-800 to-purple-900 p-8 pb-6"
            >
                <div className="flex items-end space-x-6">
                    <div className="w-60 h-60 bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg flex items-center justify-center shadow-2xl">
                        <Heart className="w-24 h-24 text-white" fill="currentColor" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white uppercase tracking-wider">Playlist</p>
                        <h1 className="text-5xl font-bold text-white mt-2 mb-4">Liked Songs</h1>
                        <div className="flex items-center text-sm text-gray-300">
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="w-6 h-6 rounded-full mr-2"
                            />
                            <span className="font-medium">{user.displayName}</span>
                            <span className="mx-1">•</span>
                            <span>{songs.length} songs</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Controls */}
            <div className="bg-gradient-to-b from-purple-900/20 to-transparent p-8 pb-4">
                <div className="flex items-center space-x-6">
                    {songs.length > 0 && (
                        <motion.button
                            onClick={() => onSelectSong(songs[0])}
                            className="w-14 h-14 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center transition-colors shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Play className="w-6 h-6 text-black ml-1" fill="currentColor" />
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Songs List */}
            <div className="px-8 pb-8">
                {songs.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-16"
                    >
                        <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Songs you like will appear here</h2>
                        <p className="text-gray-400">Save songs by tapping the heart icon.</p>
                    </motion.div>
                ) : (
                    <>
                        {/* Table Header */}
                        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-800 mb-2">
                            <div className="col-span-1">#</div>
                            <div className="col-span-6">TITLE</div>
                            <div className="col-span-3">ALBUM</div>
                            <div className="col-span-2 flex justify-end">
                                <Clock className="w-4 h-4" />
                            </div>
                        </div>

                        {/* Songs */}
                        <div className="space-y-1">
                            {songs.map((song, index) => (
                                <motion.div
                                    key={song.id || song.videoId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <SongRow
                                        song={song}
                                        index={index + 1}
                                        onPlay={onSelectSong}
                                        onLikeToggle={onLikeToggle}
                                        isLiked={true}
                                        isPlaying={currentSong && (currentSong.id || currentSong.videoId) === (song.id || song.videoId)}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}