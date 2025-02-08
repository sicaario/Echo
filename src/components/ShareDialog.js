// ShareDialog.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdClose, MdContentCopy } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import { createShare, auth } from "../firebase";
import { toast } from "react-hot-toast";

export default function ShareDialog({ onClose, likedSongs }) {
    const [shareId, setShareId] = useState(null);
    const [isCopying, setIsCopying] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [error, setError] = useState(null);

    const handleShare = async () => {
        if (likedSongs.length === 0) {
            setError("You have no liked songs to share.");
            return;
        }

        setIsSharing(true);
        try {
            const user = auth.currentUser;
            if (!user) {
                setError("You must be signed in to share songs.");
                setIsSharing(false);
                return;
            }
            const generatedShareId = await createShare(user.uid, likedSongs);
            setShareId(generatedShareId);
            setError(null);
            toast.success("Share ID generated successfully!", {
                position: "top-right",
            });
        } catch (err) {
            console.error("Error sharing songs:", err);
            setError("Failed to generate Share ID. Please try again.");
            toast.error("Failed to generate Share ID.", {
                position: "top-right",
            });
        } finally {
            setIsSharing(false);
        }
    };

    const handleCopy = () => {
        if (shareId) {
            setIsCopying(true); 
            navigator.clipboard.writeText(shareId)
                .then(() => {
                    toast.success("Share ID copied to clipboard!", {
                        position: "top-right",
                    });
                    setTimeout(() => setIsCopying(false), 2000);
                })
                .catch((err) => {
                    console.error("Failed to copy:", err);
                    toast.error("Failed to copy Share ID.", {
                        position: "top-right",
                    });
                    setIsCopying(false);
                });
        }
    };

    const handleWhatsAppShare = () => {
        if (shareId) {
            const message = `Hey! Check out my liked songs using this Share ID: ${shareId}`;
            const whatsappURL = `https://wa.me/?text=${encodeURIComponent(
                message
            )}`;
            window.open(whatsappURL, "_blank");
        }
    };

    return (
        <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-gradient-to-r from-purple-800 via-black to-purple-900 p-6 rounded-lg shadow-lg w-80 text-white relative"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ duration: 0.3 }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-300 hover:text-gray-100 transition-colors"
                    aria-label="Close Share Dialog"
                >
                    <MdClose size={24} />
                </button>

                <h2 className="text-xl font-semibold mb-4">Share Your Liked Songs</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                {!shareId ? (
                    <button
                        onClick={handleShare}
                        className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-md flex items-center justify-center"
                        disabled={isSharing}
                    >
                        {isSharing ? "Sharing..." : "Share Liked Songs"}
                    </button>
                ) : (
                    <div className="flex flex-col items-center">
                        <p className="mb-2">Share ID:</p>
                        <div className="flex items-center bg-gray-800 p-2 rounded-md w-full">
                            <span className="flex-1 break-all">{shareId}</span>
                            <button
                                onClick={handleCopy}
                                className={`ml-2 text-gray-300 hover:text-gray-100 flex items-center ${
                                    isCopying ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                aria-label="Copy Share ID"
                                disabled={isCopying}
                            >
                                {isCopying ? (
                                    <FaSpinner size={20} className="animate-spin" />
                                ) : (
                                    <MdContentCopy size={20} />
                                )}
                            </button>
                        </div>

                        {/* WhatsApp Share Button */}
                        <button
                            onClick={handleWhatsAppShare}
                            className="mt-4 bg-green-500 hover:bg-green-600 py-2 px-4 rounded-md flex items-center space-x-2"
                        >
                            <img
                                src="https://img.icons8.com/color/24/000000/whatsapp--v1.png"
                                alt="WhatsApp Icon"
                                className="w-5 h-5"
                            />
                            <span>Share via WhatsApp</span>
                        </button>
                    </div>
                )}
            </motion.div>
        </motion.div>
    );
}
