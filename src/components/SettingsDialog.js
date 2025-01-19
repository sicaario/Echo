import React from "react";
import { MdClose, MdLogout, MdLogin } from "react-icons/md";

export default function SettingsDialog({ onClose, onSignIn, onSignOut, user }) {
    return (
        <div className="fixed inset-y-0 right-0 z-30 w-64 bg-gradient-to-br from-purple-900 via-black to-gray-900 p-4">
            <div className="flex justify-end">
                <button onClick={onClose}>
                    <MdClose size={24} />
                </button>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Settings</h2>

            {!user ? (
                <button
                    onClick={onSignIn} // Ensure this function is passed from App.js
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded"
                >
                    <MdLogin className="mr-2" />
                    Sign In with Google
                </button>
            ) : (
                <button
                    onClick={onSignOut} // Ensure this function is passed from App.js
                    className="flex items-center bg-red-500 text-white px-4 py-2 rounded"
                >
                    <MdLogout className="mr-2" />
                    Sign Out
                </button>
            )}
        </div>
    );
}
