import React from 'react'
import { MdHome, MdSearch, MdPerson, MdSettings, MdFavorite } from 'react-icons/md'
import logo from './logo.png'

export default function Navbar({ activePanel, setActivePanel }) {
    // Helper to toggle a panel: if it's already open, close it; otherwise open
    const togglePanel = (panel) =>
        setActivePanel(activePanel === panel ? null : panel)

    return (
        <nav className="fixed top-0 left-0 h-full w-16 bg-black bg-opacity-40 backdrop-blur-sm text-white flex flex-col items-center py-6 space-y-12">
            {/* Logo */}
            <div className="bg-purple-700 w-12 h-12 flex items-center justify-center rounded-full">
                <span className="text-xl font-bold">
                    <img  className="rounded-full h-12" src={logo}/>
                </span>
            </div>

            {/* Icons */}
            <div className="flex flex-col space-y-12 mt-6">
                {/* Home Button */}
                <button
                    className={`hover:text-pink-500 ${
                        activePanel === 'home' ? 'text-pink-400' : ''
                    }`}
                    onClick={() => togglePanel('home')}
                >
                    <MdHome size={24} />
                </button>

                {/* Search Button */}
                <button
                    className={`hover:text-pink-500 ${
                        activePanel === 'search' ? 'text-pink-400' : ''
                    }`}
                    onClick={() => togglePanel('search')}
                >
                    <MdSearch size={24} />
                </button>

                {/* Liked Songs Button */}
                <button
                    className={`hover:text-pink-500 ${
                        activePanel === 'liked' ? 'text-pink-400' : ''
                    }`}
                    onClick={() => togglePanel('liked')}
                >
                    <MdFavorite size={24} />
                </button>

                {/* Profile Button */}
                <button
                    className={`hover:text-pink-500 ${
                        activePanel === 'profile' ? 'text-pink-400' : ''
                    }`}
                    onClick={() => togglePanel('profile')}
                >
                    <MdPerson size={24} />
                </button>

                {/* Settings Button */}
                <button
                    className={`hover:text-pink-500 ${
                        activePanel === 'settings' ? 'text-pink-400' : ''
                    }`}
                    onClick={() => togglePanel('settings')}
                >
                    <MdSettings size={24} />
                </button>
            </div>
        </nav>
    )
}
