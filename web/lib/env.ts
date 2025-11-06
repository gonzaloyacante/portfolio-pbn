import { z } from 'zod'

// Variables públicas (NEXT_PUBLIC_*) disponibles en cliente
const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_API_URL: z.string().url().optional(),
  // Firebase variables removidas - ya no se usan tras migración a API propia
})

export const ENV = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
})

export type PublicEnv = z.infer<typeof publicSchema>
