import React from "react";
import {
    MdHome,
    MdSearch,
    MdPerson,
    MdFavorite,
    MdLogin,
} from "react-icons/md";
import { CiLogout } from "react-icons/ci";
import logo from "./logo.png";

export default function Navbar({ activePanel, setActivePanel, user, onSignIn, onSignOut }) {
    const togglePanel = (panel) => setActivePanel(activePanel === panel ? null : panel);

    return (
        <nav className="fixed top-0 left-0 h-full w-16 bg-black bg-opacity-40 backdrop-blur-sm text-white flex flex-col items-center py-6 space-y-12">
            {/* Logo */}
            <div className="bg-purple-700 w-12 h-12 flex items-center justify-center rounded-full">
                <img className="rounded-full h-12" src={logo} alt="Navbar Logo" />
            </div>

            {/* Navigation Icons */}
            <div className="flex flex-col space-y-12 mt-6">
                <button
                    className={`hover:text-pink-500 ${
                        activePanel === "home" ? "text-pink-400" : ""
                    }`}
                    onClick={() => togglePanel("home")}
                >
                    <MdHome size={24} />
                </button>

                <button
                    className={`hover:text-pink-500 ${
                        activePanel === "search" ? "text-pink-400" : ""
                    }`}
                    onClick={() => togglePanel("search")}
                >
                    <MdSearch size={24} />
                </button>

                <button
                    className={`hover:text-pink-500 ${
                        activePanel === "liked" ? "text-pink-400" : ""
                    }`}
                    onClick={() => togglePanel("liked")}
                >
                    <MdFavorite size={24} />
                </button>

                <button
                    className={`hover:text-pink-500 ${
                        activePanel === "profile" ? "text-pink-400" : ""
                    }`}
                    onClick={() => togglePanel("profile")}
                >
                    <MdPerson size={24} />
                </button>

                {/* Sign-In / Sign-Out */}
                <button
                    className="hover:text-pink-500"
                    onClick={user ? onSignOut : onSignIn}
                >
                    {user ? <CiLogout size={24} /> : <MdLogin size={24} />}
                </button>
            </div>
        </nav>
    );
}
