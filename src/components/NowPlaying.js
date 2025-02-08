'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export default function NowPlaying({
                                       title = 'Neon Nights',
                                       artist = 'Cyber Punk',
                                   }) {
    const canvasRef = useRef(null);

    // Animation for the dots in the background
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dots = [];
        const numDots = 50;

        // Initialize dots
        for (let i = 0; i < numDots; i++) {
            dots.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                speed: 0.5 + Math.random() * 1.5,
            });
        }

        let animationFrameId;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(147, 51, 234, 0.5)'; 

            dots.forEach((dot) => {
                dot.y -= dot.speed;
                if (dot.y < 0) {
                    dot.y = canvas.height;
                    dot.x = Math.random() * canvas.width;
                }

                ctx.beginPath();
                ctx.arc(dot.x, dot.y, 1, 0, Math.PI * 2);
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className=" text-white rounded-lg shadow-lg p-2 w-56 md:w-60">
            <canvas ref={canvasRef} width={200} height={80} className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none" />
            <div className="relative flex items-center gap-4">
                {/* Waveform animation */}
                <motion.div
                    className="h-20 w-20 flex items-center justify-center rounded-md "
                >
                    <WaveformVisualizer />
                </motion.div>

                {/* Song info */}
                <div className="flex flex-col overflow-hidden">
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg font-bold whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                        {title}
                    </motion.div>
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-sm text-purple-200 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                        {artist}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

// Waveform Visualizer Component
function WaveformVisualizer() {
    return (
        <div className="flex h-10 w-full items-center justify-center gap-1">
            {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ height: '20%' }}
                    animate={{ height: ['20%', '90%', '20%'] }}
                    transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                        ease: 'easeInOut',
                    }}
                    className="w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full"
                />
            ))}
        </div>
    );
}

