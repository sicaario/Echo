import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Maximize2, Minimize2 } from 'lucide-react';

export default function AudioVisualizer({ isPlaying, song, onClose, audioRef }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Create audio context and analyser
        if (audioRef.current && !analyserRef.current) {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const analyser = audioContext.createAnalyser();
                const source = audioContext.createMediaElementSource(audioRef.current);
                
                source.connect(analyser);
                analyser.connect(audioContext.destination);
                
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);
                
                analyserRef.current = analyser;
                dataArrayRef.current = dataArray;
            } catch (error) {
                console.error('Error setting up audio context:', error);
            }
        }

        const draw = () => {
            if (!ctx || !canvas) return;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (analyserRef.current && dataArrayRef.current && isPlaying) {
                analyserRef.current.getByteFrequencyData(dataArrayRef.current);
                
                const barWidth = (canvas.width / dataArrayRef.current.length) * 2.5;
                let barHeight;
                let x = 0;

                for (let i = 0; i < dataArrayRef.current.length; i++) {
                    barHeight = (dataArrayRef.current[i] / 255) * canvas.height * 0.8;
                    
                    const hue = (i / dataArrayRef.current.length) * 360;
                    ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
                    
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);
                    x += barWidth + 1;
                }
            } else {
                // Static visualization when not playing
                drawStaticVisualization(ctx, canvas);
            }

            animationRef.current = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [isPlaying]);

    const drawStaticVisualization = (ctx, canvas) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const time = Date.now() * 0.001;

        // Draw pulsing circles
        for (let i = 0; i < 5; i++) {
            const radius = 50 + i * 30 + Math.sin(time + i) * 10;
            const alpha = 0.3 - i * 0.05;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Draw floating particles
        for (let i = 0; i < 20; i++) {
            const x = centerX + Math.cos(time + i) * (100 + i * 10);
            const y = centerY + Math.sin(time + i * 0.5) * (80 + i * 5);
            const size = 2 + Math.sin(time * 2 + i) * 1;
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(168, 85, 247, 0.6)`;
            ctx.fill();
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black z-50 flex flex-col ${
                isFullscreen ? 'p-0' : 'p-4'
            }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gray-900/50 backdrop-blur-sm">
                <div className="flex items-center space-x-4">
                    <img
                        src={song.imageUrl || 'https://via.placeholder.com/48'}
                        alt={song.title}
                        className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                        <h3 className="text-white font-semibold">{song.title}</h3>
                        <p className="text-gray-400 text-sm">{song.artist}</p>
                    </div>
                </div>
                
                <div className="flex items-center space-x-2">
                    <motion.button
                        onClick={toggleFullscreen}
                        className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isFullscreen ? (
                            <Minimize2 className="w-5 h-5" />
                        ) : (
                            <Maximize2 className="w-5 h-5" />
                        )}
                    </motion.button>
                    <motion.button
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <X className="w-5 h-5" />
                    </motion.button>
                </div>
            </div>

            {/* Visualizer Canvas */}
            <div className="flex-1 relative">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                    style={{ background: 'linear-gradient(45deg, #1a1a1a, #2d2d2d)' }}
                />
                
                {/* Overlay Info */}
                <div className="absolute bottom-8 left-8 right-8">
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center"
                    >
                        <h2 className="text-3xl font-bold text-white mb-2">{song.title}</h2>
                        <p className="text-xl text-gray-300">{song.artist}</p>
                        {song.album && (
                            <p className="text-lg text-gray-400 mt-1">{song.album}</p>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}