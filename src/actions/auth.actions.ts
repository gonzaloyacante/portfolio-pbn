'use server'

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

// Schemas
const RequestResetSchema = z.object({
  email: z.string().email('Email inválido'),
})

const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Token requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export async function requestPasswordReset(email: string) {
  const result = RequestResetSchema.safeParse({ email })
  if (!result.success) {
    return { success: false, message: result.error.issues[0].message }
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return {
        success: true,
        message: 'Si tu email está registrado, recibirás un enlace de recuperación.',
      }
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

    return {
      success: true,
      message: 'Si tu email está registrado, recibirás un enlace de recuperación.',
    }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error al solicitar el reseteo de contraseña.' }
  }
}

export async function resetPassword(token: string, password: string) {
  const result = ResetPasswordSchema.safeParse({ token, password })
  if (!result.success) {
    return { success: false, message: result.error.issues[0].message }
  }

  try {
    const storedToken = await prisma.passwordResetToken.findUnique({ where: { token } })

    if (!storedToken || new Date() > storedToken.expiresAt) {
      return { success: false, message: 'Token inválido o expirado.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.update({
      where: { email: storedToken.email },
      data: { password: hashedPassword },
    })

    await prisma.passwordResetToken.delete({ where: { id: storedToken.id } })

    return { success: true, message: 'Contraseña actualizada correctamente.' }
  } catch (error) {
    console.error(error)
    return { success: false, message: 'Error al resetear la contraseña.' }
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
    return { success: true, email }
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
