/// <reference types="node" />

/**
 * Verifica que migraciones SQL cubren columnas/tablas que antes fallaban en prod
 * cuando `_prisma_migrations` iba atrasado (sin conectar a ninguna base de datos).
 *
 * Usage (desde web/): pnpm exec tsx prisma/audit-schema-migrations.ts
 */

import { readdirSync, readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const migrationsDir = path.resolve(__dirname, 'migrations')

type Requirement = {
  id: string
  test: (combinedSql: string) => boolean
}

type OrderedRequirement = {
  id: string
  test: (files: MigrationFile[]) => boolean
}

type MigrationFile = {
  name: string
  sql: string
}

const REQUIREMENTS: Requirement[] = [
  {
    id: 'about_settings.illustrationMaxPx',
    test: (sql) => /ALTER TABLE\s+"about_settings"[^\n]*"illustrationMaxPx"/i.test(sql),
  },
  {
    id: 'home_settings.showHeroTitle1',
    test: (sql) => /ALTER TABLE\s+"home_settings"[^\n]*"showHeroTitle1"/i.test(sql),
  },
  {
    id: 'services_page_settings (CREATE TABLE)',
    test: (sql) => /CREATE TABLE\s+"services_page_settings"/i.test(sql),
  },
  {
    id: 'bookings.serviceId ON DELETE RESTRICT',
    test: (sql) => /ADD CONSTRAINT\s+"bookings_serviceId_fkey"[\s\S]*ON DELETE RESTRICT/i.test(sql),
  },
  {
    id: 'testimonial_settings.sliderAutoAdvanceMs default 10000',
    test: (sql) =>
      /ALTER TABLE\s+"testimonial_settings"[\s\S]*"sliderAutoAdvanceMs"\s+SET DEFAULT 10000/i.test(
        sql
      ),
  },
]

const ORDERED_REQUIREMENTS: OrderedRequirement[] = [
  {
    id: 'home_settings.heroImmersiveEnabled exists before default migration',
    test: (files) => {
      const firstAddIndex = files.findIndex(
        ({ sql }) =>
          /ALTER TABLE\s+"home_settings"\s+ADD COLUMN IF NOT EXISTS\s+"heroImmersiveEnabled"/i.test(
            sql
          ) || /CREATE TABLE\s+"home_settings"[\s\S]*"heroImmersiveEnabled"/i.test(sql)
      )
      const firstDefaultIndex = files.findIndex(({ sql }) =>
        /ALTER TABLE\s+"home_settings"\s+ALTER COLUMN\s+"heroImmersiveEnabled"\s+SET DEFAULT/i.test(
          sql
        )
      )

      return firstAddIndex >= 0 && firstDefaultIndex >= 0 && firstAddIndex < firstDefaultIndex
    },
  },
]

function loadMigrationFiles(): MigrationFile[] {
  let entries: string[] = []
  try {
    entries = readdirSync(migrationsDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('.'))
      .map((d) => d.name)
      .sort()
  } catch {
    console.error(`audit-schema-migrations: no existe ${migrationsDir}`)
    process.exit(1)
  }

  const files: MigrationFile[] = []
  for (const name of entries) {
    const sqlPath = path.join(migrationsDir, name, 'migration.sql')
    try {
      files.push({ name, sql: readFileSync(sqlPath, 'utf8') })
    } catch {
      // Carpeta sin migration.sql (ej. borrador): ignorar
    }
  }
  return files
}

function main(): void {
  const files = loadMigrationFiles()
  const sql = files.map((file) => file.sql).join('\n')
  const missing = [
    ...REQUIREMENTS.filter((r) => !r.test(sql)).map((r) => r.id),
    ...ORDERED_REQUIREMENTS.filter((r) => !r.test(files)).map((r) => r.id),
  ]

  if (missing.length > 0) {
    console.error(
      'audit-schema-migrations: falta cobertura en prisma/migrations para:',
      missing.join(', ')
    )
    process.exit(1)
  }

  console.log(
    `audit-schema-migrations: OK (${REQUIREMENTS.length + ORDERED_REQUIREMENTS.length} checks de prod-gap en migraciones)`
  )
}

main()
