import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Play, 
    Pause, 
    SkipBack, 
    SkipForward, 
    Heart, 
    Volume2, 
    VolumeX,
    Shuffle,
    Repeat,
    Maximize2
} from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';

export default function MusicPlayer({ 
    song, 
    isPlaying, 
    setIsPlaying, 
    likedSongs, 
    onLikeToggle 
}) {
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.7);
    const [isMuted, setIsMuted] = useState(false);
    const [isShuffled, setIsShuffled] = useState(false);
    const [repeatMode, setRepeatMode] = useState('off'); // 'off', 'all', 'one'
    const [showVisualizer, setShowVisualizer] = useState(false);
    
    const audioRef = useRef(null);
    const progressRef = useRef(null);

    const isLiked = song && likedSongs.some(liked => 
        (liked.id || liked.videoId) === (song.id || song.videoId)
    );

    useEffect(() => {
        if (audioRef.current && song?.preview_url) {
            audioRef.current.src = song.preview_url;
            audioRef.current.volume = isMuted ? 0 : volume;
            
            if (isPlaying) {
                audioRef.current.play().catch(console.error);
            } else {
                audioRef.current.pause();
            }
        }
    }, [song, isPlaying, volume, isMuted]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const updateTime = () => setCurrentTime(audio.currentTime);
        const updateDuration = () => setDuration(audio.duration);
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', updateTime);
        audio.addEventListener('loadedmetadata', updateDuration);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateTime);
            audio.removeEventListener('loadedmetadata', updateDuration);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [setIsPlaying]);

    const formatTime = (time) => {
        if (isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const handleProgressClick = (e) => {
        if (!audioRef.current || !progressRef.current) return;
        
        const rect = progressRef.current.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        const newTime = percent * duration;
        
        audioRef.current.currentTime = newTime;
        setCurrentTime(newTime);
    };

    const togglePlayPause = () => {
        if (!song?.preview_url) return;
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        setIsMuted(newVolume === 0);
    };

    const toggleShuffle = () => {
        setIsShuffled(!isShuffled);
    };

    const toggleRepeat = () => {
        const modes = ['off', 'all', 'one'];
        const currentIndex = modes.indexOf(repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setRepeatMode(modes[nextIndex]);
    };

    if (!song) {
        return (
            <div className="h-20 bg-gray-900 border-t border-gray-800 flex items-center justify-center">
                <p className="text-gray-400">No song selected</p>
            </div>
        );
    }

    const progressPercent = duration ? (currentTime / duration) * 100 : 0;

    return (
        <>
            <audio ref={audioRef} />
            
            <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                className="h-20 bg-gray-900 border-t border-gray-800 px-4 flex items-center justify-between"
            >
                {/* Song Info */}
                <div className="flex items-center space-x-3 min-w-0 w-1/4">
                    <img
                        src={song.imageUrl || 'https://via.placeholder.com/56'}
                        alt={song.title}
                        className="w-14 h-14 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                        <h4 className="text-white font-medium truncate">{song.title}</h4>
                        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
                    </div>
                    <motion.button
                        onClick={() => onLikeToggle(song, isLiked)}
                        className={`p-2 rounded-full transition-colors ${
                            isLiked 
                                ? 'text-green-400 hover:text-green-300' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                    </motion.button>
                </div>

                {/* Player Controls */}
                <div className="flex flex-col items-center space-y-2 w-2/4 max-w-md">
                    <div className="flex items-center space-x-4">
                        <motion.button
                            onClick={toggleShuffle}
                            className={`p-2 rounded-full transition-colors ${
                                isShuffled ? 'text-green-400' : 'text-gray-400 hover:text-white'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Shuffle className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <SkipBack className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                            onClick={togglePlayPause}
                            className="w-10 h-10 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={!song?.preview_url}
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5 text-black" fill="currentColor" />
                            ) : (
                                <Play className="w-5 h-5 text-black ml-0.5" fill="currentColor" />
                            )}
                        </motion.button>

                        <motion.button
                            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <SkipForward className="w-5 h-5" />
                        </motion.button>

                        <motion.button
                            onClick={toggleRepeat}
                            className={`p-2 rounded-full transition-colors ${
                                repeatMode !== 'off' ? 'text-green-400' : 'text-gray-400 hover:text-white'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Repeat className="w-4 h-4" />
                            {repeatMode === 'one' && (
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></span>
                            )}
                        </motion.button>
                    </div>

                    {/* Progress Bar */}
                    <div className="flex items-center space-x-2 w-full">
                        <span className="text-xs text-gray-400 min-w-[35px]">
                            {formatTime(currentTime)}
                        </span>
                        <div
                            ref={progressRef}
                            onClick={handleProgressClick}
                            className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group"
                        >
                            <div
                                className="h-full bg-white rounded-full relative group-hover:bg-green-400 transition-colors"
                                style={{ width: `${progressPercent}%` }}
                            >
                                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 min-w-[35px]">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* Volume and Additional Controls */}
                <div className="flex items-center space-x-3 w-1/4 justify-end">
                    <motion.button
                        onClick={() => setShowVisualizer(!showVisualizer)}
                        className={`p-2 rounded-full transition-colors ${
                            showVisualizer ? 'text-green-400' : 'text-gray-400 hover:text-white'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Maximize2 className="w-4 h-4" />
                    </motion.button>

                    <div className="flex items-center space-x-2">
                        <motion.button
                            onClick={toggleMute}
                            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            {isMuted || volume === 0 ? (
                                <VolumeX className="w-4 h-4" />
                            ) : (
                                <Volume2 className="w-4 h-4" />
                            )}
                        </motion.button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={isMuted ? 0 : volume}
                            onChange={handleVolumeChange}
                            className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer slider"
                        />
                    </div>
                </div>
            </motion.div>

            {/* Audio Visualizer Modal */}
            <AnimatePresence>
                {showVisualizer && (
                    <AudioVisualizer
                        isPlaying={isPlaying}
                        song={song}
                        onClose={() => setShowVisualizer(false)}
                        audioRef={audioRef}
                    />
                )}
            </AnimatePresence>
        </>
    );
}