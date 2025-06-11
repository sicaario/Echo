import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader } from 'lucide-react';

export default function SearchDialog({ onClose, onSearch, onSelectSong }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);
    const debounceRef = useRef(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        if (query.trim()) {
            debounceRef.current = setTimeout(() => {
                handleSearch(query);
            }, 500);
        } else {
            setResults([]);
        }

        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, [query]);

    const handleSearch = async (searchQuery) => {
        setIsLoading(true);
        setError(null);

        try {
            const searchResults = await onSearch(searchQuery);
            setResults(searchResults);
        } catch (err) {
            setError('Search failed. Please try again.');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSongSelect = (song) => {
        onSelectSong(song);
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-start justify-center pt-16"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Search Header */}
                <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center space-x-3">
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search for songs, artists, or albums..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
                        />
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full text-gray-400 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Search Results */}
                <div className="overflow-y-auto max-h-96">
                    <AnimatePresence mode="wait">
                        {isLoading && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center py-12"
                            >
                                <Loader className="w-6 h-6 text-green-400 animate-spin" />
                                <span className="ml-2 text-gray-400">Searching...</span>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-4 text-center text-red-400"
                            >
                                {error}
                            </motion.div>
                        )}

                        {!isLoading && !error && results.length === 0 && query.trim() && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-4 text-center text-gray-400"
                            >
                                No results found for "{query}"
                            </motion.div>
                        )}

                        {!isLoading && !error && results.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-2"
                            >
                                {results.map((song, index) => (
                                    <motion.button
                                        key={song.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleSongSelect(song)}
                                        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 transition-colors text-left"
                                    >
                                        <img
                                            src={song.imageUrl || 'https://via.placeholder.com/48'}
                                            alt={song.title}
                                            className="w-12 h-12 rounded object-cover"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-white font-medium truncate">
                                                {song.title}
                                            </h3>
                                            <p className="text-gray-400 text-sm truncate">
                                                {song.artist}
                                            </p>
                                            {song.album && (
                                                <p className="text-gray-500 text-xs truncate">
                                                    {song.album}
                                                </p>
                                            )}
                                        </div>
                                        {song.preview_url && (
                                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                        )}
                                    </motion.button>
                                ))}
                            </motion.div>
                        )}

                        {!query.trim() && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-8 text-center text-gray-400"
                            >
                                <Search className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                                <p>Start typing to search for music</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}