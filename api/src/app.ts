import express, { type RequestHandler } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import pinoHttp from 'pino-http'
import { randomUUID } from 'crypto'
import authRoutes from './routes/auth'
import projectRoutes from './routes/projects'
import categoryRoutes from './routes/categories'
import presentationRoutes from './routes/presentation'
import galleryRoutes from './routes/gallery'
import settingsRoutes from './routes/settings'
import contactRoutes from './routes/contact'
import accountRoutes from './routes/account'
import usersRoutes from './routes/users'
import devRoutes from './routes/dev'

dotenv.config()

const app = express()

// Seguridad básica
app.disable('x-powered-by')
// Evitar 304 por ETag en respuestas JSON; siempre enviar cuerpo fresco
app.set('etag', false)
app.set('trust proxy', 1)
app.use(
  helmet({
    contentSecurityPolicy: false, // Ajusta si sirves vistas; en API no suele ser necesario
    crossOriginOpenerPolicy: { policy: 'same-origin' },
    crossOriginResourcePolicy: { policy: 'same-origin' },
  }),
)
app.use(compression() as unknown as RequestHandler)

// Logger estructurado con request id
const isProd = process.env.NODE_ENV === 'production'
const logger = pinoHttp({
  genReqId: (req: any) => (req.headers['x-request-id'] as string) || randomUUID(),
  // En dev: no loguear cada request para no ensuciar la terminal
  // En prod: ignorar OPTIONS (preflight CORS) para reducir ruido
  autoLogging: isProd ? { ignore: (req) => req.method === 'OPTIONS' } : false,
})
app.use(logger)

// Rate limiting básico (ajusta paths sensibles si lo prefieres)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 1000, // 1000 req por ventana
  standardHeaders: true,
  legacyHeaders: false,
})
app.use(limiter)

// CORS con whitelist desde variables
// Soporta CORS_ORIGINS=dom1,dom2;dom3 (coma o punto y coma)
const ORIGINS = (process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(/[;,]/)
  .map((s) => s.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true) // allow non-browser clients
      const allowed = ORIGINS.some((o) => origin === o)
      return allowed ? callback(null, true) : callback(new Error(`CORS: origin ${origin} no permitido`))
    },
    credentials: true,
  }),
)
app.use(express.json({ limit: '5mb' }))
app.use(cookieParser())

// Añadir x-request-id a las respuestas
app.use((req, res, next) => {
  // @ts-ignore - pino-http agrega id
  const id = req.id as string | undefined
  if (id) res.setHeader('x-request-id', id)
  next()
})

// Desactivar cache de respuestas API (especialmente útil en dev para evitar 304 Not Modified)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.setHeader('Cache-Control', 'no-store')
  }
  next()
})

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'portfolio-pbn-api' })
})

app.use('/api/auth', authRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/presentation', presentationRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/contact', contactRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/users', usersRoutes)
if (process.env.NODE_ENV !== 'production') {
  app.use('/api/dev', devRoutes)
}

// Error handler
app.use((err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // @ts-ignore pino-http
  req.log?.error({ err }, 'Unhandled error')
  const status = err.status || 500
  res.status(status).json({ error: err.message || 'Internal Server Error' })
})

// Server start moved to server.ts for better separation

export default app
