'use client'

import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ReactNode } from 'react'

/**
 * FadeIn Component
 * Simple fade-in animation for elements when they enter the viewport
 */
/**
 * FadeIn Component
 * Simple fade-in animation for elements when they enter the viewport
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  duration = 0.5,
  disabled = false,
}: {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  disabled?: boolean
}) {
  if (disabled) return <div className={className}>{children}</div>

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
 * SlideIn Component
 * Slide from side when entering viewport
 */
export function SlideIn({
  children,
  className,
  direction = 'left',
  delay = 0,
  duration = 0.5,
  disabled = false,
}: {
  children: ReactNode
  className?: string
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  duration?: number
  disabled?: boolean
}) {
  if (disabled) return <div className={className}>{children}</div>

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
      transition={{ duration, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * ScaleIn Component
 * Scale up animation
 */
export function ScaleIn({
  children,
  delay = 0,
  duration = 0.3,
  className,
  disabled = false,
}: {
  children: ReactNode
  delay?: number
  duration?: number
  className?: string
  disabled?: boolean
}) {
  if (disabled) return <div className={className}>{children}</div>

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration, delay }}
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
 * StaggerContainer alias for compatibility if needed, or simply prefer StaggerChildren
 */
export const StaggerContainer = StaggerChildren

/**
 * Reusable variants for staggering items manually
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export { AnimatePresence }
