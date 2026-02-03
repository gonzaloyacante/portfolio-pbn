/**
 * UI Components - Reusable components
 * Organized by category
 */

// Forms
export { default as Button } from './forms/Button'
export { default as Input } from './forms/Input'
export { default as Select } from './forms/Select'
export { Switch } from './forms/Switch'
export { default as TextArea } from './forms/TextArea'
export { default as DatePicker } from './forms/DatePicker'
export { FormLabel, FormMessage, FormField } from './forms/Form'
export { default as SmartField } from './forms/SmartField'
export { default as ColorPicker, ColorPicker as ColorPickerComponent } from './forms/ColorPicker'
export { default as IconPicker } from './forms/IconPicker'
export { default as FontPicker } from './forms/FontPicker'

// Data Display
export { default as Card } from './data-display/Card'
export { default as Badge } from './data-display/Badge'
export { default as DataTable } from './data-display/DataTable'
export { default as StatCard } from './data-display/StatCard'
export { default as FilterBar } from './data-display/FilterBar'
export { default as PreviewCard } from './data-display/PreviewCard'

// Overlay
export { default as Modal } from './overlay/Modal'
export { ConfirmDialog, useConfirmDialog } from './overlay/ConfirmDialog'

// Navigation
export { Tabs, TabsList, TabsTrigger, TabsContent } from './navigation/Tabs'

// Layout
// Note: Layout components moved to @/components/layout
// export { default as PageHeader } from './layout/PageHeader'
// export { default as Section } from './layout/Section'
// export { default as AdminSidebar } from './layout/AdminSidebar'
// export { default as ViewToggle } from './layout/ViewToggle'
// export { default as SortableGrid } from './layout/SortableGrid'

// Feedback
export { ToastProvider, useToast } from './feedback/Toast'
export { default as EmptyState } from './feedback/EmptyState'
export { default as ErrorState } from './feedback/ErrorState'
export { default as LoadingState } from './feedback/LoadingState'
export { default as LoadingOverlay } from './feedback/LoadingOverlay'
export { Skeleton } from './feedback/Skeleton'
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
export { MagneticButton } from './animations/MagneticButton'
export { ScrollProgress } from './animations/ScrollProgress'

// Media
export { OptimizedImage } from './media/OptimizedImage'
export { default as ImageUpload } from './media/ImageUpload'
export { default as SortableImage } from './media/SortableImage'
export { default as SortableImageGrid } from './media/SortableImageGrid'
export { default as ThumbnailSelector } from './media/ThumbnailSelector'
