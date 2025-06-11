import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EnhancedSongCard from '../EnhancedSongCard';
import SpotifyCanvas from '../SpotifyCanvas';
import { Clock, Sparkles, TrendingUp, Calendar, Radio, Zap } from 'lucide-react';
import { getTrendingTracks, getNewReleases, getEnhancedRecommendations } from '../../services/enhancedRecommendationService';

export default function EnhancedHomeView({ 
    recentlyPlayed, 
    recommendations, 
    onSelectSong, 
    onLikeToggle, 
    likedSongs,
    user 
}) {
    const [trendingTracks, setTrendingTracks] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const [enhancedRecs, setEnhancedRecs] = useState([]);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trending, releases, enhanced] = await Promise.all([
                    getTrendingTracks('short_term', 12),
                    getNewReleases(12),
                    getEnhancedRecommendations({
                        likedSongs,
                        recentlyPlayed,
                        timeOfDay: getTimeOfDay(),
                        mood: 'neutral'
                    })
                ]);

                setTrendingTracks(trending);
                setNewReleases(releases);
                setEnhancedRecs(enhanced);
            } catch (error) {
                console.error('Error fetching enhanced data:', error);
            }
        };

        fetchData();
    }, [likedSongs, recentlyPlayed]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const getTimeOfDay = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        if (hour < 22) return 'evening';
        return 'night';
    };

    const quickPickItems = [
        { id: 'liked', title: 'Liked Songs', count: likedSongs.length, gradient: 'from-purple-400 to-pink-600', icon: '💜' },
        { id: 'recently-played', title: 'Recently Played', count: recentlyPlayed.length, gradient: 'from-green-400 to-blue-500', icon: '🕒' },
        { id: 'discover', title: 'Discover Weekly', count: '50', gradient: 'from-orange-400 to-red-500', icon: '🎵' },
        { id: 'daily-mix', title: 'Daily Mix 1', count: '50', gradient: 'from-blue-400 to-purple-500', icon: '🎧' },
        { id: 'release-radar', title: 'Release Radar', count: '30', gradient: 'from-green-400 to-teal-500', icon: '📡' },
        { id: 'on-repeat', title: 'On Repeat', count: '25', gradient: 'from-yellow-400 to-orange-500', icon: '🔁' },
    ];

    return (
        <div className="min-h-full bg-gradient-to-b from-gray-900 via-black to-black">
            {/* Hero Section with Canvas Background */}
            <div className="relative h-80 overflow-hidden">
                <SpotifyCanvas 
                    song={{ title: 'Welcome to Echo', artist: 'Your Music Journey' }} 
                    isPlaying={true} 
                    className="absolute inset-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                <div className="relative z-10 p-8 h-full flex flex-col justify-end">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-6xl font-bold text-white mb-4">
                            {getGreeting()}{user ? `, ${user.displayName?.split(' ')[0]}` : ''}
                        </h1>
                        <p className="text-xl text-gray-300">
                            {user ? 'Ready to discover your next favorite song?' : 'Sign in to get personalized recommendations'}
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="p-8 space-y-12">
                {/* Quick Picks */}
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Quick picks</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {quickPickItems.map((item, index) => (
                            <motion.button
                                key={item.id}
                                className={`flex items-center space-x-4 bg-gradient-to-r ${item.gradient} p-4 rounded-lg hover:scale-105 transition-transform duration-200`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="text-2xl">{item.icon}</div>
                                <div className="flex-1 text-left">
                                    <h3 className="text-white font-semibold">{item.title}</h3>
                                    <p className="text-white/80 text-sm">{item.count} songs</p>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </motion.section>

                {/* Recently Played */}
                {recentlyPlayed.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <Clock className="w-6 h-6 text-green-400" />
                                <h2 className="text-2xl font-bold text-white">Recently played</h2>
                            </div>
                            <button className="text-gray-400 hover:text-white text-sm font-semibold">
                                Show all
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                            {recentlyPlayed.slice(0, 6).map((song, index) => (
                                <motion.div
                                    key={song.id || song.videoId}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <EnhancedSongCard
                                        song={song}
                                        onPlay={onSelectSong}
                                        onLikeToggle={onLikeToggle}
                                        isLiked={likedSongs.some(liked => 
                                            (liked.id || liked.videoId) === (song.id || song.videoId)
                                        )}
                                        size="small"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Trending Now */}
                {trendingTracks.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <TrendingUp className="w-6 h-6 text-red-400" />
                                <h2 className="text-2xl font-bold text-white">Trending now</h2>
                            </div>
                            <button className="text-gray-400 hover:text-white text-sm font-semibold">
                                Show all
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                            {trendingTracks.slice(0, 6).map((song, index) => (
                                <motion.div
                                    key={song.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <EnhancedSongCard
                                        song={song}
                                        onPlay={onSelectSong}
                                        onLikeToggle={onLikeToggle}
                                        isLiked={likedSongs.some(liked => 
                                            liked.id === song.id
                                        )}
                                        size="small"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* New Releases */}
                {newReleases.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <Calendar className="w-6 h-6 text-blue-400" />
                                <h2 className="text-2xl font-bold text-white">New releases for you</h2>
                            </div>
                            <button className="text-gray-400 hover:text-white text-sm font-semibold">
                                Show all
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                            {newReleases.slice(0, 6).map((song, index) => (
                                <motion.div
                                    key={song.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                >
                                    <EnhancedSongCard
                                        song={song}
                                        onPlay={onSelectSong}
                                        onLikeToggle={onLikeToggle}
                                        isLiked={likedSongs.some(liked => 
                                            liked.id === song.id
                                        )}
                                        size="small"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Made for You */}
                {enhancedRecs.length > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                                <h2 className="text-2xl font-bold text-white">Made for you</h2>
                            </div>
                            <button className="text-gray-400 hover:text-white text-sm font-semibold">
                                Show all
                            </button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                            {enhancedRecs.slice(0, 12).map((song, index) => (
                                <motion.div
                                    key={song.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <EnhancedSongCard
                                        song={song}
                                        onPlay={onSelectSong}
                                        onLikeToggle={onLikeToggle}
                                        isLiked={likedSongs.some(liked => 
                                            liked.id === song.id
                                        )}
                                        size="small"
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>
                )}

                {/* Welcome Message for New Users */}
                {!user && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="text-center py-16 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl"
                    >
                        <Zap className="w-16 h-16 text-green-400 mx-auto mb-6" />
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Start your music journey
                        </h2>
                        <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                            Sign in to unlock personalized playlists, discover new music based on your taste, 
                            and keep track of your favorite songs across all your devices.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center space-x-2">
                                <Radio className="w-4 h-4" />
                                <span>Personalized radio</span>
                            </span>
                            <span className="flex items-center space-x-2">
                                <Sparkles className="w-4 h-4" />
                                <span>Smart recommendations</span>
                            </span>
                            <span className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>Listening history</span>
                            </span>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}