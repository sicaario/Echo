import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Trash2 } from 'lucide-react';
import SongRow from '../SongRow';

export default function RecentlyPlayedView({ 
    songs, 
    onSelectSong, 
    onDeleteSong, 
    onLikeToggle, 
    likedSongs,
    user 
}) {
    if (!user) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Sign in to see your recently played</h1>
                <p className="text-gray-400">Your listening history will appear here</p>
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
                    <Clock className="w-8 h-8 text-green-400" />
                    <h1 className="text-4xl font-bold text-white">Recently Played</h1>
                </div>
                <p className="text-gray-400">Your listening history from the past few weeks</p>
            </motion.div>

            {songs.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center py-16"
                >
                    <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">No recent activity</h2>
                    <p className="text-gray-400">Start listening to see your recently played tracks here.</p>
                </motion.div>
            ) : (
                <>
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm text-gray-400 border-b border-gray-800 mb-2">
                        <div className="col-span-1">#</div>
                        <div className="col-span-6">TITLE</div>
                        <div className="col-span-3">ALBUM</div>
                        <div className="col-span-2 flex justify-end">ACTIONS</div>
                    </div>

                    {/* Songs */}
                    <div className="space-y-1">
                        {songs.map((song, index) => (
                            <motion.div
                                key={`${song.id || song.videoId}-${index}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="group"
                            >
                                <div className="grid grid-cols-12 gap-4 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors">
                                    <div className="col-span-1 flex items-center">
                                        <span className="text-gray-400 text-sm">{index + 1}</span>
                                    </div>
                                    
                                    <div className="col-span-6 flex items-center space-x-3 min-w-0">
                                        <img
                                            src={song.imageUrl || 'https://via.placeholder.com/40'}
                                            alt={song.title}
                                            className="w-10 h-10 rounded object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <button
                                                onClick={() => onSelectSong(song)}
                                                className="text-white font-medium hover:underline truncate block text-left"
                                            >
                                                {song.title}
                                            </button>
                                            <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="col-span-3 flex items-center">
                                        <span className="text-gray-400 text-sm truncate">
                                            {song.album || 'Unknown Album'}
                                        </span>
                                    </div>
                                    
                                    <div className="col-span-2 flex items-center justify-end space-x-2">
                                        <button
                                            onClick={() => onLikeToggle(song, likedSongs.some(liked => 
                                                (liked.id || liked.videoId) === (song.id || song.videoId)
                                            ))}
                                            className={`p-2 rounded-full transition-colors ${
                                                likedSongs.some(liked => 
                                                    (liked.id || liked.videoId) === (song.id || song.videoId)
                                                )
                                                    ? 'text-green-400 hover:text-green-300'
                                                    : 'text-gray-400 hover:text-white'
                                            }`}
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => onDeleteSong(song.id || song.videoId)}
                                            className="p-2 rounded-full text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}