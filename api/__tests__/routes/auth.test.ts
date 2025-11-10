import request from 'supertest'
import { app } from '../../src/app'
import { prisma } from '../../src/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

describe('Auth Routes', () => {
  beforeEach(async () => {
    // Clean up test data
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user when registration is enabled', async () => {
      process.env.ALLOW_REGISTRATION = 'true'
      
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body).toMatchObject({
        email: userData.email,
        id: expect.any(Number)
      })

      const user = await prisma.user.findUnique({ where: { email: userData.email } })
      expect(user).toBeTruthy()
      expect(user?.role).toBe('ADMIN')
    })

    it('should reject registration when disabled', async () => {
      process.env.ALLOW_REGISTRATION = 'false'
      
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(403)

      expect(response.body.error).toBe('Registration disabled')
    })

    it('should reject duplicate email registration', async () => {
      process.env.ALLOW_REGISTRATION = 'true'
      
      const userData = {
        email: 'test@example.com',
        password: 'password123'
      }

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409)

      expect(response.body.error).toBe('Email already registered')
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          name: 'Test User',
          role: 'ADMIN'
        }
      })
    })

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200)

      expect(response.body).toMatchObject({
        email: 'test@example.com',
        role: 'ADMIN',
        id: expect.any(Number)
      })

      // Check if session cookie is set
      expect(response.headers['set-cookie']).toBeDefined()
    })

    it('should reject invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401)

      expect(response.body.code).toBe('EMAIL_NOT_FOUND')
    })

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })
        .expect(401)

      expect(response.body.code).toBe('INVALID_PASSWORD')
    })
  })

  describe('GET /api/auth/me', () => {
    let authToken: string
    let userId: number

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          name: 'Test User',
          role: 'ADMIN'
        }
      })
      userId = user.id

      const secret = process.env.JWT_SECRET || 'dev-secret'
      authToken = jwt.sign(
        { sub: user.id, email: user.email, role: user.role },
        secret,
        { expiresIn: '7d' }
      )
    })

    it('should return user info with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', `session=${authToken}`)
        .expect(200)

      expect(response.body).toMatchObject({
        id: userId,
        email: 'test@example.com',
        role: 'ADMIN',
        name: 'Test User'
      })
    })

    it('should reject request without token', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401)
    })

    it('should reject request with invalid token', async () => {
      await request(app)
        .get('/api/auth/me')
        .set('Cookie', 'session=invalid-token')
        .expect(401)
    })
  })

  describe('POST /api/auth/logout', () => {
    it('should clear session cookie', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(200)

      expect(response.body.ok).toBe(true)
      
      // Check if cookie is cleared
      const setCookieHeader = response.headers['set-cookie']
      expect(setCookieHeader).toBeDefined()
      expect(setCookieHeader[0]).toContain('session=;')
    })
  })

  describe('POST /api/auth/forgot-password', () => {
    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          name: 'Test User',
          role: 'ADMIN'
        }
      })
    })

    it('should always return success to prevent user enumeration', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'nonexistent@example.com' })
        .expect(200)

      expect(response.body.ok).toBe(true)
    })

    it('should return success for existing user', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' })
        .expect(200)

      expect(response.body.ok).toBe(true)
    })
  })

  describe('POST /api/auth/reset-password', () => {
    let resetToken: string
    let userId: number

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password123', 10)
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          password: hashedPassword,
          name: 'Test User',
          role: 'ADMIN'
        }
      })
      userId = user.id

      const secret = process.env.JWT_SECRET || 'dev-secret'
      resetToken = jwt.sign(
        { sub: user.id, email: user.email, action: 'reset' },
        secret,
        { expiresIn: '1h' }
      )
    })

    it('should reset password with valid token', async () => {
      const newPassword = 'newpassword123'
      
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: resetToken,
          newPassword
        })
        .expect(200)

      expect(response.body.ok).toBe(true)

      // Verify password was changed
      const user = await prisma.user.findUnique({ where: { id: userId } })
      const isValidPassword = await bcrypt.compare(newPassword, user!.password)
      expect(isValidPassword).toBe(true)
    })

    it('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-token',
          newPassword: 'newpassword123'
        })
        .expect(400)

      expect(response.body.error).toBe('Invalid token')
    })

    it('should reject token without reset action', async () => {
      const secret = process.env.JWT_SECRET || 'dev-secret'
      const invalidToken = jwt.sign(
        { sub: userId, email: 'test@example.com' }, // Missing action: 'reset'
        secret,
        { expiresIn: '1h' }
      )

      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: invalidToken,
          newPassword: 'newpassword123'
        })
        .expect(400)

      expect(response.body.error).toBe('Invalid token')
    })
  })
})
