import { Router, Request, Response, NextFunction } from 'express'
import { prisma } from '../prisma'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { setSessionCookie, requireAuth, AuthTokenPayload } from '../middleware/auth'
import nodemailer from 'nodemailer'
import rateLimit from 'express-rate-limit'

const router = Router()

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
})

// Obtener información del usuario autenticado
router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = (req as any).user as AuthTokenPayload
    const userData = await prisma.user.findUnique({ 
      where: { id: user.sub }, 
      select: { id: true, email: true, role: true, name: true } 
    })
    if (!userData) {
      res.status(404).json({ error: 'User not found' })
      return
    }
    res.json(userData)
  } catch (e) {
    next(e)
  }
})

const resetSchema = z.object({ token: z.string().min(1), newPassword: z.string().min(6) })

router.post('/reset-password', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { token, newPassword } = resetSchema.parse(req.body)
    const secret = process.env.JWT_SECRET || 'dev-secret'
    const decoded = jwt.verify(token, secret)
    if (!decoded || typeof decoded === 'string') {
      res.status(400).json({ error: 'Invalid token' })
      return
    }
    const payload = decoded as JwtPayload & { action?: string; sub?: string | number }
    if (payload.action !== 'reset' || !payload.sub) {
      res.status(400).json({ error: 'Invalid token' })
      return
    }
    const userId = typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : (payload.sub as number)
    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({ where: { id: userId }, data: { password: hashed } })
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})

router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (process.env.ALLOW_REGISTRATION !== 'true') {
      res.status(403).json({ error: 'Registration disabled' })
      return
    }
    const { email, password, name } = registerSchema.parse(req.body)
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      res.status(409).json({ error: 'Email already registered' })
      return
    }

    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({ data: { email, password: hash, name, role: 'ADMIN' } })
    res.status(201).json({ id: user.id, email: user.email })
  } catch (e) {
    next(e)
  }
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

// Limitar intentos de login por IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 intentos cada 15 minutos por IP
  standardHeaders: true,
  legacyHeaders: false,
})

router.post('/login', loginLimiter, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = loginSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      res.status(401).json({ code: 'EMAIL_NOT_FOUND', error: 'Email no registrado' })
      return
    }

    const ok = await bcrypt.compare(password, user.password)
    if (!ok) {
      res.status(401).json({ code: 'INVALID_PASSWORD', error: 'Contraseña incorrecta' })
      return
    }

    const secret = process.env.JWT_SECRET || 'dev-secret'
    const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, secret, {
      expiresIn: '7d',
    })
    setSessionCookie(res, token)
    res.json({ id: user.id, email: user.email, role: user.role })
  } catch (e) {
    next(e)
  }
})

router.post('/logout', async (_req: Request, res: Response): Promise<void> => {
  res.clearCookie('session', { path: '/' })
  res.json({ ok: true })
})

export default router

// Forgot password (optional SMTP)
const forgotSchema = z.object({ email: z.string().email() })

router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = forgotSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email } })
    // Always respond ok to avoid user enumeration
    if (!user) {
      res.json({ ok: true })
      return
    }

    const secret = process.env.JWT_SECRET || 'dev-secret'
    const token = jwt.sign({ sub: user.id, email: user.email, action: 'reset' }, secret, {
      expiresIn: '1h',
    })
    const siteUrl = process.env.SITE_URL || 'http://localhost:3000'
    const resetLink = `${siteUrl}/admin/auth/reset-password?token=${encodeURIComponent(token)}`

    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SMTP_FROM } = process.env
    if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS && SMTP_FROM) {
      const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        secure: Number(SMTP_PORT) === 465,
        auth: { user: SMTP_USER, pass: SMTP_PASS },
      })
      await transporter.sendMail({
        from: SMTP_FROM,
        to: email,
        subject: 'Restablecer contraseña',
        text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`,
        html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
      })
    } else {
      console.warn('SMTP not configured. Reset link:', resetLink)
    }
    res.json({ ok: true })
  } catch (e) {
    next(e)
  }
})
