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
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),

  // Analytics (Optional)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),

  // Vercel (Auto-populated)
  NEXT_PUBLIC_VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA: z.string().optional(),

  // App Config
  NEXT_PUBLIC_BASE_URL: z.string().url().optional(),

  // Node Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
})

// Validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)

      console.error('❌ Invalid environment variables:\n' + issues.join('\n'))
      console.error('\n💡 Check your .env file and make sure all required variables are set.\n')

      throw new Error('Environment validation failed')
    }

    throw error
  }
}

// Export validated environment variables
export const env = validateEnv()

// Export types for TypeScript
export type Env = z.infer<typeof envSchema>
