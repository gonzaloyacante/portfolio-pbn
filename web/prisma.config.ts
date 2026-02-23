import 'dotenv/config'
import path from 'node:path'
import { defineConfig } from 'prisma/config'

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
