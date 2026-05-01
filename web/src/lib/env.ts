import { z } from 'zod'

/**
 * Environment Variables Validation
 * Validates all required environment variables at runtime
 * Throws error if any required variable is missing or invalid
 */

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),

  // NextAuth
  NEXTAUTH_URL: z.string().url('NEXTAUTH_URL must be a valid URL').optional(),
  NEXTAUTH_SECRET: z
    .string()
    .min(32, 'NEXTAUTH_SECRET must be at least 32 characters')
    .describe('Generate with: openssl rand -base64 32'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

  // Email (Resend)
  RESEND_API_KEY: z.string().startsWith('re_', 'RESEND_API_KEY must start with re_'),
  RESEND_FROM_EMAIL: z.string().email('RESEND_FROM_EMAIL must be a valid email'),

  // Sentry (Optional in dev)
  SENTRY_DSN: z.string().url('SENTRY_DSN must be a valid URL').optional(),

  // Analytics (Optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),

  // Vercel (Auto-populated)
  NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: z.string().optional(),

  // App Config
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Flutter Admin API — JWT custom (independiente de NextAuth)
  ADMIN_JWT_SECRET: z
    .string()
    .min(32, 'ADMIN_JWT_SECRET must be at least 32 characters')
    .describe('Generate with: openssl rand -base64 32'),

  // Flutter App Distribution — token para el script distribute-*.sh
  DEPLOY_SECRET_TOKEN: z
    .string()
    .min(32, 'DEPLOY_SECRET_TOKEN must be at least 32 characters')
    .optional()
    .describe('Generate with: openssl rand -hex 32'),

  // Firebase Cloud Messaging (push notifications)
  FIREBASE_PROJECT_ID: z.string().min(1).optional(),
  FIREBASE_CLIENT_EMAIL: z.string().email('FIREBASE_CLIENT_EMAIL must be a valid email').optional(),
  FIREBASE_PRIVATE_KEY: z.string().min(1).optional(),

  // Email fallbacks (opcionales — se leen de DB en tiempo de ejecución)
  ADMIN_EMAIL: z.string().email('ADMIN_EMAIL must be a valid email').optional(),
  EMAIL_FROM: z.string().email('EMAIL_FROM must be a valid email').optional(),

  // Google Fonts API (opcional — usada por /api/fonts/google)
  GOOGLE_FONTS_API_KEY: z.string().min(1).optional(),
})

// Validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)

      // Use process.stderr directly — logger is not available yet at this point
      // (env.ts is imported before any logger initialization)
      process.stderr.write('❌ Invalid environment variables:\n' + issues.join('\n') + '\n')
      process.stderr.write('\n💡 Check your .env file and make sure all required variables are set.\n\n')

      throw new Error('Environment validation failed')
    }

    throw error
  }
}

// Export validated environment variables
export const env = validateEnv()

// Export types for TypeScript
export type Env = z.infer<typeof envSchema>
