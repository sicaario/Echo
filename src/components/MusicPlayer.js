import React, { useState, useRef } from 'react'
import ReactPlayer from 'react-player/youtube'
import {
    MdFavoriteBorder,
    MdFavorite,
    MdSkipPrevious,
    MdSkipNext,
    MdPlayArrow,
    MdPause,
    MdVolumeUp
} from 'react-icons/md'
import NowPlaying from "./NowPlaying";

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
    const playerRef = useRef(null)

    // If there's no valid YouTube videoId
    const hasSong = Boolean(song && song.videoId)

    // Check if the current song is actually in likedSongs
    const isSongFromLiked = likedSongs.some(
        (item) => item.videoId === song?.videoId
    )

    // Toggle play/pause
    const handlePlayPause = () => {
        if (!isSongFromLiked) return // ignore if not from liked
        setIsPlaying((prev) => !prev)
    }

    // ReactPlayer progress
    const handleProgress = (state) => {
        setPlayedSeconds(state.playedSeconds)
    }

    // Once we know total duration
    const handleDuration = (dur) => {
        setDuration(dur)
    }

    // Seek
    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value)
        setPlayedSeconds(newTime)
        if (playerRef.current) {
            playerRef.current.seekTo(newTime, 'seconds')
        }
    }

    // Format mm:ss
    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00'
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60).toString().padStart(2, '0')
        return `${minutes}:${seconds}`
    }

    // Are we showing a filled heart or outline?
    const isCurrentTrackLiked = likedSongs.some(
        (item) => item.videoId === song?.videoId
    )

    return (
        <div
            className="w-full h-full bg-black bg-opacity-60 backdrop-blur-sm flex items-center text-white px-4 md:px-8">
            {/* Left: Cover + Info + Like */}
            <div className="flex items-center w-1/3 min-w-0">

                <NowPlaying title={song?.title} artist={song?.artist}/>


                {/* Like button (only if we have a valid song) */}
                {hasSong && (
                    <button
                        className="ml-4 text-pink-400 hover:text-pink-300 transition-colors"
                        onClick={() => onLikeToggle?.(song, isCurrentTrackLiked)}
                    >
                        {isCurrentTrackLiked ? (
                            <MdFavorite size={24}/>
                        ) : (
                            <MdFavoriteBorder size={24}/>
                        )}
                    </button>
                )}
            </div>

            {/* Middle: Controls + Seekbar */}
            <div className="w-1/3 flex flex-col items-center justify-center">
                <div className="flex items-center space-x-6">
                    {/* Prev/Next only if Liked panel is active */}
                    {isLikedPanelActive && (
                        <button
                            className="hover:text-pink-400 transition-colors"
                            onClick={onPrevLikedSong}
                            disabled={!hasSong}
                        >
                            <MdSkipPrevious size={28}/>
                        </button>
                    )}

                    {/* Play/Pause - disabled if not from likedSongs */}
                    <button
                        className={`bg-purple-600 hover:bg-purple-500 transition-colors rounded-full p-2 ${
                            !isSongFromLiked ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handlePlayPause}
                        disabled={!hasSong}
                    >
                        {isPlaying ? <MdPause size={28}/> : <MdPlayArrow size={28}/>}
                    </button>

                    {isLikedPanelActive && (
                        <button
                            className="hover:text-pink-400 transition-colors"
                            onClick={onNextLikedSong}
                            disabled={!hasSong}
                        >
                            <MdSkipNext size={28}/>
                        </button>
                    )}
                </div>

                {/* Seek bar (Desktop only) */}
                <div className="hidden md:flex items-center space-x-4 mt-2 w-full">
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


            {/* Right: Volume (Desktop only) */}
            <div className="w-1/3 hidden md:flex items-center justify-end space-x-2">
                <MdVolumeUp size={24}/>
                <input
                    type="range"
                    className="w-24 h-1 bg-gray-300 rounded-full cursor-pointer"
                    min="0"
                    max="1"
                    step="0.01"
                    onChange={(e) => {
                        const volume = parseFloat(e.target.value)
                        if (playerRef.current) {
                            playerRef.current.setVolume(volume)
                        }
                    }}
                    disabled={!hasSong}
                />
            </div>

            {/* ReactPlayer: hidden video */}
            {hasSong && (
                <ReactPlayer
                    ref={playerRef}
                    url={`https://www.youtube.com/watch?v=${song.videoId}`}
                    playing={isPlaying}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    width="0"
                    height="0"
                    config={{
                        youtube: {
                            playerVars: {disablekb: 1}
                        }
                    }}
                />
            )}
        </div>
    )
}
