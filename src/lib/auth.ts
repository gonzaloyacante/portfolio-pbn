import { NextAuthOptions, getServerSession } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { emailService } from '@/lib/email-service'
import { headers } from 'next/headers'

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

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isValid = await bcrypt.compare(credentials.password, user.password)

        if (!isValid) return null

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
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
        ;(session.user as unknown as { role: string; id: string }).role = token.role
        ;(session.user as unknown as { role: string; id: string }).id = token.id
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
        console.error('Error sending login alert:', error)
      }
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.JWT_SECRET,
}

/**
 * Helper para obtener la sesión del usuario en Server Components
 * Wrapper de getServerSession que pasa authOptions automáticamente
 */
export const auth = () => getServerSession(authOptions)
