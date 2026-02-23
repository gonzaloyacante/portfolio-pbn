import path from 'node:path'
import { defineConfig } from 'prisma/config'

// Cargar dotenv solo si está disponible. En entornos de producción
// `dotenv` puede estar en devDependencies y no instalarse; evitar fallo.
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
try {
  // Intentamos cargar la configuración de dotenv si existe
  require('dotenv/config')
} catch (err) {
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
    // process.env directo (sin env()) para que funcione en CI sin DATABASE_URL
    url: process.env.DATABASE_URL ?? '',
  },
})
