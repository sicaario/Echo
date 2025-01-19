import React, { useState, useRef, useEffect } from 'react'
import ReactPlayer from 'react-player/youtube'
import {
    MdFavoriteBorder,
    MdFavorite,
    MdSkipPrevious,
    MdSkipNext,
    MdPlayArrow,
    MdPause,
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
    const [playedSeconds, setPlayedSeconds] = useState(0);
    const [duration, setDuration] = useState(0);

    // Tracks whether the player is currently playing or not
    const [isPlaying, setIsPlaying] = useState(false);

    // Used to allow auto-playing the next song ONLY when the current one finishes
    const [autoPlayNextSong, setAutoPlayNextSong] = useState(false);

    const playerRef = useRef(null);

    // Has valid YouTube videoId?
    const hasSong = Boolean(song && song.videoId);

    // Check if current song is in likedSongs
    const isCurrentTrackLiked = likedSongs.some(
        (item) => item.videoId === song?.videoId
    );

    /**
     * Whenever the `song` changes, decide whether to keep playing or not.
     * - If this change was triggered by the end of the previous track (autoPlayNextSong = true),
     *   continue playing.
     * - Otherwise, do not autoplay; user must click play.
     */
    useEffect(() => {
        if (!song?.videoId) {
            // No valid song: reset states
            setIsPlaying(false);
            setAutoPlayNextSong(false);
        } else {
            if (autoPlayNextSong) {
                setIsPlaying(true);
                setAutoPlayNextSong(false);
            } else {
                // Do NOT auto-play if the user manually selected or skipped to this song
                setIsPlaying(false);
            }
        }
    }, [song, autoPlayNextSong]);

    // Play/Pause toggle (only disabled if no valid song at all)
    const handlePlayPause = () => {
        if (!hasSong) return; // do nothing if there's no valid song loaded
        setIsPlaying((prev) => !prev);
    };

    // Keep track of current playback progress (in seconds)
    const handleProgress = (state) => {
        setPlayedSeconds(state.playedSeconds);
    };

    // Once we know the total duration
    const handleDuration = (dur) => {
        setDuration(dur);
    };

    // Seek to a specific time on the timeline
    const handleSeek = (e) => {
        const newTime = parseFloat(e.target.value);
        setPlayedSeconds(newTime);
        if (playerRef.current) {
            playerRef.current.seekTo(newTime, 'seconds');
        }
    };

    // When the track finishes:
    // - If we are in the Liked Songs panel and the track was actually playing, skip to the next liked song
    // - Then set autoPlayNextSong so that the newly loaded song continues playing
    const handleTrackEnd = () => {
        if (isPlaying && isLikedPanelActive && onNextLikedSong) {
            setAutoPlayNextSong(true);
            onNextLikedSong();
        }
    };

    // Helper: format time as mm:ss
    const formatTime = (time) => {
        if (!time || isNaN(time)) return '0:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60).toString().padStart(2, '0');
        return `${minutes}:${seconds}`;
    };

    return (
        <div
            className="w-full h-full bg-black bg-opacity-60 backdrop-blur-sm flex items-center text-white px-4 md:px-8">

            {/* Left Section: Cover/Info + Like Button */}
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

            {/* Middle Section: Controls + Seekbar */}
            <div className="w-1/3 md:static absolute bottom-[40rem] -right-4 flex flex-col items-center justify-center">
                <div className=" justify-center items-center space-x-6">

                    {/* Prev/Next only if Liked panel is active */}
                    {isLikedPanelActive && (
                        <button
                            className="hover:text-pink-400 transition-colors md:static absolute top-[33rem] right-[23rem]"
                            onClick={onPrevLikedSong}
                            disabled={!hasSong}
                        >
                            <MdSkipPrevious size={28}/>
                        </button>
                    )}

                    {/* Play/Pause */}
                    <button
                        className={`bg-purple-600 hover:bg-purple-500 transition-colors rounded-full p-2 md:static absolute top-[32rem] right-[12rem] ${
                            !hasSong ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handlePlayPause}
                        disabled={!hasSong}
                    >
                        {isPlaying ? <MdPause size={28}/> : <MdPlayArrow size={28}/>}
                    </button>

                    {isLikedPanelActive && (
                        <button
                            className="hover:text-pink-400 transition-colors md:static absolute top-[33rem] right-[2rem]  "
                            onClick={onNextLikedSong}
                            disabled={!hasSong}
                        >
                            <MdSkipNext size={28}/>
                        </button>
                    )}
                </div>

                {/* Seek bar (Desktop only) */}

            </div>
            <div className="hidden md:flex items-center space-x-4 mt-2 w-[33%] ">
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


            {/* ReactPlayer: Invisible but manages YouTube playback */}
            {hasSong && (
                <ReactPlayer
                    ref={playerRef}
                    url={`https://www.youtube.com/watch?v=${song.videoId}`}
                    playing={isPlaying}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    onEnded={handleTrackEnd}
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
