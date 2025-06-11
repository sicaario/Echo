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
    Maximize2,
    PictureInPicture,
    Mic2,
    List,
    Monitor
} from 'lucide-react';
import SpotifyCanvas from './SpotifyCanvas';

export default function EnhancedMusicPlayer({ 
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
    const [repeatMode, setRepeatMode] = useState('off');
    const [showCanvas, setShowCanvas] = useState(true);
    const [showQueue, setShowQueue] = useState(false);
    const [showLyrics, setShowLyrics] = useState(false);
    
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
            <div className="h-24 bg-gray-900 border-t border-gray-800 flex items-center justify-center">
                <p className="text-gray-400">Select a song to start playing</p>
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
                className="h-24 bg-gradient-to-r from-gray-900 via-black to-gray-900 border-t border-gray-800 px-4 flex items-center justify-between backdrop-blur-md"
            >
                {/* Song Info with Canvas */}
                <div className="flex items-center space-x-4 min-w-0 w-1/3">
                    <div className="relative">
                        {showCanvas ? (
                            <div className="w-16 h-16 rounded-lg overflow-hidden">
                                <SpotifyCanvas 
                                    song={song} 
                                    isPlaying={isPlaying} 
                                    className="w-full h-full"
                                />
                            </div>
                        ) : (
                            <img
                                src={song.imageUrl || 'https://via.placeholder.com/64'}
                                alt={song.title}
                                className="w-16 h-16 rounded-lg object-cover shadow-lg"
                            />
                        )}
                        <button
                            onClick={() => setShowCanvas(!showCanvas)}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-black bg-opacity-70 rounded-full flex items-center justify-center text-white hover:bg-opacity-90 transition-all"
                        >
                            <Monitor className="w-3 h-3" />
                        </button>
                    </div>
                    <div className="min-w-0 flex-1">
                        <h4 className="text-white font-semibold truncate hover:underline cursor-pointer">
                            {song.title}
                        </h4>
                        <p className="text-gray-400 text-sm truncate hover:underline cursor-pointer">
                            {song.artist}
                        </p>
                    </div>
                    <div className="flex items-center space-x-2">
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
                        <motion.button
                            onClick={() => setShowLyrics(!showLyrics)}
                            className={`p-2 rounded-full transition-colors ${
                                showLyrics ? 'text-green-400' : 'text-gray-400 hover:text-white'
                            }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Mic2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                            className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <PictureInPicture className="w-4 h-4" />
                        </motion.button>
                    </div>
                </div>

                {/* Player Controls */}
                <div className="flex flex-col items-center space-y-3 w-2/5 max-w-lg">
                    <div className="flex items-center space-x-6">
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
                            className="w-12 h-12 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center transition-all shadow-lg"
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
                            className={`p-2 rounded-full transition-colors relative ${
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
                    <div className="flex items-center space-x-3 w-full">
                        <span className="text-xs text-gray-400 min-w-[40px] text-right">
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
                                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"></div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 min-w-[40px]">
                            {formatTime(duration)}
                        </span>
                    </div>
                </div>

                {/* Volume and Additional Controls */}
                <div className="flex items-center space-x-4 w-1/3 justify-end">
                    <motion.button
                        onClick={() => setShowQueue(!showQueue)}
                        className={`p-2 rounded-full transition-colors ${
                            showQueue ? 'text-green-400' : 'text-gray-400 hover:text-white'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <List className="w-4 h-4" />
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
                            className="w-24 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer slider"
                        />
                    </div>

                    <motion.button
                        className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <Maximize2 className="w-4 h-4" />
                    </motion.button>
                </div>
            </motion.div>
        </>
    );
}