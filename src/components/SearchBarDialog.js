import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdClose, MdSearch } from 'react-icons/md'
import axios from 'axios'

export default function SearchBarDialog({ onClose, setSong }) {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])

    useEffect(() => {
        const timer = setTimeout(onClose, 60000) // Auto-close after 60 seconds
        return () => clearTimeout(timer)
    }, [onClose])

    useEffect(() => {
        if (!query.trim()) {
            setSuggestions([])
            return
        }

        const fetchSuggestions = async () => {
            const API_KEY = 'AIzaSyA4lsJF_3LIV-8UJGqfnTe7QhOYblYZxho'
            const API_URL = `https://www.googleapis.com/youtube/v3/search`

            try {
                const response = await axios.get(API_URL, {
                    params: {
                        part: 'snippet',
                        q: query,
                        type: 'video',
                        maxResults: 5,
                        key: API_KEY,
                    },
                })
                const results = response.data.items.map((item) => ({
                    title: item.snippet.title,
                    artist: item.snippet.channelTitle,
                    videoId: item.id.videoId,
                    imageUrl: item.snippet.thumbnails.default.url, // Get song image
                }))
                setSuggestions(results)
            } catch (error) {
                console.error('Error fetching suggestions:', error)
            }
        }

        fetchSuggestions()
    }, [query])

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-30"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
            <div className="bg-gradient-to-r md:mr-20 md:ml-20 from-purple-800 via-black to-purple-900 bg-opacity-90 backdrop-blur-md py-5 px-4 flex items-center space-x-3 relative shadow-lg">
                <MdSearch className="text-gray-300" size={24} />
                <input
                    type="text"
                    placeholder="Type a song name..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    onClick={onClose}
                    className="text-gray-300 hover:text-gray-100 transition-colors"
                >
                    <MdClose size={24} />
                </button>
            </div>

            {suggestions.length > 0 && (
                <div className="bg-gradient-to-b from-gray-900 via-black to-gray-800 max-h-60 overflow-y-auto mt-2 md:mr-20 md:ml-20 overflow-x-hidden rounded-lg shadow-md">
                    {suggestions.map((suggestion) => (
                        <div
                            key={suggestion.videoId}
                            onClick={() => {
                                setSong(suggestion)
                                onClose()
                            }}
                            className="flex items-center p-3 hover:bg-purple-700 cursor-pointer transition-colors rounded-md"
                        >
                            <img
                                src={suggestion.imageUrl}
                                alt={suggestion.title}
                                className="w-12 h-12 rounded-md mr-4"
                            />
                            <div className="flex-1">
                                <div className="text-white font-semibold truncate">{suggestion.title}</div>
                                <div className="text-gray-400 text-sm truncate">{suggestion.artist}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    )
}

