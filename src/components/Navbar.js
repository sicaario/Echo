// Navbar.jsx
import React, { useState } from "react";
import {
    MdHome,
    MdSearch,
    MdPerson,
    MdFavorite,
    MdLogin,
    MdShare,
    MdDownload,
} from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import logo from "./logo.png";
import ShareDialog from "./ShareDialog";
import ReceiveDialog from "./ReceiveDialog";

export default function Navbar({
                                   activePanel,
                                   setActivePanel,
                                   user,
                                   onSignIn,
                                   onSignOut,
                                   likedSongs,
                                   setLikedSongs,
                               }) {
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isReceiveOpen, setIsReceiveOpen] = useState(false);

    const togglePanel = (panel) =>
        setActivePanel(activePanel === panel ? null : panel);

    return (
        <>
            <nav className="fixed top-0 left-0 h-full w-16 bg-black bg-opacity-40 backdrop-blur-sm text-white flex flex-col items-center py-6 space-y-12">
                {/* Logo */}
                <div className="bg-purple-700 w-12 h-12 flex items-center justify-center rounded-full">
                    <img
                        className="rounded-full h-12"
                        src={logo}
                        alt="Navbar Logo"
                    />
                </div>

                {/* Navigation Icons */}
                <div className="flex flex-col pt-4 space-y-6 mt-6">
                    <button
                        className={`hover:text-pink-500 ${
                            activePanel === "home" ? "text-pink-400" : ""
                        }`}
                        onClick={() => togglePanel("home")}
                        aria-label="Home"
                    >
                        <MdHome size={26} />
                    </button>

                    <button
                        className={`hover:text-pink-500 pt-6 ${
                            activePanel === "search" ? "text-pink-400" : ""
                        }`}
                        onClick={() => togglePanel("search")}
                        aria-label="Search"
                    >
                        <MdSearch size={26} />
                    </button>

                    <button
                        className={`hover:text-pink-500 pt-6 ${
                            activePanel === "liked" ? "text-pink-400" : ""
                        }`}
                        onClick={() => togglePanel("liked")}
                        aria-label="Liked Songs"
                    >
                        <MdFavorite size={26} />
                    </button>

                    <button
                        className={`hover:text-pink-500 pt-6 ${
                            activePanel === "share" ? "text-pink-400" : ""
                        }`}
                        onClick={() => setIsShareOpen(true)}
                        aria-label="Share Liked Songs"
                    >
                        <MdShare size={26} />
                    </button>

                    <button
                        className={`hover:text-pink-500 pt-6 ${
                            activePanel === "receive" ? "text-pink-400" : ""
                        }`}
                        onClick={() => setIsReceiveOpen(true)}
                        aria-label="Receive Shared Songs"
                    >
                        <MdDownload size={26} />
                    </button>

                    <button
                        className={`hover:text-pink-500 pt-6 ${
                            activePanel === "profile" ? "text-pink-400" : ""
                        }`}
                        onClick={() => togglePanel("profile")}
                        aria-label="Profile"
                    >
                        <MdPerson size={26} />
                    </button>

                    {/* Sign-In / Sign-Out */}
                    <button
                        className="hover:text-pink-500 pt-6"
                        onClick={user ? onSignOut : onSignIn}
                        aria-label={user ? "Sign Out" : "Sign In"}
                    >
                        {user ? <CiLogout size={26} /> : <MdLogin size={24} />}
                    </button>
                </div>
            </nav>

            {/* Share Dialog */}
            {isShareOpen && (
                <ShareDialog
                    onClose={() => setIsShareOpen(false)}
                    likedSongs={likedSongs}
                />
            )}

            {/* Receive Dialog */}
            {isReceiveOpen && (
                <ReceiveDialog
                    onClose={() => setIsReceiveOpen(false)}
                    setLikedSongs={setLikedSongs}
                />
            )}
        </>
    );
}
