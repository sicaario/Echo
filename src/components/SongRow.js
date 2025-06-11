import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Heart, MoreHorizontal, Clock } from 'lucide-react';

export default function SongRow({ 
    song, 
    index, 
    onPlay, 
    onLikeToggle, 
    isLiked, 
    isPlaying = false 
}) {
    const [isHovered, setIsHovered] = useState(false);

    const formatDuration = (ms) => {
        if (!ms) return '--:--';
        const minutes = Math.floor(ms / 60000);
        const seconds = ((ms % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    return (
        <motion.div
            className="grid grid-cols-12 gap-4 px-4 py-2 rounded-md hover:bg-gray-800 transition-colors group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
        >
            {/* Index/Play Button */}
            <div className="col-span-1 flex items-center">
                {isHovered ? (
                    <motion.button
                        onClick={() => onPlay(song)}
                        className="w-4 h-4 flex items-center justify-center text-white hover:text-green-400 transition-colors"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {isPlaying ? (
                            <Pause className="w-4 h-4" fill="currentColor" />
                        ) : (
                            <Play className="w-4 h-4" fill="currentColor" />
                        )}
                    </motion.button>
                ) : (
                    <span className={`text-sm ${isPlaying ? 'text-green-400' : 'text-gray-400'}`}>
                        {index}
                    </span>
                )}
            </div>

            {/* Title and Artist */}
            <div className="col-span-6 flex items-center space-x-3 min-w-0">
                <img
                    src={song.imageUrl || 'https://via.placeholder.com/40'}
                    alt={song.title}
                    className="w-10 h-10 rounded object-cover"
                />
                <div className="min-w-0 flex-1">
                    <button
                        onClick={() => onPlay(song)}
                        className={`font-medium hover:underline truncate block text-left ${
                            isPlaying ? 'text-green-400' : 'text-white'
                        }`}
                    >
                        {song.title}
                    </button>
                    <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                </div>
            </div>

            {/* Album */}
            <div className="col-span-3 flex items-center">
                <span className="text-gray-400 text-sm truncate hover:text-white hover:underline cursor-pointer">
                    {song.album || 'Unknown Album'}
                </span>
            </div>

            {/* Actions and Duration */}
            <div className="col-span-2 flex items-center justify-end space-x-2">
                <motion.button
                    onClick={() => onLikeToggle(song, isLiked)}
                    className={`p-2 rounded-full transition-colors opacity-0 group-hover:opacity-100 ${
                        isLiked 
                            ? 'text-green-400 hover:text-green-300 opacity-100' 
                            : 'text-gray-400 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                </motion.button>

                <span className="text-gray-400 text-sm min-w-[40px] text-right">
                    {formatDuration(song.duration)}
                </span>

                <button className="p-2 rounded-full text-gray-400 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
}