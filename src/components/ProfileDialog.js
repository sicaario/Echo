import React from "react";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md"; // Import the close icon

export default function ProfileDialog({ onClose, user }) {
    return (
        <motion.div
            className="fixed top-4 right-4 w-64 z-30 bg-gradient-to-br
                 from-purple-800 via-black to-gray-900 rounded-lg shadow-lg p-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            {/* Cross Icon for Close */}
            <div className="absolute top-1 right-4 justify-end">
                <button
                    onClick={onClose}
                    className="text-gray-300 hover:text-gray-100 p-1"
                    aria-label="Close"
                >
                    <MdClose size={20} />
                </button>
            </div>

            {/* User Information */}
            {user ? (
                <div className="flex items-center space-x-3">
                    <img
                        src={user.photoURL}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full"
                    />
                    <div>
                        <p className="font-bold">{user.displayName}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">No user logged in.</p>
            )}
        </motion.div>
    );
}
