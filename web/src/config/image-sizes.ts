/**
 * Image `sizes` presets for responsive image rendering (Next.js `sizes` attr).
 *
 * Keep this centralized to avoid hardcoded strings across features and admin UI.
 * Breakpoints follow Tailwind defaults used by the project:
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px
 */
export const IMAGE_SIZES = {
  /** Generic fallback for fixed-size renders without explicit `sizes`. */
  common: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',

  /** Public: portfolio/category cards. */
  publicCardGrid: '(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw',
  /** Public: featured/testimonial/category 3-col grids. */
  publicThreeColGrid: '(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
  /** Public: service gallery in detail page. */
  publicServiceGallery: '(max-width: 768px) 50vw, 33vw',
  /** Public hero/banner full width. */
  fullWidth: '100vw',
  /** Public/Editor: hero primary image block. */
  heroMain: '(max-width: 768px) 100vw, 50vw',
  /** Decorative illustration sizes in hero/contact/about. */
  illustrationSmall: '120px',
  illustrationMedium: '320px',
  heroIllustration: '(max-width: 1024px) 96px, 320px',
  /** About profile panel image. */
  aboutProfile: '(max-width: 768px) 80vw, (max-width: 1024px) 40vw, 400px',

  /** CMS/admin fixed thumbnails. */
  adminThumbSm: '96px',
  adminThumbMd: '128px',
  adminThumbLg: '192px',
  /** CMS/admin responsive grids. */
  adminCardGrid: '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  adminPickerGrid: '(max-width: 640px) 45vw, 150px',
  adminSortableGrid: '(max-width: 640px) 45vw, 160px',
  adminCoverPreview: '(max-width: 768px) 100vw, 896px',
  adminUploadSingle: '(max-width: 768px) 100vw, 50vw',
  adminUploadGrid: '(max-width: 768px) 50vw, 20vw',
  adminThumbSelector: '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw',
} as const
