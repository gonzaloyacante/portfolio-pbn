/**
 * OpenAPI Registry — portfolio-pbn API spec
 *
 * Uses @asteasolutions/zod-to-openapi v8 (Zod v4 compatible).
 * Covers endpoints consumed by the Flutter mobile app.
 */

import { OpenAPIRegistry, extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

extendZodWithOpenApi(z)

export const registry = new OpenAPIRegistry()

// ── Security scheme ─────────────────────────────────────────────────────────

registry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
})

// ── Reusable schemas ─────────────────────────────────────────────────────────

const ErrorSchema = registry.register(
  'Error',
  z
    .object({
      error: z.string().openapi({ example: 'Mensaje de error' }),
    })
    .openapi('Error')
)

const BookingStatusSchema = z
  .enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'CANCELLED', 'COMPLETED', 'NO_SHOW'])
  .openapi({ description: 'Estado de la reserva' })

const BookingSchema = registry.register(
  'Booking',
  z
    .object({
      id: z.string().openapi({ example: 'clxxxxxx' }),
      date: z.string().openapi({ example: '2026-07-01T10:00:00.000Z' }),
      endDate: z.string().nullable().openapi({ example: '2026-07-01T11:00:00.000Z' }),
      clientName: z.string().openapi({ example: 'María García' }),
      clientEmail: z.string().openapi({ example: 'maria@example.com' }),
      clientPhone: z.string().nullable().openapi({ example: '+34600000000' }),
      clientNotes: z.string().nullable(),
      guestCount: z.number().nullable(),
      serviceId: z.string(),
      adminNotes: z.string().nullable(),
      totalAmount: z.number().nullable(),
      paymentStatus: z.string().nullable(),
      paymentMethod: z.string().nullable(),
      status: BookingStatusSchema,
      cancellationReason: z.string().nullable(),
      paidAmount: z.number().nullable(),
      paymentRef: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .openapi('Booking')
)

const AppReleaseSchema = registry.register(
  'AppRelease',
  z
    .object({
      id: z.string(),
      version: z.string().openapi({ example: '1.2.0' }),
      versionCode: z.number().openapi({ example: 10200 }),
      releaseNotes: z.string(),
      downloadUrl: z.string().openapi({ example: 'https://example.com/app.apk' }),
      checksumSha256: z.string().nullable(),
      mandatory: z.boolean(),
      minVersion: z.string().nullable(),
      fileSizeBytes: z.number().nullable(),
      publishedAt: z.string(),
    })
    .openapi('AppRelease')
)

// ── Auth endpoints ────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/admin/auth/login',
  operationId: 'adminLogin',
  summary: 'Admin login',
  tags: ['Auth'],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              email: z.string().email().openapi({ example: 'admin@example.com' }),
              password: z.string().min(1).openapi({ example: 'secret' }),
            })
            .openapi('LoginRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Login exitoso — sets httpOnly cookie + retorna accessToken',
      content: {
        'application/json': {
          schema: z
            .object({
              accessToken: z.string(),
              user: z.object({
                id: z.string(),
                email: z.string(),
                name: z.string().nullable(),
              }),
            })
            .openapi('LoginResponse'),
        },
      },
    },
    401: {
      description: 'Credenciales inválidas',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/admin/auth/logout',
  operationId: 'adminLogout',
  summary: 'Admin logout — clears httpOnly cookie',
  tags: ['Auth'],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'Logout exitoso',
      content: {
        'application/json': { schema: z.object({ ok: z.boolean() }).openapi('LogoutResponse') },
      },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/admin/auth/refresh',
  operationId: 'adminRefreshToken',
  summary: 'Refresca access token via httpOnly refresh cookie',
  tags: ['Auth'],
  responses: {
    200: {
      description: 'Nuevo access token',
      content: {
        'application/json': {
          schema: z.object({ accessToken: z.string() }).openapi('RefreshResponse'),
        },
      },
    },
    401: {
      description: 'Refresh token inválido o expirado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/admin/auth/me',
  operationId: 'adminGetMe',
  summary: 'Obtiene perfil del admin autenticado',
  tags: ['Auth'],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'Perfil del admin',
      content: {
        'application/json': {
          schema: z
            .object({
              id: z.string(),
              email: z.string(),
              name: z.string().nullable(),
              role: z.string(),
            })
            .openapi('AdminProfile'),
        },
      },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/admin/auth/me',
  operationId: 'adminUpdateMe',
  summary: 'Actualiza nombre o contraseña del admin',
  tags: ['Auth'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              currentPassword: z.string().optional(),
              newPassword: z.string().min(8).optional(),
              name: z.string().min(2).optional(),
            })
            .openapi('UpdateMeRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Perfil actualizado',
      content: {
        'application/json': { schema: z.object({ ok: z.boolean() }).openapi('UpdateMeResponse') },
      },
    },
    400: {
      description: 'Validación fallida',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

// ── Bookings ─────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/admin/bookings',
  operationId: 'listBookings',
  summary: 'Lista reservas (admin)',
  tags: ['Bookings'],
  security: [{ BearerAuth: [] }],
  request: {
    query: z.object({
      status: BookingStatusSchema.optional(),
      page: z.coerce.number().int().positive().optional().openapi({ example: 1 }),
      limit: z.coerce.number().int().positive().optional().openapi({ example: 20 }),
    }),
  },
  responses: {
    200: {
      description: 'Lista paginada de reservas',
      content: {
        'application/json': {
          schema: z
            .object({
              items: z.array(BookingSchema),
              total: z.number(),
              page: z.number(),
              totalPages: z.number(),
            })
            .openapi('BookingList'),
        },
      },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/admin/bookings',
  operationId: 'createBooking',
  summary: 'Crea una reserva (admin)',
  tags: ['Bookings'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              date: z.string(),
              endDate: z.string().optional().nullable(),
              clientName: z.string().min(1).max(100),
              clientEmail: z.string().email().max(150),
              clientPhone: z.string().optional().nullable(),
              clientNotes: z.string().optional().nullable(),
              guestCount: z.number().int().positive().optional().nullable(),
              serviceId: z.string().min(1),
              adminNotes: z.string().optional().nullable(),
              totalAmount: z.number().optional().nullable(),
              paymentStatus: z.string().optional().nullable(),
              paymentMethod: z.string().optional().nullable(),
              status: BookingStatusSchema.optional(),
            })
            .openapi('CreateBookingRequest'),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Reserva creada',
      content: { 'application/json': { schema: BookingSchema } },
    },
    400: {
      description: 'Validación fallida',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/admin/bookings/{id}',
  operationId: 'getBooking',
  summary: 'Obtiene una reserva por ID',
  tags: ['Bookings'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: 'Reserva', content: { 'application/json': { schema: BookingSchema } } },
    404: { description: 'No encontrada', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/admin/bookings/{id}',
  operationId: 'updateBooking',
  summary: 'Actualiza una reserva',
  tags: ['Bookings'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              date: z.string().optional(),
              endDate: z.string().optional().nullable(),
              clientName: z.string().optional(),
              clientEmail: z.string().email().optional(),
              clientPhone: z.string().optional().nullable(),
              clientNotes: z.string().optional().nullable(),
              guestCount: z.number().optional().nullable(),
              serviceId: z.string().optional(),
              adminNotes: z.string().optional().nullable(),
              totalAmount: z.number().optional().nullable(),
              paymentStatus: z.string().optional().nullable(),
              paymentMethod: z.string().optional().nullable(),
              status: BookingStatusSchema.optional(),
              cancellationReason: z.string().optional().nullable(),
              paidAmount: z.number().optional().nullable(),
              paymentRef: z.string().optional().nullable(),
            })
            .openapi('UpdateBookingRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Reserva actualizada',
      content: { 'application/json': { schema: BookingSchema } },
    },
    400: {
      description: 'Validación fallida',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    404: { description: 'No encontrada', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/admin/bookings/{id}',
  operationId: 'deleteBooking',
  summary: 'Elimina una reserva',
  tags: ['Bookings'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'Eliminada',
      content: {
        'application/json': { schema: z.object({ ok: z.boolean() }).openapi('DeleteResponse') },
      },
    },
    404: { description: 'No encontrada', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

// ── Push notifications ───────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/admin/push/register',
  operationId: 'registerPushToken',
  summary: 'Registra token FCM para push notifications',
  tags: ['Push'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              token: z.string().min(1),
              platform: z.enum(['android', 'ios']),
            })
            .openapi('PushRegisterRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Token registrado',
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean() }).openapi('PushRegisterResponse'),
        },
      },
    },
    400: {
      description: 'Validación fallida',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/admin/push/unregister',
  operationId: 'unregisterPushToken',
  summary: 'Elimina token FCM',
  tags: ['Push'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ token: z.string().min(1) }).openapi('PushUnregisterRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Token eliminado',
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean() }).openapi('PushUnregisterResponse'),
        },
      },
    },
  },
})

