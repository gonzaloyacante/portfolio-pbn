import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/lib/db', () => ({
  prisma: {
    contactSettings: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/security-server', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'ADMIN' }),
  guardSettingsAction: vi.fn().mockResolvedValue({ id: 'admin-1', role: 'ADMIN' }),
}))

vi.mock('@/lib/security-client', () => ({
  validateAndSanitize: vi.fn((schema: unknown, data: unknown) => ({ success: true, data })),
  validateFontUrl: vi.fn(() => true),
  validateColor: vi.fn(() => true),
}))

vi.mock('@/lib/rate-limit-guards', () => ({
  checkApiRateLimit: vi.fn().mockResolvedValue(undefined),
  checkSettingsRateLimit: vi.fn().mockResolvedValue(undefined),
  getClientIp: vi.fn().mockResolvedValue('127.0.0.1'),
}))

vi.mock('next/cache', () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: vi.fn((fn: Function) => fn),
}))

vi.mock('@/lib/cache-tags', () => ({
  CACHE_TAGS: {
    homeSettings: 'home-settings',
    aboutSettings: 'about-settings',
    contactSettings: 'contact-settings',
    siteSettings: 'site-settings',
    projectSettings: 'project-settings',
    categorySettings: 'category-settings',
    testimonialSettings: 'testimonial-settings',
    projects: 'projects',
    testimonials: 'testimonials',
    categories: 'categories',
    social: 'social',
    services: 'services',
  },
  CACHE_DURATIONS: { SHORT: 60, MEDIUM: 300, LONG: 1800, VERY_LONG: 3600 },
}))

vi.mock('@/config/routes', () => ({
  ROUTES: {
    home: '/',
    admin: {
      contacts: '/admin/contactos',
      contactSettings: '/admin/contactos/configuracion',
      settings: '/admin/configuracion',
    },
    public: {
      home: '/',
      about: '/sobre-mi',
      contact: '/contacto',
      projects: '/proyectos',
    },
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), error: vi.fn(), warn: vi.fn(), debug: vi.fn() },
}))

vi.mock('@/lib/validations', () => ({
  contactSettingsSchema: { partial: () => ({ parse: vi.fn((d: unknown) => d) }) },
}))

vi.mock('next/headers', () => ({
  headers: vi.fn().mockReturnValue(new Map([['x-forwarded-for', '127.0.0.1']])),
  cookies: vi.fn().mockReturnValue({ get: vi.fn(), set: vi.fn() }),
}))

// ─── Helpers ────────────────────────────────────────

const mockContactSettings = {
  id: 'contact-1',
  pageTitle: 'Contacto',
  illustrationUrl: 'https://res.cloudinary.com/test/contact-illustration.png',
  illustrationAlt: 'Ilustración contacto',
  ownerName: 'Paola Bolívar Nievas',
  email: 'info@paolabolivar.es',
  phone: '+34 600 000 000',
  whatsapp: '+34 600 000 000',
  location: 'Granada, España',
  formTitle: 'Envíame un mensaje',
  nameLabel: 'Tu nombre',
  emailLabel: 'Tu email',
  phoneLabel: 'Tu teléfono (opcional)',
  messageLabel: 'Mensaje',
  preferenceLabel: '¿Cómo preferís que te contacte?',
  submitLabel: 'Enviar mensaje',
  successTitle: '¡Mensaje enviado!',
  successMessage: 'Gracias por contactarme. Te responderé lo antes posible.',
  sendAnotherLabel: 'Enviar otro mensaje',
  showSocialLinks: true,
  isActive: true,
}

