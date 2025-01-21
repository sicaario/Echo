import React, { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player/youtube'
import {
    MdFavoriteBorder,
    MdFavorite,
    MdSkipPrevious,
    MdSkipNext,
    MdPlayArrow,
    MdPause,
    MdOpenInFull,
    MdClose
} from 'react-icons/md'
import NowPlaying from './NowPlaying'

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

    // Whether the "Reels" style player is shown on the right (desktop)
    const [showVideo, setShowVideo] = useState(false)

    const audioPlayerRef = useRef(null) // For the hidden audio player
    const reelsPlayerRef = useRef(null) // For the reels player
    const hasSong = Boolean(song?.videoId)

    // Is current track in liked songs?
    const isCurrentTrackLiked = likedSongs.some(
        (item) => item.videoId === song?.videoId
    )

    // Auto-play logic for next track
    useEffect(() => {
        if (!hasSong) {
            setIsPlaying(false)
            setAutoPlayNextSong(false)
        } else {
            if (autoPlayNextSong) {
                setIsPlaying(true)
                setAutoPlayNextSong(false)
            } else {
                // Start paused unless we explicitly said to auto-play
                setIsPlaying(false)
            }
        }
    }, [song, autoPlayNextSong, hasSong])

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

    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60).toString().padStart(2, '0')
        return `${minutes}:${seconds}`
    }

    return (
        <div className="w-full h-full bg-black bg-opacity-60 backdrop-blur-sm flex items-center text-white px-4 md:px-8 relative">

            {/* (1) Left Section: Song Info + Like + Expand */}
            <div className="flex items-center w-1/3 min-w-0">
                <NowPlaying title={song?.title} artist={song?.artist} />

                {hasSong && (
                    <>
                        {/* Like Button */}
                        <button
                            className="ml-4 text-pink-400 hover:text-pink-300 transition-colors"
                            onClick={() => onLikeToggle?.(song, isCurrentTrackLiked)}
                        >
                            {isCurrentTrackLiked ? <MdFavorite size={24} /> : <MdFavoriteBorder size={24} />}
                        </button>

                        {/* Expand/Close Reels (Desktop only) */}
                        <button
                            className="hidden lg:block ml-4 text-blue-400 hover:text-blue-300 transition-colors"
                            onClick={() => setShowVideo((prev) => !prev)}
                        >
                            {showVideo ? <MdClose size={24} /> : <MdOpenInFull size={24} />}
                        </button>
                    </>
                )}
            </div>

            {/* (2) Middle Controls: Prev / Play/Pause / Next */}
            <div className="w-1/3 md:static absolute bottom-[40rem] -right-4 flex flex-col items-center justify-center">
                <div className="justify-center items-center space-x-6">
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
                </div>
            </div>

            {/* (3) Seek bar (desktop only) */}
            <div className="hidden md:flex items-center space-x-4 mt-2 w-[33%]">
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

            {/* (4) AUDIO-ONLY PLAYER */}
            {hasSong && (
                <ReactPlayer
                    ref={audioPlayerRef}
                    url={`https://www.youtube.com/watch?v=${song.videoId}`}
                    playing={!showVideo && isPlaying}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onEnded={handleTrackEnd}
                    width="0"
                    height="0"
                    config={{
                        youtube: {
                            playerVars: {
                                disablekb: 1,
                                // No need for "vq" here because it's audio-only
                            }
                        }
                    }}
                />
            )}

            {/* (5) REELS-STYLE VIDEO PLAYER (desktop) */}
            {hasSong && (
                <div
                    className={`
            hidden lg:flex fixed bottom-20 right-0 z-50
            transform transition-transform duration-500
            rounded-2xl bg-black
            ${showVideo ? 'translate-x-0' : 'translate-x-full'}
            // Dimensions for large screens, adjust as you see fit
             h-[700px] w-[360px]
          `}
                >
                    <div className="relative w-full h-full overflow-hidden rounded-2xl">
                        <ReactPlayer
                            ref={reelsPlayerRef}
                            url={`https://www.youtube.com/watch?v=${song.videoId}`}
                            playing={showVideo && isPlaying}
                            onProgress={handleProgress}
                            onDuration={handleDuration}
                            onEnded={handleTrackEnd}
                            // We'll enlarge the video but also request HD
                            width="120%"
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
                                        // Request 1080p playback (YouTube may or may not honor)
                                        vq: 'hd1080'
                                    }
                                }
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