// ── App releases ─────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/admin/app/latest-release',
  operationId: 'getLatestRelease',
  summary: 'Obtiene la última release de la app',
  tags: ['AppRelease'],
  responses: {
    200: { description: 'Release', content: { 'application/json': { schema: AppReleaseSchema } } },
    404: {
      description: 'No hay releases',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/admin/app/latest-release',
  operationId: 'createRelease',
  summary: 'Crea una nueva release',
  tags: ['AppRelease'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              version: z.string().min(1),
              versionCode: z.number().int().positive(),
              releaseNotes: z.string().min(1),
              downloadUrl: z.string().url(),
              checksumSha256: z.string().optional().nullable(),
              mandatory: z.boolean().optional(),
              minVersion: z.string().optional().nullable(),
              fileSizeBytes: z.number().int().positive().optional().nullable(),
            })
            .openapi('CreateReleaseRequest'),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Release creada',
      content: { 'application/json': { schema: AppReleaseSchema } },
    },
    400: {
      description: 'Validación fallida',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/admin/app/latest-release/delete',
  operationId: 'deleteRelease',
  summary: 'Elimina la release actual',
  tags: ['AppRelease'],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'Release eliminada',
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean() }).openapi('DeleteReleaseResponse'),
        },
      },
    },
    404: {
      description: 'No hay release',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

// ── Reusable schemas ──────────────────────────────────────────────────────────

const PaginationSchema = z
  .object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  })
  .openapi('Pagination')

