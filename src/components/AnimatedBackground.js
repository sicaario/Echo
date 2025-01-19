import React from 'react'
import { motion } from 'framer-motion'

export default function AnimatedBackground() {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden">
            <motion.div
                className="absolute inset-0 bg-gradient-to-br from-purple-900 to-gray-900"
                animate={{
                    background: [
                        'linear-gradient(to bottom right, #4a1d96, #111827)',
                        'linear-gradient(to bottom right, #5b21b6, #1f2937)',
                        'linear-gradient(to bottom right, #6d28d9, #111827)',
                    ],
                }}
                transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
            />
        </div>
    )
}
