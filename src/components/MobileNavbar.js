// src/components/MobileNavbar.jsx
import React from 'react';
import { MdHome, MdSearch, MdPerson, MdFavorite, MdLogin } from 'react-icons/md';
import { CiLogout } from 'react-icons/ci';
import PropTypes from 'prop-types';

export default function MobileNavbar({ activePanel,
                                         setActivePanel,
                                         user,          
                                         onSignIn,      
                                         onSignOut,     
                                     }) {
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
                aria-label="Home"
            >
                <MdHome size={24} />
            </button>

            {/* Search Button */}
            <button
                className={`hover:text-pink-500 ${
                    activePanel === 'search' ? 'text-pink-400' : ''
                }`}
                onClick={() => togglePanel('search')}
                aria-label="Search"
            >
                <MdSearch size={24} />
            </button>

            {/* Liked Songs Button */}
            <button
                className={`hover:text-pink-500 ${
                    activePanel === 'liked' ? 'text-pink-400' : ''
                }`}
                onClick={() => togglePanel('liked')}
                aria-label="Liked Songs"
            >
                <MdFavorite size={24} />
            </button>

            {/* Profile Button */}
            <button
                className={`hover:text-pink-500 ${
                    activePanel === 'profile' ? 'text-pink-400' : ''
                }`}
                onClick={() => togglePanel('profile')}
                aria-label="Profile"
            >
                <MdPerson size={24} />
            </button>

            {/* Sign-In / Sign-Out Button */}
            <button
                className="hover:text-pink-500"
                onClick={user ? onSignOut : onSignIn}
                aria-label={user ? "Sign Out" : "Sign In"}
            >
                {user ? <CiLogout size={24} /> : <MdLogin size={24} />}
            </button>
        </nav>
    );
}

MobileNavbar.propTypes = {
    activePanel: PropTypes.string.isRequired,
    setActivePanel: PropTypes.func.isRequired,
    user: PropTypes.object,               
    onSignIn: PropTypes.func.isRequired,  
    onSignOut: PropTypes.func.isRequired, 
};
