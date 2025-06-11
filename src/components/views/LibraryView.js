import React from 'react';
import { motion } from 'framer-motion';
import { Library, Heart, Clock, Music } from 'lucide-react';

export default function LibraryView({ likedSongs, recentlyPlayed, onSelectSong, user }) {
    if (!user) {
        return (
            <div className="p-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-4">Sign in to see your library</h1>
                <p className="text-gray-400">Your saved music and playlists will appear here</p>
            </div>
        );
    }

    const libraryItems = [
        {
            id: 'liked-songs',
            title: 'Liked Songs',
            subtitle: `${likedSongs.length} songs`,
            icon: Heart,
            color: 'from-purple-400 to-pink-600',
            songs: likedSongs
        },
        {
            id: 'recently-played',
            title: 'Recently Played',
            subtitle: `${recentlyPlayed.length} songs`,
            icon: Clock,
            color: 'from-green-400 to-blue-500',
            songs: recentlyPlayed
        }
    ];

    return (
        <div className="p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
            >
                <div className="flex items-center space-x-3 mb-4">
                    <Library className="w-8 h-8 text-green-400" />
                    <h1 className="text-4xl font-bold text-white">Your Library</h1>
                </div>
                <p className="text-gray-400">Your saved music and playlists</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {libraryItems.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors cursor-pointer group"
                    >
                        <div className="flex items-center space-x-4 mb-4">
                            <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center`}>
                                <item.icon className="w-8 h-8 text-white" fill="currentColor" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                                <p className="text-gray-400">{item.subtitle}</p>
                            </div>
                        </div>

                        {item.songs.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-gray-400 mb-2">Recent tracks:</h4>
                                {item.songs.slice(0, 3).map((song, songIndex) => (
                                    <motion.button
                                        key={song.id || song.videoId}
                                        onClick={() => onSelectSong(song)}
                                        className="w-full flex items-center space-x-3 p-2 rounded hover:bg-gray-600 transition-colors text-left"
                                        whileHover={{ x: 4 }}
                                    >
                                        <img
                                            src={song.imageUrl || 'https://via.placeholder.com/32'}
                                            alt={song.title}
                                            className="w-8 h-8 rounded object-cover"
                                        />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-white text-sm font-medium truncate">{song.title}</p>
                                            <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}