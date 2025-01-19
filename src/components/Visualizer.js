import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export default function Visualizer() {
    const canvasRef = useRef(null)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const particles = []
        const particleCount = 100

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width
                this.y = Math.random() * canvas.height
                this.size = Math.random() * 5 + 1
                this.speedX = Math.random() * 3 - 1.5
                this.speedY = Math.random() * 3 - 1.5
            }

            update() {
                this.x += this.speedX
                this.y += this.speedY

                if (this.size > 0.2) this.size -= 0.1

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
            }

            draw() {
                if (!ctx) return
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)'
                ctx.lineWidth = 2

                ctx.beginPath()
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                ctx.closePath()
                ctx.fill()
            }
        }

        function createParticles() {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle())
            }
        }

        function animateParticles() {
            if (!ctx) return
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < particles.length; i++) {
                particles[i].update()
                particles[i].draw()

                // Connect particles with lines if close enough
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x
                    const dy = particles[i].y - particles[j].y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    if (distance < 100) {
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance / 100})`
                        ctx.lineWidth = 1
                        ctx.moveTo(particles[i].x, particles[i].y)
                        ctx.lineTo(particles[j].x, particles[j].y)
                        ctx.stroke()
                        ctx.closePath()
                    }
                }
            }
            requestAnimationFrame(animateParticles)
        }

        createParticles()
        animateParticles()

        // Handle browser resize
        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
            particles.length = 0 // Clear array
            createParticles()
        }

        window.addEventListener('resize', handleResize)
        return () => {
            window.removeEventListener('resize', handleResize)
        }
    }, [])

    return (
        <motion.canvas
            ref={canvasRef}
            className="absolute inset-0 z-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 2 }}
        />
    )
}
