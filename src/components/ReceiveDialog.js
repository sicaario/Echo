// ReceiveDialog.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { MdClose } from "react-icons/md";
import { getShare } from "../firebase";
import { toast } from "react-hot-toast";

export default function ReceiveDialog({ onClose, setLikedSongs }) {
    const [inputId, setInputId] = useState("");
    const [isImporting, setIsImporting] = useState(false);
    const [error, setError] = useState(null);

    const handleImport = async () => {
        if (!inputId.trim()) {
            setError("Please enter a valid Share ID.");
            return;
        }

        setIsImporting(true);
        setError(null);

        try {
            const sharedSongs = await getShare(inputId.trim());

            if (sharedSongs.length === 0) {
                setError("No songs found for this Share ID.");
                toast.error("No songs found for this Share ID.", {
                    position: "top-right",
                });
            } else {
                setLikedSongs((prevSongs) => {
                    const existingIds = new Set(prevSongs.map((song) => song.videoId));
                    const newSongs = sharedSongs.filter(
                        (song) => !existingIds.has(song.videoId)
                    );
                    return [...prevSongs, ...newSongs];
                });
                toast.success("Songs imported successfully!", {
                    position: "top-right",
                });
                setInputId("");
            }
        } catch (err) {
            console.error("Error importing songs:", err);
            setError("Failed to import songs. Please check the Share ID and try again.");
            toast.error("Failed to import songs.", {
                position: "top-right",
            });
        } finally {
            setIsImporting(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleImport();
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
                    aria-label="Close Receive Dialog"
                >
                    <MdClose size={24} />
                </button>

                <h2 className="text-xl font-semibold mb-4">Import Shared Songs</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <input
                    type="text"
                    placeholder="Enter Share ID"
                    className="w-full p-2 mb-4 bg-gray-800 rounded-md focus:outline-none"
                    value={inputId}
                    onChange={(e) => setInputId(e.target.value)}
                    onKeyPress={handleKeyPress}
                />

                <button
                    onClick={handleImport}
                    className="w-full bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-md"
                    disabled={isImporting}
                >
                    {isImporting ? "Importing..." : "Import Songs"}
                </button>
            </motion.div>
        </motion.div>
    );
}
