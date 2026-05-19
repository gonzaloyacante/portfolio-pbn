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

  // Analytics
  analytics: 'analytics',
} as const

/**
 * Cache durations in seconds
 */
export const CACHE_DURATIONS = {
  // Short-lived (items that change frequently)
  SHORT: 300, // 5 minutes

  // Medium (most content)
  MEDIUM: 900, // 15 minutes

  // Long (settings, rarely changing; CMS mutations explicitly revalidate tags)
  LONG: 86400, // 24 hours

  // Very long (almost static)
  VERY_LONG: 86400, // 24 hours
} as const
