import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal } from 'lucide-react';

export default function SongCard({ song, onPlay, onLikeToggle, isLiked }) {
    const [isHovered, setIsHovered] = useState(false);

    const formatDuration = (ms) => {
        if (!ms) return '';
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    return (
        <motion.div
            className="bg-gray-800 p-4 rounded-lg hover:bg-gray-700 transition-all duration-300 cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <div className="relative mb-4">
                <img
                    src={song.imageUrl || 'https://via.placeholder.com/200'}
                    alt={song.title}
                    className="w-full aspect-square object-cover rounded-md shadow-lg"
                />
                
                {/* Play Button Overlay */}
                <motion.button
                    onClick={() => onPlay(song)}
                    className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                        opacity: isHovered ? 1 : 0, 
                        scale: isHovered ? 1 : 0.8 
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                </motion.button>
            </div>

            <div className="space-y-2">
                <h3 className="text-white font-semibold truncate group-hover:text-green-400 transition-colors">
                    {song.title}
                </h3>
                <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                
                {song.duration && (
                    <p className="text-gray-500 text-xs">{formatDuration(song.duration)}</p>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onLikeToggle(song, isLiked);
                    }}
                    className={`p-2 rounded-full transition-colors ${
                        isLiked 
                            ? 'text-green-400 hover:text-green-300' 
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                </button>
                
                <button className="p-2 rounded-full text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}