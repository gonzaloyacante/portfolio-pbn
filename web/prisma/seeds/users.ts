// ============================================
// ADMIN USER SEED DATA
// IMPORTANT: Dev and Prod MUST use different emails/passwords
// Set in .env and .env.production respectively
// ============================================

const email = process.env.ADMIN_EMAIL
const password = process.env.ADMIN_PASSWORD

if (!email || !password) {
  throw new Error(
    '❌ ADMIN_EMAIL or ADMIN_PASSWORD missing in .env. Please configure them to run seeds.'
  )
}

export const adminUser = {
  email,
  name: 'Paola Bolívar Nievas',
  password, // Will be hashed in seed.ts with bcrypt
  role: 'ADMIN',
}
