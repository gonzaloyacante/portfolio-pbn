'use server'

import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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
