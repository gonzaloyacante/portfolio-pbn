'use client'

import { useState, useEffect, type CSSProperties, type ReactNode } from 'react'
import { motion, AnimatePresence, Variants, useReducedMotion } from 'framer-motion'

const preMountHiddenStyle: CSSProperties = {
  opacity: 0,
}

function mergePreMountStyle(style?: CSSProperties, transform?: string): CSSProperties {
  return {
    ...style,
    ...preMountHiddenStyle,
    ...(transform ? { transform } : {}),
  }
}

/**
 * Hook that returns true only after the component has mounted on the client.
 * Used to prevent framer-motion 12's motion.* components from calling useContext
 * during Next.js 16 SSR (where ReactCurrentDispatcher.current can be null).
 */
function useIsMounted(): boolean {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setIsMounted(true))
    return () => cancelAnimationFrame(id)
  }, [])
  return isMounted
}

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
  const isMounted = useIsMounted()
  const shouldReduceMotion = useReducedMotion()

  if (disabled || !isMounted || shouldReduceMotion)
    return (
      <div
        className={className}
        style={disabled || shouldReduceMotion ? undefined : mergePreMountStyle(undefined, 'translateY(20px)')}
      >
        {children}
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
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
  const isMounted = useIsMounted()
  const shouldReduceMotion = useReducedMotion()

  const directions = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: 50 },
    down: { x: 0, y: -50 },
  }

  if (disabled || !isMounted || shouldReduceMotion) {
    const { x, y } = directions[direction]

    return (
      <div
        className={className}
        style={
          disabled || shouldReduceMotion
            ? undefined
            : mergePreMountStyle(undefined, `translate(${x}px, ${y}px)`)
        }
      >
        {children}
      </div>
    )
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
  const isMounted = useIsMounted()
  const shouldReduceMotion = useReducedMotion()

  if (disabled || !isMounted || shouldReduceMotion)
    return (
      <div
        className={className}
        style={disabled || shouldReduceMotion ? undefined : mergePreMountStyle(undefined, 'scale(0.9)')}
      >
        {children}
      </div>
    )

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
  const isMounted = useIsMounted()
  const shouldReduceMotion = useReducedMotion()

  if (!isMounted || shouldReduceMotion)
    return (
      <div
        className={className}
        style={shouldReduceMotion ? undefined : mergePreMountStyle(undefined, 'translateY(20px)')}
      >
        {children}
      </div>
    )

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-20px' }}
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
 * StaggerItem Component
 * Direct child of StaggerChildren. Uses variants (not whileInView) so the
 * parent's staggerChildren timing actually controls the entrance.
 */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) return <div className={className}>{children}</div>

  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}

/**
 * WordReveal Component
 * Animates a string word-by-word with a stagger, triggered on viewport entry.
 * Each word slides up and fades in independently.
 */
export function WordReveal({
  text,
  className,
  style,
  delay = 0,
  stagger = 0.08,
  as: Tag = 'span',
}: {
  text: string
  className?: string
  style?: CSSProperties
  delay?: number
  stagger?: number
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
}) {
  const isMounted = useIsMounted()
  const shouldReduceMotion = useReducedMotion()
  const MotionTag = motion[Tag] as typeof motion.span

  if (!isMounted || shouldReduceMotion) {
    const StaticTag = Tag
    return (
      <StaticTag
        className={className}
        style={shouldReduceMotion ? style : mergePreMountStyle(style, 'translateY(24px)')}
      >
        {text}
      </StaticTag>
    )
  }

  const words = text.split(' ')

  return (
    <MotionTag
      className={className}
      style={style}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="mr-[0.25em] inline-block last:mr-0"
          variants={{
            hidden: { opacity: 0, y: 24 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {word}
        </motion.span>
      ))}
    </MotionTag>
  )
}

/**
 * StaggerContainer alias for backward compatibility.
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

export { AnimatePresence, motion, useReducedMotion }
export type { Variants }
