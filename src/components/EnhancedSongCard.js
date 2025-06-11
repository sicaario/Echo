import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, MoreHorizontal, Plus } from 'lucide-react';

export default function EnhancedSongCard({ song, onPlay, onLikeToggle, isLiked, size = 'medium' }) {
    const [isHovered, setIsHovered] = useState(false);

    const formatDuration = (ms) => {
        if (!ms) return '';
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    const sizeClasses = {
        small: 'w-32',
        medium: 'w-48',
        large: 'w-64'
    };

    return (
        <motion.div
            className={`${sizeClasses[size]} bg-gray-900 hover:bg-gray-800 p-4 rounded-lg transition-all duration-300 cursor-pointer group`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="relative mb-4">
                <img
                    src={song.imageUrl || 'https://via.placeholder.com/200'}
                    alt={song.title}
                    className="w-full aspect-square object-cover rounded-lg shadow-lg"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Play Button Overlay */}
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        onPlay(song);
                    }}
                    className="absolute bottom-2 right-2 w-12 h-12 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.8, y: 8 }}
                    animate={{ 
                        opacity: isHovered ? 1 : 0, 
                        scale: isHovered ? 1 : 0.8,
                        y: isHovered ? 0 : 8
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                </motion.button>

                {/* Like Button */}
                <motion.button
                    onClick={(e) => {
                        e.stopPropagation();
                        onLikeToggle(song, isLiked);
                    }}
                    className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isLiked 
                            ? 'bg-green-500 text-white' 
                            : 'bg-black/50 text-white hover:bg-black/70'
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                        opacity: isHovered || isLiked ? 1 : 0, 
                        scale: isHovered || isLiked ? 1 : 0.8 
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                </motion.button>
            </div>

            <div className="space-y-2">
                <h3 className="text-white font-semibold truncate group-hover:text-green-400 transition-colors text-sm">
                    {song.title}
                </h3>
                <p className="text-gray-400 text-xs truncate">{song.artist}</p>
                
                {song.album && (
                    <p className="text-gray-500 text-xs truncate">{song.album}</p>
                )}
            </div>

            {/* Action Buttons */}
            <motion.div 
                className="flex items-center justify-between mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
            >
                <div className="flex items-center space-x-2">
                    <button className="p-1 rounded-full text-gray-400 hover:text-white transition-colors">
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                
                <div className="flex items-center space-x-2">
                    {song.duration && (
                        <span className="text-xs text-gray-500">{formatDuration(song.duration)}</span>
                    )}
                    <button className="p-1 rounded-full text-gray-400 hover:text-white transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}