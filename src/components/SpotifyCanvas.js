import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SpotifyCanvas({ song, isPlaying, className = "" }) {
    const canvasRef = useRef(null);
    const animationRef = useRef(null);
    const [canvasType, setCanvasType] = useState('waveform');

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

        let time = 0;
        const animate = () => {
            if (!ctx || !canvas) return;

            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            time += 0.02;

            switch (canvasType) {
                case 'waveform':
                    drawWaveform(ctx, canvas, time, isPlaying);
                    break;
                case 'particles':
                    drawParticles(ctx, canvas, time, isPlaying);
                    break;
                case 'spectrum':
                    drawSpectrum(ctx, canvas, time, isPlaying);
                    break;
                case 'geometric':
                    drawGeometric(ctx, canvas, time, isPlaying);
                    break;
                default:
                    drawWaveform(ctx, canvas, time, isPlaying);
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Change canvas type every 10 seconds
        const interval = setInterval(() => {
            const types = ['waveform', 'particles', 'spectrum', 'geometric'];
            const currentIndex = types.indexOf(canvasType);
            const nextIndex = (currentIndex + 1) % types.length;
            setCanvasType(types[nextIndex]);
        }, 10000);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
            clearInterval(interval);
        };
    }, [canvasType, isPlaying]);

    const drawWaveform = (ctx, canvas, time, playing) => {
        const centerY = canvas.height / 2;
        const amplitude = playing ? 50 : 20;
        const frequency = 0.02;
        
        ctx.strokeStyle = '#1db954';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        for (let x = 0; x < canvas.width; x += 2) {
            const y = centerY + Math.sin(x * frequency + time * 3) * amplitude * (playing ? Math.random() * 0.5 + 0.5 : 0.3);
            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        // Add glow effect
        ctx.shadowColor = '#1db954';
        ctx.shadowBlur = playing ? 20 : 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
    };

    const drawParticles = (ctx, canvas, time, playing) => {
        const particleCount = playing ? 100 : 50;
        
        for (let i = 0; i < particleCount; i++) {
            const x = (Math.sin(time + i * 0.1) * canvas.width * 0.3) + canvas.width / 2;
            const y = (Math.cos(time * 0.7 + i * 0.15) * canvas.height * 0.3) + canvas.height / 2;
            const size = playing ? Math.sin(time * 2 + i) * 3 + 2 : 1;
            
            const hue = (time * 50 + i * 10) % 360;
            ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;
            
            ctx.beginPath();
            ctx.arc(x, y, Math.abs(size), 0, Math.PI * 2);
            ctx.fill();
        }
    };

    const drawSpectrum = (ctx, canvas, time, playing) => {
        const barCount = 64;
        const barWidth = canvas.width / barCount;
        
        for (let i = 0; i < barCount; i++) {
            const height = playing 
                ? Math.sin(time * 2 + i * 0.1) * canvas.height * 0.4 + canvas.height * 0.1
                : Math.sin(time + i * 0.2) * canvas.height * 0.2 + canvas.height * 0.05;
            
            const hue = (i * 5 + time * 30) % 360;
            ctx.fillStyle = `hsl(${hue}, 70%, 50%)`;
            
            ctx.fillRect(i * barWidth, canvas.height - Math.abs(height), barWidth - 1, Math.abs(height));
        }
    };

    const drawGeometric = (ctx, canvas, time, playing) => {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        
        for (let i = 0; i < 6; i++) {
            const radius = playing 
                ? 50 + i * 20 + Math.sin(time * 2 + i) * 20
                : 30 + i * 15 + Math.sin(time + i) * 10;
            
            const rotation = time + i * Math.PI / 3;
            
            ctx.strokeStyle = `hsl(${(time * 50 + i * 60) % 360}, 70%, 60%)`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let j = 0; j < 6; j++) {
                const angle = (j * Math.PI * 2) / 6 + rotation;
                const x = centerX + Math.cos(angle) * radius;
                const y = centerY + Math.sin(angle) * radius;
                
                if (j === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.stroke();
        }
    };

    return (
        <div className={`relative overflow-hidden ${className}`}>
            <canvas
                ref={canvasRef}
                className="w-full h-full"
                style={{ background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)' }}
            />
            {song && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{ 
                                scale: isPlaying ? [1, 1.05, 1] : 1,
                                opacity: isPlaying ? [0.8, 1, 0.8] : 0.6
                            }}
                            transition={{ 
                                duration: 2, 
                                repeat: isPlaying ? Infinity : 0,
                                ease: "easeInOut"
                            }}
                            className="text-white text-lg font-semibold mb-2 drop-shadow-lg"
                        >
                            {song.title}
                        </motion.div>
                        <div className="text-gray-300 text-sm drop-shadow-lg">
                            {song.artist}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}