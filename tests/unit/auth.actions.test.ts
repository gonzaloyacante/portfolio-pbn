// import { describe, it, expect, vi, beforeEach } from 'vitest'
// import { requestPasswordReset, resetPassword } from '@/actions/auth.actions'
// import { prisma } from '@/lib/db'
// import { Resend } from 'resend'
// import bcrypt from 'bcryptjs'

// // Mock de dependencias
// vi.mock('@/lib/db', () => ({
//     prisma: {
//         user: {
//             findUnique: vi.fn(),
//             update: vi.fn(),
//         },
//         passwordResetToken: {
//             create: vi.fn(),
//             findUnique: vi.fn(),
//             delete: vi.fn(),
//         },
//     },
// }))

// vi.mock('resend', () => ({
//     Resend: vi.fn().mockImplementation(() => ({
//         emails: {
//             send: vi.fn().mockResolvedValue({ id: 'email_id' }),
//         },
//     })),
// }))

// vi.mock('bcryptjs', () => ({
//     default: {
//         hash: vi.fn().mockResolvedValue('hashed_password'),
//     },
// }))

// describe('Auth Actions', () => {
//     beforeEach(() => {
//         vi.clearAllMocks()
//         process.env.NEXT_PUBLIC_BASE_URL = 'http://localhost:3000'
//     })

//     describe('requestPasswordReset', () => {
//         it('should send an email if user exists', async () => {
//             // Setup
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: '1', email: 'test@example.com' } as unknown as any)

//             const res = await requestPasswordReset('test@example.com')

//             expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@example.com' } })
//             expect(prisma.passwordResetToken.create).toHaveBeenCalled()
//             expect(Resend).toHaveBeenCalled()
//             expect(res.message).toContain('Si tu email está registrado')
//         })

//         it('should return ambiguous message if user does not exist', async () => {
//             vi.mocked(prisma.user.findUnique).mockResolvedValue(null)

//             const res = await requestPasswordReset('nonexistent@example.com')

//             expect(prisma.passwordResetToken.create).not.toHaveBeenCalled()
//             expect(res.message).toContain('enlace de recuperación')
//         })
//     })

//     describe('resetPassword', () => {
//         it('should reset password with valid token', async () => {
//             const validToken = {
//                 id: 'token_id',
//                 email: 'test@example.com',
//                 token: 'valid_token',
//                 expiresAt: new Date(Date.now() + 10000),
//             }
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//             vi.mocked(prisma.passwordResetToken.findUnique).mockResolvedValue(validToken as unknown as any)

//             const res = await resetPassword('valid_token', 'newPassword123')

//             expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10)
//             expect(prisma.user.update).toHaveBeenCalledWith({
//                 where: { email: 'test@example.com' },
//                 data: { password: 'hashed_password' },
//             })
//             expect(prisma.passwordResetToken.delete).toHaveBeenCalledWith({ where: { id: 'token_id' } })
//             expect(res.message).toContain('Contraseña actualizada')
//         })
//     })
// })
