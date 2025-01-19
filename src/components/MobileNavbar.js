import React from 'react';
import { MdHome, MdSearch, MdPerson, MdFavorite } from 'react-icons/md';

export default function MobileNavbar({ activePanel, setActivePanel }) {
    // Helper function to toggle the panel
    const togglePanel = (panel) =>
        setActivePanel(activePanel === panel ? null : panel);

    return (
        <nav className="h-16 bg-black bg-opacity-40 backdrop-blur-sm text-white flex justify-around items-center md:hidden">
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
        </nav>
    );
}
