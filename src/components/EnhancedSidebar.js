import React from 'react';
import { motion } from 'framer-motion';
import { 
    Home, 
    Search, 
    Library, 
    Heart, 
    PlusSquare, 
    User,
    LogIn,
    LogOut,
    Music,
    TrendingUp,
    Radio,
    Mic2,
    ListMusic,
    Clock,
    Download
} from 'lucide-react';

export default function EnhancedSidebar({ 
    activeView, 
    setActiveView, 
    user, 
    onSignIn, 
    onSignOut, 
    onSearch, 
    onProfile,
    likedSongs 
}) {
    const menuItems = [
        { id: 'home', label: 'Home', icon: Home },
        { id: 'search', label: 'Search', icon: Search, onClick: onSearch },
        { id: 'library', label: 'Your Library', icon: Library },
    ];

    const playlistItems = [
        { id: 'liked', label: 'Liked Songs', icon: Heart, count: likedSongs.length, gradient: 'from-purple-400 to-pink-600' },
        { id: 'recently-played', label: 'Recently Played', icon: Clock, gradient: 'from-green-400 to-blue-500' },
        { id: 'recommendations', label: 'Discover Weekly', icon: TrendingUp, gradient: 'from-orange-400 to-red-500' },
        { id: 'radio', label: 'Echo Radio', icon: Radio, gradient: 'from-blue-400 to-purple-500' },
        { id: 'podcasts', label: 'Podcasts', icon: Mic2, gradient: 'from-green-400 to-teal-500' },
    ];

    const quickAccess = [
        { id: 'daily-mix', label: 'Daily Mix 1', type: 'playlist' },
        { id: 'release-radar', label: 'Release Radar', type: 'playlist' },
        { id: 'on-repeat', label: 'On Repeat', type: 'playlist' },
    ];

    return (
        <div className="w-64 bg-black flex flex-col h-full border-r border-gray-800">
            {/* Logo */}
            <div className="p-6">
                <motion.div 
                    className="flex items-center space-x-3"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">Echo</span>
                </motion.div>
            </div>

            {/* Main Navigation */}
            <nav className="px-3 space-y-1">
                {menuItems.map((item, index) => (
                    <motion.button
                        key={item.id}
                        onClick={item.onClick || (() => setActiveView(item.id))}
                        className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                            activeView === item.id
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-900'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <item.icon className="w-6 h-6" />
                        <span>{item.label}</span>
                    </motion.button>
                ))}
            </nav>

            {/* Your Music */}
            <div className="px-3 mt-8">
                <div className="flex items-center justify-between px-3 mb-4">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Your Music
                    </h3>
                    <button className="text-gray-400 hover:text-white transition-colors">
                        <PlusSquare className="w-4 h-4" />
                    </button>
                </div>
                <div className="space-y-1">
                    {playlistItems.map((item, index) => (
                        <motion.button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group ${
                                activeView === item.id
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                            }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center space-x-3">
                                <div className={`w-6 h-6 bg-gradient-to-br ${item.gradient} rounded flex items-center justify-center`}>
                                    <item.icon className="w-4 h-4 text-white" />
                                </div>
                                <span>{item.label}</span>
                            </div>
                            {item.count !== undefined && (
                                <span className="text-xs bg-gray-700 px-2 py-1 rounded-full group-hover:bg-gray-600 transition-colors">
                                    {item.count}
                                </span>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Quick Access */}
            <div className="px-3 mt-6 flex-1">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider px-3 mb-4">
                    Made for You
                </h3>
                <div className="space-y-1">
                    {quickAccess.map((item, index) => (
                        <motion.button
                            key={item.id}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-200"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: (index + 8) * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 rounded flex items-center justify-center">
                                <ListMusic className="w-4 h-4 text-white" />
                            </div>
                            <span className="truncate">{item.label}</span>
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Install App */}
            <div className="px-3 mb-4">
                <motion.button
                    className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-900 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Download className="w-5 h-5" />
                    <span>Install App</span>
                </motion.button>
            </div>

            {/* User Section */}
            <div className="p-3 border-t border-gray-800">
                {user ? (
                    <div className="space-y-2">
                        <motion.button
                            onClick={onProfile}
                            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="w-7 h-7 rounded-full border-2 border-gray-600"
                            />
                            <span className="truncate flex-1 text-left">{user.displayName}</span>
                            <User className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                            onClick={onSignOut}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Sign Out</span>
                        </motion.button>
                    </div>
                ) : (
                    <motion.button
                        onClick={onSignIn}
                        className="w-full flex items-center space-x-3 px-4 py-3 rounded-full text-sm font-bold bg-white text-black hover:bg-gray-200 transition-all duration-200"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <LogIn className="w-5 h-5" />
                        <span>Sign up free</span>
                    </motion.button>
                )}
            </div>
        </div>
    );
}