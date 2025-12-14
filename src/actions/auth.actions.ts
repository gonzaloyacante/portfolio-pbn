'use server'

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function requestPasswordReset(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { message: 'Si tu email está registrado, recibirás un enlace de recuperación.' }
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour

    await prisma.passwordResetToken.create({
      data: { email, token, expiresAt },
    })

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${token}`

    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'noreply@portfolio-pbn.com',
      to: email,
      subject: 'Recuperación de Contraseña',
      html: `<p>Haz clic <a href="${resetLink}">aquí</a> para resetear tu contraseña.</p>`,
    })

    return { message: 'Si tu email está registrado, recibirás un enlace de recuperación.' }
  } catch (error) {
    console.error(error)
    return { message: 'Error al solicitar el reseteo de contraseña.' }
  }
}

export async function resetPassword(token: string, password: string) {
  try {
    const storedToken = await prisma.passwordResetToken.findUnique({ where: { token } })

    if (!storedToken || new Date() > storedToken.expiresAt) {
      return { message: 'Token inválido o expirado.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email: storedToken.email },
      data: { password: hashedPassword },
    })

    await prisma.passwordResetToken.delete({ where: { id: storedToken.id } })

    return { message: 'Contraseña actualizada correctamente.' }
  } catch (error) {
    console.error(error)
    return { message: 'Error al resetear la contraseña.' }
  }
}

interface SignInState {
  success?: boolean
  message?: string
}

export async function signInAction(prevState: SignInState | null, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, message: 'Email y contraseña son requeridos' }
  }

  try {
    // Note: NextAuth signIn needs to be called from client-side
    // This is a placeholder - the actual login is handled by the login page client component
    return { success: true, email, password }
  } catch (error) {
    console.error('Error en signInAction:', error)
    return { success: false, message: 'Error al iniciar sesión' }
  }
}

export async function signOutAction() {
  'use server'
  redirect('/api/auth/signout')
}

export async function getSession() {
  return await getServerSession(authOptions)
}
