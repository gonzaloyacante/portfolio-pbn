/**
 * UI Components - Reusable components
 *
 * Import like: import { Button, Card, Input } from '@/components/ui'
 */

// Core UI Components (Flat Structure)
export { default as Button } from './Button'
export { default as Input } from './Input'
export { default as Select } from './Select'
export { Switch } from './Switch'
export { ToastProvider, useToast } from './Toast'

// Forms (Legacy paths - will be deprecated)
export { default as TextArea } from './forms/TextArea'
export { default as DatePicker } from './forms/DatePicker'

// Layout
export { default as Modal } from './layout/Modal'
export { default as Card } from './layout/Card'
export { default as Badge } from './layout/Badge'
export { default as PageHeader } from './layout/PageHeader'
export { default as ThemeToggle } from './layout/ThemeToggle'

// States / Feedback
export { default as EmptyState } from './feedback/EmptyState'
export { default as ErrorState } from './feedback/ErrorState'
export { default as LoadingState } from './feedback/LoadingState'
export { SkeletonCard, SkeletonGrid, SkeletonTestimonial } from './feedback/SkeletonCard'
export { ErrorBoundary } from './feedback/ErrorBoundary'

// Animations
export { FadeIn, SlideIn, ScaleIn, StaggerContainer } from './animations/Animations'

// Media
export { OptimizedImage } from './media/OptimizedImage'
