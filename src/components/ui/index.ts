/**
 * UI Components - Reusable components
 *
 * Import like: import { Button, Card, Input } from '@/components/ui'
 */

// Forms
export { default as Button } from './forms/Button'
export { default as Input } from './forms/Input'
export { default as Select } from './forms/Select'
export { Switch } from './forms/Switch'
export { default as TextArea } from './forms/TextArea'
export { default as DatePicker } from './forms/DatePicker'

// Layout
export { default as Modal } from './layout/Modal'
export { default as Card } from './layout/Card'
export { default as Badge } from './layout/Badge'
export { default as PageHeader } from './layout/PageHeader'
export { default as ThemeToggle } from './layout/ThemeToggle'
export { Tabs, TabsList, TabsTrigger, TabsContent } from './layout/Tabs'

// States / Feedback
export { ToastProvider, useToast } from './feedback/Toast'
export { default as EmptyState } from './feedback/EmptyState'
export { default as ErrorState } from './feedback/ErrorState'
export { default as LoadingState } from './feedback/LoadingState'
export { SkeletonCard, SkeletonGrid, SkeletonTestimonial } from './feedback/SkeletonCard'
export { ErrorBoundary } from './feedback/ErrorBoundary'

// Animations
export {
  FadeIn,
  SlideIn,
  ScaleIn,
  StaggerChildren,
  StaggerContainer,
  AnimatePresence,
} from './animations/Animations'

// Media
export { OptimizedImage } from './media/OptimizedImage'
