'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

/**
 * FadeIn Component
 * Simple fade-in animation for elements
 */
export function FadeIn({
    children,
    className,
    delay = 0,
    duration = 0.5,
}: {
    children: ReactNode
    className?: string
    delay?: number
    duration?: number
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/**
 * StaggerChildren Component
 * Container that staggers the appearance of its children
 */
export function StaggerChildren({
    children,
    className,
    staggerDelay = 0.1,
}: {
    children: ReactNode
    className?: string
    staggerDelay?: number
}) {
    return (
        <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

/**
 * SlideIn Component
 * Slide from side
 */
export function SlideIn({
    children,
    className,
    direction = 'left',
    delay = 0,
}: {
    children: ReactNode
    className?: string
    direction?: 'left' | 'right' | 'up' | 'down'
    delay?: number
}) {
    const directions = {
        left: { x: -50, y: 0 },
        right: { x: 50, y: 0 },
        up: { x: 0, y: 50 },
        down: { x: 0, y: -50 },
    }

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
            className={className}
        >
            {children}
        </motion.div>
    )
}
