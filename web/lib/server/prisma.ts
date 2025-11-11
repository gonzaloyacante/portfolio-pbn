import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Log queries as formatted JSON in development
const log = process.env.NODE_ENV === 'development'
  ? [
      {
        emit: 'event' as const,
        level: 'query' as const,
      },
      { emit: 'stdout' as const, level: 'error' as const },
      { emit: 'stdout' as const, level: 'warn' as const },
    ]
  : [{ emit: 'stdout' as const, level: 'error' as const }]

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log,
    // Retry on connection errors
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

// Format query logs as JSON in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query' as any, (e: any) => {
    console.log('📊 Prisma Query:', JSON.stringify({
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
      timestamp: new Date().toISOString()
    }, null, 2))
  })
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

export default prisma
