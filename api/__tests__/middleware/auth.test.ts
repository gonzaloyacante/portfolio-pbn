import request from 'supertest'
import jwt from 'jsonwebtoken'
import app from '../../src/app'
import { requireAuth, requireAdmin, setSessionCookie } from '../../src/middleware/auth'

describe('Auth Middleware', () => {
  const validToken = jwt.sign(
    { sub: 1, email: 'admin@test.com', role: 'ADMIN' },
    process.env.JWT_SECRET || 'test-secret'
  )

  const editorToken = jwt.sign(
    { sub: 2, email: 'editor@test.com', role: 'EDITOR' },
    process.env.JWT_SECRET || 'test-secret'
  )

  describe('requireAuth', () => {
    it('should allow access with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/session')
        .set('Cookie', `session=${validToken}`)

      expect(response.status).not.toBe(401)
    })

    it('should deny access without token', async () => {
      const response = await request(app)
        .get('/api/auth/session')

      expect(response.status).toBe(401)
      expect(response.body.error).toBe('Unauthorized')
    })

    it('should deny access with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/session')
        .set('Cookie', 'session=invalid-token')

      expect(response.status).toBe(401)
      expect(response.body.error).toBe('Invalid token')
    })
  })

  describe('requireAdmin', () => {
    it('should allow access for admin users', async () => {
      // This would need an actual admin endpoint to test properly
      // For now, we'll test the middleware logic directly
      const mockReq = {
        cookies: { session: validToken }
      } as any

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any

      const mockNext = jest.fn()

      requireAdmin(mockReq, mockRes, mockNext)
      expect(mockNext).toHaveBeenCalled()
    })

    it('should deny access for non-admin users', async () => {
      const mockReq = {
        cookies: { session: editorToken }
      } as any

      const mockRes = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as any

      const mockNext = jest.fn()

      requireAdmin(mockReq, mockRes, mockNext)
      expect(mockRes.status).toHaveBeenCalledWith(403)
      expect(mockRes.json).toHaveBeenCalledWith({ error: 'Forbidden' })
    })
  })

  describe('setSessionCookie', () => {
    it('should set secure cookie in production', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      const mockRes = {
        cookie: jest.fn()
      } as any

      setSessionCookie(mockRes, 'test-token')

      expect(mockRes.cookie).toHaveBeenCalledWith('session', 'test-token', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })

      process.env.NODE_ENV = originalEnv
    })

    it('should set non-secure cookie in development', () => {
      const originalEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'development'

      const mockRes = {
        cookie: jest.fn()
      } as any

      setSessionCookie(mockRes, 'test-token')

      expect(mockRes.cookie).toHaveBeenCalledWith('session', 'test-token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      })

      process.env.NODE_ENV = originalEnv
    })
  })
})
