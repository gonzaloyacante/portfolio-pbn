import { logger } from '@/lib/logger'
import { NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { emailService } from '@/lib/email-service'
import { headers } from 'next/headers'
import {
  checkAuthRateLimit,
  recordFailedLoginAttempt,
  clearLoginAttempts,
} from '@/lib/auth-rate-limit'
import { ROUTES } from '@/config/routes'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        // Obtener IP del request para rate limiting
        const headersList = await headers()
        const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown'

        // Verificar rate limit ANTES de tocar la BD
        const rateCheck = await checkAuthRateLimit(credentials.email, ip)
        if (!rateCheck.allowed) {
          throw new Error(
            `Demasiados intentos fallidos. Inténtalo de nuevo en ${rateCheck.lockoutMinutes} minutos.`
          )
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) {
          await recordFailedLoginAttempt(credentials.email, ip)
          return null
        }

        // Verificar estado de la cuenta
        if (!user.isActive || user.deletedAt !== null) {
          return null
        }

        // Verificar bloqueo temporal por intentos fallidos
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error('Cuenta bloqueada temporalmente. Inténtalo más tarde.')
        }

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) {
          await recordFailedLoginAttempt(credentials.email, ip)
          return null
        }

        // Login exitoso: limpiar intentos fallidos
        await clearLoginAttempts(credentials.email, ip)

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.email) return

      try {
        const headersList = await headers()
        const ip =
          headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'Unknown IP'
        const userAgent = headersList.get('user-agent') || 'Unknown Device'

        await emailService.sendLoginAlert({
          email: user.email,
          ipAddress: ip,
          userAgent: userAgent,
        })
      } catch (error) {
        logger.error('Error sending login alert:', { error })
      }
    },
  },
  pages: {
    signIn: ROUTES.auth.login,
  },
  secret: process.env.NEXTAUTH_SECRET,
}

/**
 * Helper para obtener la sesión del usuario en Server Components
 * Wrapper de getServerSession que pasa authOptions automáticamente
 */
export const auth = () => getServerSession(authOptions)
