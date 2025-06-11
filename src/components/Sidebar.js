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
    Music
} from 'lucide-react';

export default function Sidebar({ 
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
        { id: 'liked', label: 'Liked Songs', icon: Heart, count: likedSongs.length },
        { id: 'recently-played', label: 'Recently Played', icon: Music },
        { id: 'recommendations', label: 'Made for You', icon: PlusSquare },
    ];

    return (
        <div className="w-64 bg-black flex flex-col h-full">
            {/* Logo */}
            <div className="p-6">
                <motion.div 
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <Music className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-white">Echo</span>
                </motion.div>
            </div>

            {/* Main Navigation */}
            <nav className="px-6 space-y-2">
                {menuItems.map((item, index) => (
                    <motion.button
                        key={item.id}
                        onClick={item.onClick || (() => setActiveView(item.id))}
                        className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            activeView === item.id
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                        }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </motion.button>
                ))}
            </nav>

            {/* Playlists */}
            <div className="px-6 mt-8">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                    Your Music
                </h3>
                <div className="space-y-2">
                    {playlistItems.map((item, index) => (
                        <motion.button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeView === item.id
                                    ? 'bg-gray-800 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: (index + 3) * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center space-x-3">
                                <item.icon className="w-5 h-5" />
                                <span>{item.label}</span>
                            </div>
                            {item.count !== undefined && (
                                <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                                    {item.count}
                                </span>
                            )}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* User Section */}
            <div className="mt-auto p-6 border-t border-gray-800">
                {user ? (
                    <div className="space-y-3">
                        <motion.button
                            onClick={onProfile}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <img
                                src={user.photoURL}
                                alt="Profile"
                                className="w-6 h-6 rounded-full"
                            />
                            <span className="truncate">{user.displayName}</span>
                        </motion.button>
                        <motion.button
                            onClick={onSignOut}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
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
                        className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium bg-green-600 hover:bg-green-700 text-white transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <LogIn className="w-5 h-5" />
                        <span>Sign In</span>
                    </motion.button>
                )}
            </div>
        </div>
    );
}