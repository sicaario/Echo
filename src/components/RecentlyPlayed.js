// src/components/RecentlyPlayed.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaTrash } from 'react-icons/fa'; 

export default function RecentlyPlayed({ songs, onSelectSong, onDeleteSong }) {
    if (!songs.length) {
        return null; 
    }

    return (
        <div className="mt-6 md:p-3">
            <h2 className="text-2xl font-semibold mb-4">Recently Played</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {songs.map((song) => (
                    <div
                        key={song.videoId}
                        className="relative bg-gradient-to-b md:h-48 from-gray-800 to-black rounded-lg overflow-hidden"
                    >
                        <div
                            className="cursor-pointer hover:scale-105 transform transition-transform duration-300 h-full"
                            onClick={() => onSelectSong(song)} // Set as current song
                        >
                            <img
                                src={song.imageUrl || 'https://via.placeholder.com/150'}
                                alt={song.title}
                                className="w-full h-32 object-cover rounded-t-lg"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-black bg-opacity-60">
                                <p className="text-sm font-bold truncate">{song.title}</p>
                                <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                            </div>
                        </div>
                        <button
                            className="absolute bottom-11 right-1 text-red-500 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 transition"
                            onClick={() => {
                                console.log(`Attempting to delete song with videoId: ${song.videoId}`);
                                onDeleteSong(song.videoId);
                            }}
                            aria-label="Delete Song"
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

RecentlyPlayed.propTypes = {
    songs: PropTypes.arrayOf(
        PropTypes.shape({
            videoId: PropTypes.string.isRequired,
            title: PropTypes.string.isRequired,
            artist: PropTypes.string.isRequired,
            imageUrl: PropTypes.string,
        })
    ).isRequired,
    onSelectSong: PropTypes.func.isRequired,
    onDeleteSong: PropTypes.func.isRequired, 
};
