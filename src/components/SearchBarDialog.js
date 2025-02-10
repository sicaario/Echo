import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MdClose, MdSearch } from 'react-icons/md'
import axios from 'axios'

/**
 * A simple function to strip out common extraneous text from YouTube titles.
 * Removes phrases like (Official Video), Title Song, Full Video, etc.
 * Also removes content after a vertical bar '|'.
 */
function cleanUpTitle(rawTitle = '') {
    return rawTitle
        // Remove (anything in parentheses)
        .replace(/\(.*?\)/gi, '')
        // Remove [anything in square brackets]
        .replace(/\[.*?\]/gi, '')
        // Remove these common tags/phrases
        .replace(/official\s*video/gi, '')
        .replace(/title\s*song/gi, '')
        .replace(/full\s*video/gi, '')
        .replace(/lyric\s*video/gi, '')
        .replace(/audio/gi, '')
        // Remove everything after a '|'
        .replace(/\|.*$/, '')
        // Trim extra spaces
        .trim()
}

/**
 * Removes "VEVO", " - Topic", or other known channel suffixes from channel name.
 * You can expand this to handle other patterns.
 */
function cleanUpChannel(channel = '') {
    return channel
        .replace(/vevo/gi, '')
        .replace(/- topic/gi, '')
        .trim()
}

/**
 * Attempt to parse out a "song title" and "artist" from YouTube snippet data.
 * In many cases, this won't be perfect, but it's better than raw data.
 */
function parseSongAndArtist(snippetTitle, channelTitle) {
    // We'll do the minimal cleaning
    const cleanedTitle = cleanUpTitle(snippetTitle)
    const cleanedChannel = cleanUpChannel(channelTitle)

    // By default, we use the channel as "artist" and the cleaned snippet as "title".
    return {
        title: cleanedTitle || snippetTitle || 'Unknown Title',
        artist: cleanedChannel || 'Unknown Artist',
    }
}

export default function SearchBarDialog({ onClose, setSong }) {
    const [query, setQuery] = useState('')
    const [suggestions, setSuggestions] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    // Auto-close after 60 seconds
    useEffect(() => {
        const timer = setTimeout(onClose, 60000)
        return () => clearTimeout(timer)
    }, [onClose])

    const fetchSuggestions = async () => {
        if (!query.trim()) {
            setSuggestions([])
            return
        }

        const API_KEY = 'AIzaSyC-Pm8v6RUZa68yvF9Y30tbhAhmLuszs6Y'
        const API_URL = `https://www.googleapis.com/youtube/v3/search`

        setIsLoading(true)
        setError(null)

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

            // Map each item to a structured object
            const results = response.data.items.map((item) => {
                const rawTitle = item.snippet.title
                const rawChannel = item.snippet.channelTitle

                // Use our parser to get a "cleaned" song title & artist
                const { title, artist } = parseSongAndArtist(rawTitle, rawChannel)

                return {
                    videoId: item.id.videoId,
                    title,
                    artist,
                    imageUrl:
                        item.snippet.thumbnails.high?.url ||
                        item.snippet.thumbnails.medium?.url ||
                        item.snippet.thumbnails.default.url,
                }
            })

            setSuggestions(results)
        } catch (err) {
            console.error('Error fetching suggestions:', err)
            setError('Failed to fetch suggestions. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        fetchSuggestions()
    }

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 z-30"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
        >
            {/* Search Bar */}
            <form
                onSubmit={handleSubmit}
                className="bg-gradient-to-r md:mr-20 md:ml-20 from-purple-800 via-black to-purple-900 bg-opacity-90 backdrop-blur-md py-5 px-4 flex items-center space-x-3 relative shadow-lg"
            >
                <MdSearch className="text-gray-300" size={24} />
                <input
                    type="text"
                    placeholder="Type a song name..."
                    className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="text-gray-300 hover:text-gray-100 transition-colors"
                    aria-label="Search"
                >
                    <MdSearch size={24} />
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-300 hover:text-gray-100 transition-colors"
                    aria-label="Close"
                >
                    <MdClose size={24} />
                </button>
            </form>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="text-center text-gray-400 mt-2 md:mr-20 md:ml-20">
                    Loading...
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="text-center text-red-500 mt-2 md:mr-20 md:ml-20">
                    {error}
                </div>
            )}

            {/* Suggestions List */}
            {suggestions.length > 0 && !isLoading && !error && (
                <div className="bg-gradient-to-b from-gray-900 via-black to-gray-800 max-h-60 overflow-y-auto scrollbar-hidden mt-2 md:mr-20 md:ml-20 overflow-x-hidden rounded-lg shadow-md">
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
                                className="w-12 h-12 rounded-md mr-4 object-cover"
                            />
                            <div className="flex-1">
                                <div className="text-white font-semibold truncate">
                                    {suggestion.title}
                                </div>
                                <div className="text-gray-400 text-sm truncate">
                                    {suggestion.artist}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* No Results */}
            {suggestions.length === 0 && !isLoading && query.trim() !== '' && !error && (
                <div className="text-center text-gray-400 mt-2 md:mr-20 md:ml-20">
                    No results found.
                </div>
            )}
        </motion.div>
    )
}
