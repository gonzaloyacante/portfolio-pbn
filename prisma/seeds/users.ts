const email = process.env.ADMIN_EMAIL
const passwordHash = process.env.ADMIN_PASSWORD_HASH

if (!email || !passwordHash) {
  throw new Error(
    '❌ ADMIN_EMAIL or ADMIN_PASSWORD_HASH missing in .env. Please configure them to run seeds.'
  )
}

export const adminUser = {
  email,
  name: 'Paola Bolívar Nievas',
  password: passwordHash,
  role: 'ADMIN',
}
