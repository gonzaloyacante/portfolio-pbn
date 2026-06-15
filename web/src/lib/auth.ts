import { logger } from '@/lib/logger'
import { NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { emailService } from '@/lib/email-service'
import { headers } from 'next/headers'
import { verifyCredentials } from '@/lib/verify-credentials'
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

        const result = await verifyCredentials(credentials.email, credentials.password, ip)

        if (!result.ok) {
          if (result.reason === 'rate_limited') {
            throw new Error(
              `Demasiados intentos fallidos. Inténtalo de nuevo en ${result.lockoutMinutes} minutos.`
            )
          }
          if (result.reason === 'locked') {
            throw new Error('Cuenta bloqueada temporalmente. Inténtalo más tarde.')
          }
          return null
        }

        const { user } = result
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
