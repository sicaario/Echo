// LikedSongs.js
import React from 'react'
import { MdArrowUpward, MdArrowDownward } from 'react-icons/md'

export default function LikedSongs({ songs, onSelectSong, onReorder }) {
    if (!songs || songs.length === 0) {
        return (
            <div className="p-4">
                <p className="text-lg font-bold">No liked songs yet.</p>
            </div>
        )
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl mb-4 font-bold">Your Liked Songs</h2>
            <ul className="space-y-4">
                {songs.map((song, index) => (
                    <li
                        key={song.videoId}
                        className="bg-white bg-opacity-10 p-2 rounded-md flex items-center justify-between h-16"
                    >
                        {/* Click song to select and play */}
                        <div
                            className="cursor-pointer overflow-hidden flex-1"
                            onClick={() => onSelectSong(song)}
                        >
                            {/* Truncate the song title */}
                            <div className="font-bold text-lg truncate">{song.title}</div>
                            <div className="text-sm text-gray-300 truncate">{song.artist}</div>
                        </div>

                        {/* Up/Down arrows for reordering */}
                        <div className="flex items-center space-x-2">
                            {/* Move Up */}
                            <button
                                onClick={() => onReorder(index, index - 1)}
                                disabled={index === 0}
                                className={`p-1 rounded ${
                                    index === 0
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-pink-500"
                                }`}
                            >
                                <MdArrowUpward size={20}/>
                            </button>

                            {/* Move Down */}
                            <button
                                onClick={() => onReorder(index, index + 1)}
                                disabled={index === songs.length - 1}
                                className={`p-1 rounded ${
                                    index === songs.length - 1
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-pink-500"
                                }`}
                            >
                                <MdArrowDownward size={20}/>
                            </button>
                        </div>
                    </li>

                ))}
            </ul>
        </div>
    )
}
