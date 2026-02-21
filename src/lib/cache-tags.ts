/**
 * Cache Tags - Centralized cache tag management
 * Used with unstable_cache and revalidateTag for granular cache invalidation
 */

export const CACHE_TAGS = {
  // Projects
  projects: 'projects',
  project: (id: string) => `project-${id}`,
  projectBySlug: (slug: string) => `project-slug-${slug}`,
  featuredProjects: 'featured-projects',
  projectsByCategory: (categoryId: string) => `projects-category-${categoryId}`,

  // Categories
  categories: 'categories',
  category: (id: string) => `category-${id}`,

  // Settings
  siteSettings: 'site-settings',
  homeSettings: 'home-settings',
  aboutSettings: 'about-settings',
  contactSettings: 'contact-settings',
  projectSettings: 'project-settings',
  testimonialSettings: 'testimonial-settings',
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
  SHORT: 60, // 1 minute

  // Medium (most content)
  MEDIUM: 300, // 5 minutes

  // Long (settings, rarely changing)
  LONG: 1800, // 30 minutes

  // Very long (almost static)
  VERY_LONG: 3600, // 1 hour
} as const
