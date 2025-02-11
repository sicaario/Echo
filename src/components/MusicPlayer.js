import React, { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player/youtube'
import { FaYoutube } from "react-icons/fa";
import { LuPanelRightClose } from "react-icons/lu";
import {
    MdFavoriteBorder,
    MdFavorite,
    MdSkipPrevious,
    MdSkipNext,
    MdPlayArrow,
    MdPause,
} from 'react-icons/md'
import { motion } from 'framer-motion'

export default function MusicPlayer({
                                        song,
                                        likedSongs = [],
                                        isLikedPanelActive,
                                        onLikeToggle,
                                        onPrevLikedSong,
                                        onNextLikedSong
                                    }) {
    const [playedSeconds, setPlayedSeconds] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [autoPlayNextSong, setAutoPlayNextSong] = useState(false)
    const [showVideo, setShowVideo] = useState(false)

    const audioPlayerRef = useRef(null)
    const reelsPlayerRef = useRef(null)


    const hasSong = Boolean(song?.videoId)

    // Provide default values when there's no valid song
    const defaultSong = {
        title: 'Neon Nights',
        artist: 'Cyber punk',
        imageUrl: 'logo.png',
        videoId: ''
    }

    // Use either the actual song or fallback to the defaults
    const currentSong = hasSong ? song : defaultSong
    const { videoId, title, artist, imageUrl } = currentSong

    // Check if current track is liked
    const isCurrentTrackLiked = likedSongs.some((item) => item.videoId === videoId)

    // Handle auto-play logic (like skipping to next in liked panel
    useEffect(() => {
        if (!hasSong) {
            setIsPlaying(false)
            setAutoPlayNextSong(false)
        } else {
            if (autoPlayNextSong) {
                setIsPlaying(true)
                setAutoPlayNextSong(false)
            } else {
                // Default to paused if not explicitly auto-playing
                setIsPlaying(false)
            }
        }
    }, [song, hasSong, autoPlayNextSong])

    const handlePlayPause = () => {
        if (!hasSong) return
        setIsPlaying((prev) => !prev)
    }

    const handleProgress = (state) => {
        setPlayedSeconds(state.playedSeconds)
    }

    const handleDuration = (dur) => {
        setDuration(dur)
    }

    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value)
        setPlayedSeconds(newTime)

        if (audioPlayerRef.current) {
            audioPlayerRef.current.seekTo(newTime, 'seconds')
        }
        if (reelsPlayerRef.current) {
            reelsPlayerRef.current.seekTo(newTime, 'seconds')
        }
    }

    const handleTrackEnd = () => {
        if (isPlaying && isLikedPanelActive && onNextLikedSong) {
            setAutoPlayNextSong(true)
            onNextLikedSong()
        }
    }

    // Convert seconds to MM:SS
    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60).toString().padStart(2, '0')
        return `${minutes}:${seconds}`
    }

    return (
        <div className="w-full h-full bg-black bg-opacity-60 backdrop-blur-sm flex items-center text-white px-4 md:px-8 relative">
            {/* (1) Left Section: Thumbnail, Title/Artist, and Like Button */}
            <div className="flex items-center md:w-[30%] min-w-0">
                {/* Image + Text in one flex row (with possible grow) */}
                <div className="flex items-center min-w-0 flex-grow space-x-4">
                    {/* Thumbnail */}
                    <img
                        src={imageUrl}
                        alt={title}
                        className=" w-16 h-14 object-cover rounded-full"
                    />

                    {/* Title & Artist (truncate so long text doesn't push the button) */}
                    <div className="flex flex-col min-w-0">
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg font-bold truncate"
                        >
                            {title}
                        </motion.div>
                        <motion.div
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-sm text-purple-200 truncate"
                        >
                            {artist}
                        </motion.div>
                    </div>
                </div>

                {/* Like Button (kept separate, so it doesn't shift) */}
                {hasSong && (
                    <button
                        className="ml-4 text-pink-400 hover:text-pink-300 transition-colors"
                        onClick={() => onLikeToggle?.(currentSong, isCurrentTrackLiked)}
                    >
                        {isCurrentTrackLiked ? (
                            <MdFavorite size={24} />
                        ) : (
                            <MdFavoriteBorder size={24} />
                        )}
                    </button>
                )}
            </div>

            {/* (2) Middle Controls + (3) Seek bar (hidden on mobile) */}
            <div className="w-[40%] md:static absolute bottom-[40rem] -right-4 flex flex-col items-center justify-center">
                {/* Controls row */}
                <div className="flex justify-center items-center space-x-6">
                    {isLikedPanelActive && (
                        <button
                            className="hover:text-pink-400 transition-colors md:static absolute top-[33rem] right-[23rem]"
                            onClick={onPrevLikedSong}
                            disabled={!hasSong}
                        >
                            <MdSkipPrevious size={28} />
                        </button>
                    )}

                    <button
                        className={`bg-purple-600 hover:bg-purple-500 transition-colors rounded-full p-2 md:static absolute top-[32rem] right-[12rem] ${
                            !hasSong ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handlePlayPause}
                        disabled={!hasSong}
                    >
                        {isPlaying ? <MdPause size={28} /> : <MdPlayArrow size={28} />}
                    </button>

                    {isLikedPanelActive && (
                        <button
                            className="hover:text-pink-400 transition-colors md:static absolute top-[33rem] right-[2rem]"
                            onClick={onNextLikedSong}
                            disabled={!hasSong}
                        >
                            <MdSkipNext size={28} />
                        </button>
                    )}

                    {/* Expand/Close button for the Reels-style video */}
                    {hasSong && (
                        <button
                            className="hidden lg:block absolute right-10 text-blue-400 hover:text-blue-300 transition-colors"
                            onClick={() => setShowVideo((prev) => !prev)}
                        >
                            {showVideo ? <LuPanelRightClose size={27} /> : <FaYoutube size={35} />}
                        </button>
                    )}
                </div>

                {/* Seek bar (desktop only) */}
                <div className="hidden md:flex items-center space-x-4 mt-3 w-full justify-center">
                    <span className="text-sm">{formatTime(playedSeconds)}</span>
                    <input
                        type="range"
                        className="flex-1 h-1 bg-gray-300 rounded-full cursor-pointer"
                        min="0"
                        max={duration}
                        step="1"
                        value={playedSeconds}
                        onChange={handleSeek}
                        disabled={!hasSong}
                    />
                    <span className="text-sm">{formatTime(duration)}</span>
                </div>
            </div>

            {/*AUDIO-ONLY PLAYER (hidden visually) */}
            {hasSong && (
                <ReactPlayer
                    ref={audioPlayerRef}
                    url={`https://www.youtube.com/watch?v=${videoId}`}
                    playing={!showVideo && isPlaying}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onEnded={handleTrackEnd}
                    width="0"
                    height="0"
                    config={{
                        youtube: {
                            playerVars: {
                                disablekb: 1
                            }
                        }
                    }}
                />
            )}

            {/* REELS-STYLE VIDEO (Desktop) */}
            {hasSong && (
                <div
                    className={`
            hidden lg:flex fixed 2xl:bottom-20 bottom-[166px] right-0 z-50 transform transition-transform duration-500
            rounded-tl-lg bg-black
            ${showVideo ? 'translate-x-0' : 'translate-x-full'}
            h-[760px] 2xl:h-[1000px] 2xl:w-[50%] w-[30%]
          `}
                >
                    <div className="relative w-full h-full overflow-hidden rounded-tl-lg">
                        <ReactPlayer
                            ref={reelsPlayerRef}
                            url={`https://www.youtube.com/watch?v=${videoId}`}
                            playing={showVideo && isPlaying}
                            onProgress={handleProgress}
                            onDuration={handleDuration}
                            onEnded={handleTrackEnd}
                            width="136%"
                            height="100%"
                            className="absolute top-1/2 left-1/2"
                            style={{
                                transform: 'translate(-50%, -50%) scale(4)',
                                transformOrigin: 'center center'
                            }}
                            config={{
                                youtube: {
                                    playerVars: {
                                        disablekb: 1,
                                        playsinline: 1,
                                        vq: 'hd1080'
                                    }
                                }
                            }}
                        />
                    </div>

                    {/* Title/Artist overlay at bottom of the Reels-style video */}
                    <div className="absolute 2xl:w-full w-full h-[7rem] 2xl:h-[7rem] top-[735px] 2xl:top-[890px] z-10 p-2 bg-black/60  text-white overflow-hidden">
                        <div className="flex h-10 w-full items-center justify-center gap-1">
                            {Array.from({ length: 20 }).map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: '20%' }}
                                    animate={{ height: ['20%', '90%', '20%'] }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: Infinity,
                                        delay: i * 0.1,
                                        ease: 'easeInOut'
                                    }}
                                    className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full"
                                />
                            ))}
                        </div>
                        <h3 className="font-semibold text-lg">
                            {title || 'Unknown Title'}
                        </h3>
                        <p className="text-sm text-gray-200">
                            {artist || 'Unknown Artist'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}


