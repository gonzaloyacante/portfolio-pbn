import { PrismaClient } from '@/generated/prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString =
  process.env.DATABASE_URL ??
  (process.env.NODE_ENV === 'test'
    ? 'postgresql://test:test@localhost:5432/portfolio_pbn_test'
    : undefined)

if (!connectionString) {
  throw new Error('DATABASE_URL is required to initialize Prisma')
}

/**
 * Pool configuration tuned for Neon serverless (free tier).
 *
 * DATABASE_URL should use Neon’s **pooled** connection string (host ends with
 * `-pooler.<region>.aws.neon.tech`, or pick “Connection pooling” in the Neon
 * console). Pooled endpoint + this small Node pool reduces open handles and
 * pairs better with Vercel/serverless cold starts than the direct host alone.
 *
 * - max: 3  → never open more than 3 connections at once.
 *            Neon free tier allows up to 100 but each open connection
 *            keeps the compute endpoint active (= billing).
 * - idleTimeoutMillis: 10_000 → release idle connections after 10 s so
 *            Neon can suspend the compute and stop billing.
 * - connectionTimeoutMillis: 10_000 → fail fast instead of hanging.
 *
 * DO NOT raise `max` without a paid plan — it will exhaust compute hours.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
  prismaPool: Pool | undefined
  prismaAdapter: PrismaPg | undefined
}

const pool =
  globalForPrisma.prismaPool ??
  new Pool({
    connectionString,
    ssl: { rejectUnauthorized: true },
    max: 3,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 10_000,
  })
const adapter = globalForPrisma.prismaAdapter ?? new PrismaPg(pool)

const prismaClientSingleton = () => {
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
  globalForPrisma.prismaPool = pool
  globalForPrisma.prismaAdapter = adapter
}