// ── Services ─────────────────────────────────────────────────────────────────

const ServicePricingTierSchema = registry.register(
  'ServicePricingTier',
  z
    .object({
      id: z.string(),
      name: z.string(),
      price: z.string().openapi({ description: 'Precio como string (Decimal serializado)' }),
      description: z.string().nullable(),
      sortOrder: z.number(),
    })
    .openapi('ServicePricingTier')
)

const ServiceItemSchema = registry.register(
  'ServiceItem',
  z
    .object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      shortDesc: z.string().nullable(),
      price: z.string().nullable(),
      priceLabel: z.string().nullable(),
      currency: z.string(),
      duration: z.string().nullable(),
      imageUrl: z.string().nullable(),
      isActive: z.boolean(),
      isFeatured: z.boolean(),
      isAvailable: z.boolean(),
      sortOrder: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .openapi('ServiceItem')
)

const ServiceDetailSchema = registry.register(
  'ServiceDetail',
  z
    .object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      description: z.string().nullable(),
      shortDesc: z.string().nullable(),
      price: z.string().nullable(),
      priceLabel: z.string().nullable(),
      currency: z.string(),
      duration: z.string().nullable(),
      durationMinutes: z.number().nullable(),
      imageUrl: z.string().nullable(),
      videoUrl: z.string().nullable(),
      isActive: z.boolean(),
      isFeatured: z.boolean(),
      isAvailable: z.boolean(),
      maxBookingsPerDay: z.number().nullable(),
      advanceNoticeDays: z.number().nullable(),
      sortOrder: z.number(),
      requirements: z.string().nullable(),
      cancellationPolicy: z.string().nullable(),
      pricingTiers: z.array(ServicePricingTierSchema),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .openapi('ServiceDetail')
)

