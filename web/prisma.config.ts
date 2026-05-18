import path from 'node:path'
import { defineConfig } from 'prisma/config'

// Cargar dotenv solo si está disponible. En entornos de producción
// `dotenv` puede estar en devDependencies y no instalarse; evitar fallo.
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
try {
  // Intentamos cargar la configuración de dotenv si existe
  require('dotenv/config')
} catch {
  // noop: en CI/producción puede no existir dotenv y no debe romper el build
}

export default defineConfig({
  // Multi-file schema: apunta a la carpeta prisma/schema
  schema: path.join('prisma', 'schema'),
  migrations: {
    path: path.join('prisma', 'migrations'),
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    // Prisma CLI debe usar conexión directa para migraciones; runtime usa DATABASE_URL pooled.
    // process.env directo (sin env()) para que funcione en CI sin DIRECT_URL/DATABASE_URL.
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? '',
  },
})
