import React from "react";
import { motion } from "framer-motion";
import { X, User, Mail, Calendar } from "lucide-react";

export default function ProfileDialog({ onClose, user }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-lg shadow-2xl w-full max-w-md p-6"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-white">Profile</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User Info */}
                <div className="text-center mb-6">
                    <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-green-400"
                    />
                    <h3 className="text-2xl font-bold text-white mb-2">{user.displayName}</h3>
                    <p className="text-gray-400">{user.email}</p>
                </div>

                {/* User Details */}
                <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                        <User className="w-5 h-5 text-green-400" />
                        <div>
                            <p className="text-sm text-gray-400">Display Name</p>
                            <p className="text-white font-medium">{user.displayName}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                        <Mail className="w-5 h-5 text-green-400" />
                        <div>
                            <p className="text-sm text-gray-400">Email</p>
                            <p className="text-white font-medium">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg">
                        <Calendar className="w-5 h-5 text-green-400" />
                        <div>
                            <p className="text-sm text-gray-400">Member Since</p>
                            <p className="text-white font-medium">
                                {new Date(user.metadata.creationTime).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-900/20 to-blue-900/20 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Your Music Stats</h4>
                    <p className="text-gray-400 text-sm">
                        Keep listening to unlock personalized insights about your music taste!
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
}