describe('Settings: Contact Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // ─── getContactSettings ────────────────────────────

  describe('getContactSettings', () => {
    it('returns settings when found', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contactSettings.findFirst).mockResolvedValue(mockContactSettings as never)

      const { getContactSettings } = await import('@/actions/settings/contact')
      const result = await getContactSettings()

      expect(result).toEqual(mockContactSettings)
    })

    it('returns null when no settings exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contactSettings.findFirst).mockResolvedValue(null as never)

      const { getContactSettings } = await import('@/actions/settings/contact')
      const result = await getContactSettings()

      expect(result).toBeNull()
    })

    it('returns null on DB error', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contactSettings.findFirst).mockRejectedValue(new Error('DB error'))

      const { getContactSettings } = await import('@/actions/settings/contact')
      const result = await getContactSettings()

      expect(result).toBeNull()
    })

    it('calls prisma.contactSettings.findFirst with isActive filter', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contactSettings.findFirst).mockResolvedValue(mockContactSettings as never)

      const { getContactSettings } = await import('@/actions/settings/contact')
      await getContactSettings()

      expect(prisma.contactSettings.findFirst).toHaveBeenCalledWith({
        where: { isActive: true },
      })
    })

    it('returns contact-specific fields like form labels', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contactSettings.findFirst).mockResolvedValue(mockContactSettings as never)

      const { getContactSettings } = await import('@/actions/settings/contact')
      const result = await getContactSettings()

      expect(result!.formTitle).toBe('Envíame un mensaje')
      expect(result!.nameLabel).toBe('Tu nombre')
      expect(result!.submitLabel).toBe('Enviar mensaje')
      expect(result!.showSocialLinks).toBe(true)
    })
  })

  // ─── updateContactSettings ─────────────────────────

  describe('updateContactSettings', () => {
    it('updates existing settings successfully', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contactSettings.findFirst).mockResolvedValue(mockContactSettings as never)
      vi.mocked(prisma.contactSettings.update).mockResolvedValue(mockContactSettings as never)

      const { updateContactSettings } = await import('@/actions/settings/contact')
      const result = await updateContactSettings({ pageTitle: 'Nuevo título' })

      expect(result.success).toBe(true)
      expect(result.settings).toBeDefined()
    })

    it('creates settings when none exist', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contactSettings.findFirst).mockResolvedValue(null as never)
      vi.mocked(prisma.contactSettings.create).mockResolvedValue(mockContactSettings as never)

      const { updateContactSettings } = await import('@/actions/settings/contact')
      const result = await updateContactSettings({ pageTitle: 'Nuevo' })

      expect(result.success).toBe(true)
      expect(prisma.contactSettings.create).toHaveBeenCalled()
    })

    it('requires admin authentication', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contactSettings.findFirst).mockResolvedValue(mockContactSettings as never)
      vi.mocked(prisma.contactSettings.update).mockResolvedValue(mockContactSettings as never)

      const { updateContactSettings } = await import('@/actions/settings/contact')
      await updateContactSettings({ pageTitle: 'Test' })

      expect(requireAdmin).toHaveBeenCalled()
    })

    it('checks rate limiting', async () => {
      const { checkSettingsRateLimit } = await import('@/lib/rate-limit-guards')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contactSettings.findFirst).mockResolvedValue(mockContactSettings as never)
      vi.mocked(prisma.contactSettings.update).mockResolvedValue(mockContactSettings as never)

      const { updateContactSettings } = await import('@/actions/settings/contact')
      await updateContactSettings({ pageTitle: 'Test' })

      expect(checkSettingsRateLimit).toHaveBeenCalledWith('admin-1')
    })

    it('validates data via validateAndSanitize', async () => {
      const { validateAndSanitize } = await import('@/lib/security-client')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contactSettings.findFirst).mockResolvedValue(mockContactSettings as never)
      vi.mocked(prisma.contactSettings.update).mockResolvedValue(mockContactSettings as never)

      const { updateContactSettings } = await import('@/actions/settings/contact')
      await updateContactSettings({ pageTitle: 'Test' })

      expect(validateAndSanitize).toHaveBeenCalled()
    })

    it('revalidates cache after update', async () => {
      const { revalidatePath, revalidateTag } = await import('next/cache')
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contactSettings.findFirst).mockResolvedValue(mockContactSettings as never)
      vi.mocked(prisma.contactSettings.update).mockResolvedValue(mockContactSettings as never)

      const { updateContactSettings } = await import('@/actions/settings/contact')
      await updateContactSettings({ pageTitle: 'Test' })

      expect(revalidatePath).toHaveBeenCalled()
      expect(revalidateTag).toHaveBeenCalled()
    })

    it('returns error on validation failure', async () => {
      const { validateAndSanitize } = await import('@/lib/security-client')
      vi.mocked(validateAndSanitize).mockReturnValueOnce({
        success: false,
        error: 'Datos inválidos',
      } as never)

      const { updateContactSettings } = await import('@/actions/settings/contact')
      const result = await updateContactSettings({ pageTitle: '' })

      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('returns error on DB failure', async () => {
      const { prisma } = await import('@/lib/db')
      vi.mocked(prisma.contactSettings.findFirst).mockRejectedValue(new Error('DB error'))

      const { updateContactSettings } = await import('@/actions/settings/contact')
      const result = await updateContactSettings({ pageTitle: 'Test' })

      expect(result.success).toBe(false)
    })

    it('returns access denied error when not admin', async () => {
      const { requireAdmin } = await import('@/lib/security-server')
      vi.mocked(requireAdmin).mockRejectedValueOnce(new Error('Acceso denegado'))

      const { updateContactSettings } = await import('@/actions/settings/contact')
      const result = await updateContactSettings({ pageTitle: 'Test' })

      expect(result.success).toBe(false)
      expect(result.error).toContain('Acceso denegado')
    })
  })
})
