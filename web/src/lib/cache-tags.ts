/**
 * Cache Tags - Centralized cache tag management
 * Used with unstable_cache and revalidateTag for granular cache invalidation
 */

export const CACHE_TAGS = {
  // Categories
  categories: 'categories',
  category: (id: string) => `category-${id}`,
  categoryImages: 'category-images',
  categoryImage: (id: string) => `category-image-${id}`,

  // Settings
  siteSettings: 'site-settings',
  homeSettings: 'home-settings',
  aboutSettings: 'about-settings',
  contactSettings: 'contact-settings',
  categorySettings: 'category-settings',
  testimonialSettings: 'testimonial-settings',
  servicesPageSettings: 'services-page-settings',
  themeSettings: 'theme-settings',

  // Content
  testimonials: 'testimonials',
  testimonial: (id: string) => `testimonial-${id}`,
  services: 'services',
  service: (id: string) => `service-${id}`,
  socialLinks: 'social-links',

  // Contacts
  contacts: 'contacts',
  bookings: 'bookings',

  // Analytics
  analytics: 'analytics',
} as const

/**
 * Cache durations for `unstable_cache`.
 */
export const CACHE_DURATIONS = {
  // Short-lived (items that change frequently)
  SHORT: 300, // 5 minutes

  // Medium (most content)
  MEDIUM: 900, // 15 minutes

  // Long-lived public/CMS data: no time-based regeneration, only explicit tag/path invalidation.
  LONG: false,

  // Almost static public data: CMS mutations explicitly revalidate tags/paths.
  VERY_LONG: false,
} as const
