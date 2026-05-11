/// <reference types="node" />

/**
 * Verifica que migraciones SQL cubren columnas/tablas que antes fallaban en prod
 * cuando `_prisma_migrations` iba atrasado (sin conectar a ninguna base de datos).
 *
 * Usage (desde web/): npx tsx prisma/audit-schema-migrations.ts
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
]

function loadCombinedMigrationSql(): string {
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

  const parts: string[] = []
  for (const name of entries) {
    const sqlPath = path.join(migrationsDir, name, 'migration.sql')
    try {
      parts.push(readFileSync(sqlPath, 'utf8'))
    } catch {
      // Carpeta sin migration.sql (ej. borrador): ignorar
    }
  }
  return parts.join('\n')
}

function main(): void {
  const sql = loadCombinedMigrationSql()
  const missing = REQUIREMENTS.filter((r) => !r.test(sql)).map((r) => r.id)

  if (missing.length > 0) {
    console.error(
      'audit-schema-migrations: falta cobertura en prisma/migrations para:',
      missing.join(', ')
    )
    process.exit(1)
  }

  console.log(
    `audit-schema-migrations: OK (${REQUIREMENTS.length} checks de prod-gap en migraciones)`
  )
}

main()
