import React from 'react'

export default function RecentlyPlayed({ songs, onSelectSong }) {
    if (!songs.length) {
        return null // Hide section if no songs have been played
    }

    return (
        <div className="mt-6 p-3">
            <h2 className="text-2xl font-semibold mb-4">Recently Played</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {songs.map((song) => (
                    <div
                        key={song.videoId}
                        className="relative bg-gradient-to-b from-gray-800 to-black rounded-lg overflow-hidden cursor-pointer hover:scale-105 transform transition-transform duration-300"
                        onClick={() => onSelectSong(song)} // Set as current song
                    >
                        <img
                            src={song.imageUrl || 'https://via.placeholder.com/150'}
                            alt={song.title}
                            className="w-full h-32 object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-60">
                            <p className="text-sm font-bold truncate">{song.title}</p>
                            <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