registry.registerPath({
  method: 'get',
  path: '/api/admin/services',
  operationId: 'listServices',
  summary: 'Lista servicios (admin)',
  tags: ['Services'],
  security: [{ BearerAuth: [] }],
  request: {
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      active: z.enum(['true', 'false']).optional(),
      featured: z.enum(['true', 'false']).optional(),
    }),
  },
  responses: {
    200: {
      description: 'Lista paginada de servicios',
      content: {
        'application/json': {
          schema: z
            .object({ data: z.array(ServiceItemSchema), pagination: PaginationSchema })
            .openapi('ServiceList'),
        },
      },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/admin/services',
  operationId: 'createService',
  summary: 'Crea un servicio',
  tags: ['Services'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              name: z.string().min(1),
              slug: z.string().optional(),
              description: z.string().optional().nullable(),
              shortDesc: z.string().optional().nullable(),
              price: z.number().optional().nullable(),
              priceLabel: z.string().optional(),
              currency: z.string().optional(),
              duration: z.string().optional().nullable(),
              durationMinutes: z.number().int().optional().nullable(),
              imageUrl: z.string().optional().nullable(),
              isActive: z.boolean().optional(),
              isFeatured: z.boolean().optional(),
              isAvailable: z.boolean().optional(),
            })
            .openapi('CreateServiceRequest'),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Servicio creado',
      content: { 'application/json': { schema: ServiceDetailSchema } },
    },
    400: {
      description: 'Validación fallida',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    409: {
      description: 'Slug duplicado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/admin/services/{id}',
  operationId: 'getService',
  summary: 'Obtiene un servicio por ID',
  tags: ['Services'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'Servicio',
      content: { 'application/json': { schema: ServiceDetailSchema } },
    },
    404: { description: 'No encontrado', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/admin/services/{id}',
  operationId: 'updateService',
  summary: 'Actualiza un servicio',
  tags: ['Services'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              name: z.string().optional(),
              slug: z.string().optional(),
              description: z.string().optional().nullable(),
              shortDesc: z.string().optional().nullable(),
              price: z.number().optional().nullable(),
              priceLabel: z.string().optional(),
              currency: z.string().optional(),
              duration: z.string().optional().nullable(),
              durationMinutes: z.number().int().optional().nullable(),
              imageUrl: z.string().optional().nullable(),
              isActive: z.boolean().optional(),
              isFeatured: z.boolean().optional(),
              isAvailable: z.boolean().optional(),
              sortOrder: z.number().int().optional(),
            })
            .openapi('UpdateServiceRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Servicio actualizado',
      content: { 'application/json': { schema: ServiceDetailSchema } },
    },
    404: { description: 'No encontrado', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/admin/services/{id}',
  operationId: 'deleteService',
  summary: 'Elimina un servicio (soft delete)',
  tags: ['Services'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'Eliminado',
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean() }).openapi('DeleteServiceResponse'),
        },
      },
    },
    404: { description: 'No encontrado', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

// ── Categories ────────────────────────────────────────────────────────────────

const CategoryItemSchema = registry.register(
  'CategoryItem',
  z
    .object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      description: z.string().nullable(),
      coverImageUrl: z.string().nullable(),
      sortOrder: z.number(),
      isActive: z.boolean(),
      imageCount: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .openapi('CategoryItem')
)

const CategoryDetailSchema = registry.register(
  'CategoryDetail',
  z
    .object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      description: z.string().nullable(),
      coverImageUrl: z.string().nullable(),
      sortOrder: z.number(),
      isActive: z.boolean(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .openapi('CategoryDetail')
)

const GalleryImageSchema = registry.register(
  'GalleryImage',
  z
    .object({
      id: z.string(),
      url: z.string(),
      publicId: z.string().nullable(),
      order: z.number(),
      categoryId: z.string(),
      width: z.number().nullable(),
      height: z.number().nullable(),
      isFeatured: z.boolean(),
    })
    .openapi('GalleryImage')
)

registry.registerPath({
  method: 'get',
  path: '/api/admin/categories',
  operationId: 'listCategories',
  summary: 'Lista categorías (admin)',
  tags: ['Categories'],
  security: [{ BearerAuth: [] }],
  request: {
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      active: z.enum(['true', 'false']).optional(),
    }),
  },
  responses: {
    200: {
      description: 'Lista paginada de categorías',
      content: {
        'application/json': {
          schema: z
            .object({ data: z.array(CategoryItemSchema), pagination: PaginationSchema })
            .openapi('CategoryList'),
        },
      },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/admin/categories',
  operationId: 'createCategory',
  summary: 'Crea una categoría',
  tags: ['Categories'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              name: z.string().min(1),
              slug: z.string().optional(),
              description: z.string().optional().nullable(),
              coverImageUrl: z.string().optional().nullable(),
              isActive: z.boolean().optional(),
            })
            .openapi('CreateCategoryRequest'),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Categoría creada',
      content: { 'application/json': { schema: CategoryDetailSchema } },
    },
    400: {
      description: 'Validación fallida',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    409: {
      description: 'Slug duplicado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/admin/categories/{id}',
  operationId: 'getCategory',
  summary: 'Obtiene una categoría por ID',
  tags: ['Categories'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'Categoría',
      content: { 'application/json': { schema: CategoryDetailSchema } },
    },
    404: { description: 'No encontrada', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/admin/categories/{id}',
  operationId: 'updateCategory',
  summary: 'Actualiza una categoría',
  tags: ['Categories'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              name: z.string().optional(),
              slug: z.string().optional(),
              description: z.string().optional().nullable(),
              coverImageUrl: z.string().optional().nullable(),
              isActive: z.boolean().optional(),
              sortOrder: z.number().int().optional(),
            })
            .openapi('UpdateCategoryRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Categoría actualizada',
      content: { 'application/json': { schema: CategoryDetailSchema } },
    },
    404: { description: 'No encontrada', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/admin/categories/{id}',
  operationId: 'deleteCategory',
  summary: 'Elimina una categoría (soft delete)',
  tags: ['Categories'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'Eliminada',
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean() }).openapi('DeleteCategoryResponse'),
        },
      },
    },
    404: { description: 'No encontrada', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

// ── Category Gallery ──────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/admin/categories/{id}/gallery',
  operationId: 'getCategoryGallery',
  summary: 'Obtiene imágenes de la galería de una categoría',
  tags: ['Categories'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'Lista de imágenes',
      content: {
        'application/json': {
          schema: z
            .object({ images: z.array(GalleryImageSchema) })
            .openapi('CategoryGalleryResponse'),
        },
      },
    },
    404: {
      description: 'Categoría no encontrada',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/admin/categories/{id}/gallery',
  operationId: 'addGalleryImages',
  summary: 'Agrega imágenes a la galería de una categoría',
  tags: ['Categories'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              images: z
                .array(
                  z.object({
                    url: z.string(),
                    publicId: z.string(),
                    width: z.number().optional(),
                    height: z.number().optional(),
                  })
                )
                .min(1)
                .max(50),
            })
            .openapi('AddGalleryImagesRequest'),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Imágenes agregadas',
      content: {
        'application/json': {
          schema: z
            .object({ images: z.array(GalleryImageSchema) })
            .openapi('AddGalleryImagesResponse'),
        },
      },
    },
    400: {
      description: 'Validación fallida',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    404: {
      description: 'Categoría no encontrada',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'put',
  path: '/api/admin/categories/{id}/gallery',
  operationId: 'reorderGallery',
  summary: 'Actualiza el orden de la galería',
  tags: ['Categories'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: z.object({ orderedIds: z.array(z.string()) }).openapi('ReorderGalleryRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Orden actualizado',
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean() }).openapi('ReorderGalleryResponse'),
        },
      },
    },
    404: {
      description: 'Categoría no encontrada',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/admin/categories/{id}/gallery',
  operationId: 'toggleGalleryImageFeatured',
  summary: 'Alterna isFeatured de una imagen de galería',
  tags: ['Categories'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: z
            .object({ imageId: z.string(), isFeatured: z.boolean() })
            .openapi('ToggleFeaturedRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'isFeatured actualizado',
      content: { 'application/json': { schema: GalleryImageSchema } },
    },
    404: {
      description: 'Imagen o categoría no encontrada',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/admin/categories/{id}/gallery',
  operationId: 'deleteGalleryImage',
  summary: 'Elimina una imagen de la galería',
  tags: ['Categories'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: z.object({ imageId: z.string() }).openapi('DeleteGalleryImageRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Imagen eliminada',
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean() }).openapi('DeleteGalleryImageResponse'),
        },
      },
    },
    404: {
      description: 'Imagen o categoría no encontrada',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

// ── Contacts ─────────────────────────────────────────────────────────────────

const ContactItemSchema = registry.register(
  'ContactItem',
  z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      phone: z.string().nullable(),
      subject: z.string().nullable(),
      status: z.string(),
      priority: z.string(),
      isRead: z.boolean(),
      readAt: z.string().nullable(),
      tags: z.array(z.string()),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .openapi('ContactItem')
)

const ContactDetailSchema = registry.register(
  'ContactDetail',
  z
    .object({
      id: z.string(),
      name: z.string(),
      email: z.string(),
      phone: z.string().nullable(),
      message: z.string(),
      subject: z.string().nullable(),
      responsePreference: z.string(),
      instagramUser: z.string().nullable(),
      status: z.string(),
      priority: z.string(),
      isRead: z.boolean(),
      readAt: z.string().nullable(),
      isImportant: z.boolean(),
      adminNote: z.string().nullable(),
      tags: z.array(z.string()),
      ipAddress: z.string().nullable(),
      referrer: z.string().nullable(),
      utmSource: z.string().nullable(),
      utmMedium: z.string().nullable(),
      utmCampaign: z.string().nullable(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .openapi('ContactDetail')
)

registry.registerPath({
  method: 'get',
  path: '/api/admin/contacts',
  operationId: 'listContacts',
  summary: 'Lista contactos (admin)',
  tags: ['Contacts'],
  security: [{ BearerAuth: [] }],
  request: {
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      status: z.string().optional(),
      isRead: z.enum(['true', 'false']).optional(),
    }),
  },
  responses: {
    200: {
      description: 'Lista paginada de contactos',
      content: {
        'application/json': {
          schema: z
            .object({ data: z.array(ContactItemSchema), pagination: PaginationSchema })
            .openapi('ContactList'),
        },
      },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/admin/contacts/{id}',
  operationId: 'getContact',
  summary: 'Obtiene un contacto por ID (marca como leído)',
  tags: ['Contacts'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'Contacto',
      content: { 'application/json': { schema: ContactDetailSchema } },
    },
    404: { description: 'No encontrado', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/admin/contacts/{id}',
  operationId: 'updateContact',
  summary: 'Actualiza un contacto',
  tags: ['Contacts'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              status: z.string().optional(),
              priority: z.string().optional(),
              isRead: z.boolean().optional(),
              isImportant: z.boolean().optional(),
              adminNote: z.string().optional().nullable(),
              tags: z.array(z.string()).optional(),
            })
            .openapi('UpdateContactRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Contacto actualizado',
      content: { 'application/json': { schema: ContactDetailSchema } },
    },
    404: { description: 'No encontrado', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/admin/contacts/{id}',
  operationId: 'deleteContact',
  summary: 'Elimina un contacto (soft delete)',
  tags: ['Contacts'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'Eliminado',
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean() }).openapi('DeleteContactResponse'),
        },
      },
    },
    404: { description: 'No encontrado', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

// ── Testimonials ──────────────────────────────────────────────────────────────

const TestimonialItemSchema = registry.register(
  'TestimonialItem',
  z
    .object({
      id: z.string(),
      name: z.string(),
      excerpt: z.string().nullable(),
      position: z.string().nullable(),
      company: z.string().nullable(),
      avatarUrl: z.string().nullable(),
      rating: z.number(),
      verified: z.boolean(),
      featured: z.boolean(),
      status: z.string(),
      isActive: z.boolean(),
      sortOrder: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .openapi('TestimonialItem')
)

const TestimonialDetailSchema = registry.register(
  'TestimonialDetail',
  z
    .object({
      id: z.string(),
      name: z.string(),
      text: z.string(),
      excerpt: z.string().nullable(),
      email: z.string().nullable(),
      phone: z.string().nullable(),
      position: z.string().nullable(),
      company: z.string().nullable(),
      avatarUrl: z.string().nullable(),
      rating: z.number(),
      verified: z.boolean(),
      featured: z.boolean(),
      status: z.string(),
      isActive: z.boolean(),
      sortOrder: z.number(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
    .openapi('TestimonialDetail')
)

registry.registerPath({
  method: 'get',
  path: '/api/admin/testimonials',
  operationId: 'listTestimonials',
  summary: 'Lista testimonios (admin)',
  tags: ['Testimonials'],
  security: [{ BearerAuth: [] }],
  request: {
    query: z.object({
      page: z.coerce.number().optional(),
      limit: z.coerce.number().optional(),
      search: z.string().optional(),
      status: z.string().optional(),
      featured: z.enum(['true', 'false']).optional(),
      active: z.enum(['true', 'false']).optional(),
    }),
  },
  responses: {
    200: {
      description: 'Lista paginada de testimonios',
      content: {
        'application/json': {
          schema: z
            .object({ data: z.array(TestimonialItemSchema), pagination: PaginationSchema })
            .openapi('TestimonialList'),
        },
      },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/admin/testimonials',
  operationId: 'createTestimonial',
  summary: 'Crea un testimonio',
  tags: ['Testimonials'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              name: z.string().min(1),
              text: z.string().min(1),
              excerpt: z.string().optional().nullable(),
              position: z.string().optional().nullable(),
              company: z.string().optional().nullable(),
              avatarUrl: z.string().optional().nullable(),
              rating: z.number().int().min(1).max(5).optional(),
              featured: z.boolean().optional(),
              status: z.string().optional(),
            })
            .openapi('CreateTestimonialRequest'),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Testimonio creado',
      content: { 'application/json': { schema: TestimonialDetailSchema } },
    },
    400: {
      description: 'Validación fallida',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'get',
  path: '/api/admin/testimonials/{id}',
  operationId: 'getTestimonial',
  summary: 'Obtiene un testimonio por ID',
  tags: ['Testimonials'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'Testimonio',
      content: { 'application/json': { schema: TestimonialDetailSchema } },
    },
    404: { description: 'No encontrado', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/admin/testimonials/{id}',
  operationId: 'updateTestimonial',
  summary: 'Actualiza un testimonio',
  tags: ['Testimonials'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              name: z.string().optional(),
              text: z.string().optional(),
              excerpt: z.string().optional().nullable(),
              position: z.string().optional().nullable(),
              company: z.string().optional().nullable(),
              avatarUrl: z.string().optional().nullable(),
              rating: z.number().int().min(1).max(5).optional(),
              featured: z.boolean().optional(),
              status: z.string().optional(),
              isActive: z.boolean().optional(),
              sortOrder: z.number().int().optional(),
            })
            .openapi('UpdateTestimonialRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Testimonio actualizado',
      content: { 'application/json': { schema: TestimonialDetailSchema } },
    },
    404: { description: 'No encontrado', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/admin/testimonials/{id}',
  operationId: 'deleteTestimonial',
  summary: 'Elimina un testimonio (soft delete)',
  tags: ['Testimonials'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: {
      description: 'Eliminado',
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean() }).openapi('DeleteTestimonialResponse'),
        },
      },
    },
    404: { description: 'No encontrado', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

// ── Settings ─────────────────────────────────────────────────────────────────

const SettingsTypeSchema = z
  .enum(['home', 'about', 'contact', 'theme', 'site', 'testimonial', 'category', 'servicesPage'])
  .openapi({ description: 'Tipo de configuración' })

registry.registerPath({
  method: 'get',
  path: '/api/admin/settings/{type}',
  operationId: 'getSettings',
  summary: 'Obtiene la configuración de un tipo (singleton)',
  tags: ['Settings'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ type: SettingsTypeSchema }) },
  responses: {
    200: {
      description: 'Configuración del tipo solicitado',
      content: {
        'application/json': {
          schema: z.record(z.string(), z.unknown()).openapi('SettingsData'),
        },
      },
    },
    400: { description: 'Tipo inválido', content: { 'application/json': { schema: ErrorSchema } } },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/admin/settings/{type}',
  operationId: 'updateSettings',
  summary: 'Actualiza la configuración de un tipo',
  tags: ['Settings'],
  security: [{ BearerAuth: [] }],
  request: {
    params: z.object({ type: SettingsTypeSchema }),
    body: {
      content: {
        'application/json': {
          schema: z.record(z.string(), z.unknown()).openapi('UpdateSettingsRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Configuración actualizada',
      content: {
        'application/json': {
          schema: z.record(z.string(), z.unknown()).openapi('UpdateSettingsResponse'),
        },
      },
    },
    400: {
      description: 'Validación fallida',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

// ── Social Links ──────────────────────────────────────────────────────────────

const SocialLinkSchema = registry.register(
  'SocialLink',
  z
    .object({
      id: z.string(),
      platform: z.string().openapi({ example: 'instagram' }),
      url: z.string(),
      username: z.string().nullable(),
      icon: z.string().nullable(),
      isActive: z.boolean(),
      sortOrder: z.number(),
    })
    .openapi('SocialLink')
)

registry.registerPath({
  method: 'get',
  path: '/api/admin/settings/social',
  operationId: 'listSocialLinks',
  summary: 'Lista redes sociales configuradas',
  tags: ['Settings'],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'Lista de redes sociales',
      content: {
        'application/json': {
          schema: z.array(SocialLinkSchema).openapi('SocialLinkList'),
        },
      },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'post',
  path: '/api/admin/settings/social',
  operationId: 'upsertSocialLink',
  summary: 'Crea o actualiza una red social (upsert por platform)',
  tags: ['Settings'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              platform: z.string().min(1),
              url: z.string().url(),
              username: z.string().optional().nullable(),
              icon: z.string().optional().nullable(),
              isActive: z.boolean().optional(),
              sortOrder: z.number().int().optional(),
            })
            .openapi('UpsertSocialLinkRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Red social guardada',
      content: { 'application/json': { schema: SocialLinkSchema } },
    },
    400: {
      description: 'Validación fallida',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/admin/settings/social',
  operationId: 'deleteSocialLink',
  summary: 'Elimina una red social por id o platform',
  tags: ['Settings'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z
            .object({
              id: z.string().optional(),
              platform: z.string().optional(),
            })
            .openapi('DeleteSocialLinkRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Eliminada',
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean() }).openapi('DeleteSocialLinkResponse'),
        },
      },
    },
    404: { description: 'No encontrada', content: { 'application/json': { schema: ErrorSchema } } },
  },
})

// ── Upload ────────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post',
  path: '/api/admin/upload/sign',
  operationId: 'getUploadSignature',
  summary: 'Genera una firma Cloudinary para subida directa',
  tags: ['Upload'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ folder: z.string().optional() }).openapi('UploadSignRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Firma generada — usarla para POST directo a Cloudinary',
      content: {
        'application/json': {
          schema: z
            .object({
              apiKey: z.string(),
              cloudName: z.string(),
              timestamp: z.number(),
              signature: z.string(),
              folder: z.string(),
            })
            .openapi('UploadSignResponse'),
        },
      },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/admin/upload',
  operationId: 'deleteUploadedAsset',
  summary: 'Elimina un asset de Cloudinary por publicId',
  tags: ['Upload'],
  security: [{ BearerAuth: [] }],
  request: {
    body: {
      content: {
        'application/json': {
          schema: z.object({ publicId: z.string().min(1) }).openapi('DeleteUploadRequest'),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Asset eliminado',
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean() }).openapi('DeleteUploadResponse'),
        },
      },
    },
    400: {
      description: 'publicId requerido',
      content: { 'application/json': { schema: ErrorSchema } },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

// ── Analytics ─────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get',
  path: '/api/admin/analytics/overview',
  operationId: 'getAnalyticsOverview',
  summary: 'Resumen del dashboard (contadores operativos)',
  tags: ['Analytics'],
  security: [{ BearerAuth: [] }],
  responses: {
    200: {
      description: 'Contadores del dashboard',
      content: {
        'application/json': {
          schema: z
            .object({
              totalImages: z.number(),
              totalCategories: z.number(),
              totalServices: z.number(),
              totalTestimonials: z.number(),
              newContacts: z.number(),
              pendingBookings: z.number(),
              pendingTestimonials: z.number(),
              trashCount: z.number(),
              pageViews30d: z.number(),
              uniqueVisitors30d: z.number(),
              deviceUsage: z.record(z.string(), z.unknown()),
              topLocations: z.array(z.unknown()),
              topCategories: z.array(z.unknown()),
              analyticsDisabled: z.boolean(),
            })
            .openapi('AnalyticsOverview'),
        },
      },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

// ── Trash ─────────────────────────────────────────────────────────────────────

const TrashTypeSchema = z
  .enum(['category', 'service', 'testimonial', 'contact', 'booking'])
  .openapi({ description: 'Tipo de entidad en papelera' })

registry.registerPath({
  method: 'get',
  path: '/api/admin/trash',
  operationId: 'listTrash',
  summary: 'Lista items en la papelera agrupados por tipo',
  tags: ['Trash'],
  security: [{ BearerAuth: [] }],
  request: {
    query: z.object({ type: TrashTypeSchema.optional() }),
  },
  responses: {
    200: {
      description: 'Items en papelera agrupados por tipo',
      content: {
        'application/json': {
          schema: z
            .object({
              data: z.record(TrashTypeSchema, z.array(z.record(z.string(), z.unknown()))),
              total: z.number(),
            })
            .openapi('TrashList'),
        },
      },
    },
    401: {
      description: 'No autenticado',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'patch',
  path: '/api/admin/trash/{type}/{id}',
  operationId: 'restoreTrashItem',
  summary: 'Restaura un item de la papelera',
  tags: ['Trash'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ type: TrashTypeSchema, id: z.string() }) },
  responses: {
    200: {
      description: 'Item restaurado',
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean(), id: z.string() }).openapi('RestoreTrashResponse'),
        },
      },
    },
    404: {
      description: 'No encontrado en papelera',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})

registry.registerPath({
  method: 'delete',
  path: '/api/admin/trash/{type}/{id}',
  operationId: 'permanentDeleteTrashItem',
  summary: 'Elimina permanentemente un item de la papelera',
  tags: ['Trash'],
  security: [{ BearerAuth: [] }],
  request: { params: z.object({ type: TrashTypeSchema, id: z.string() }) },
  responses: {
    200: {
      description: 'Item eliminado permanentemente',
      content: {
        'application/json': {
          schema: z.object({ ok: z.boolean() }).openapi('PermanentDeleteTrashResponse'),
        },
      },
    },
    404: {
      description: 'No encontrado en papelera',
      content: { 'application/json': { schema: ErrorSchema } },
    },
  },
})
