# AGENTS.md - Portfolio PBN

> **CONTEXTO**: Sitio web personal y CMS de Paola Bolívar Nievas. Portfolio público + Panel de Administración completo.
> **OBJETIVO**: Codebase limpia, moderna, TypeScript estricto. Prioridad: estabilidad, SEO y rendimiento.

---

## 1. 🛠 Stack & Herramientas (Estricto)

| Herramienta | Versión/Detalle | Restricción |
| :--- | :--- | :--- |
| **Package Manager** | `pnpm` | **PROHIBIDO** usar `npm` o `yarn`. |
| **Framework** | Next.js 16 (App Router) | Server Actions y Server Components por defecto. |
| **Lenguaje** | TypeScript | **Strict Mode**. Prohibido `any`. |
| **Base de Datos** | PostgreSQL (Neon Tech) | Usar Pooling. Branching: `main` (prod) / `develop` (dev). |
| **ORM** | Prisma | Schema en `prisma/schema.prisma`. |
| **Estilos** | Tailwind CSS 4 | Variables CSS en `globals.css`. Prohibido hardcodear HEX. |
| **Componentes** | Radix/Shadcn modificados | `@/components/ui`. Iconos: `lucide-react`. |
| **Forms** | React Hook Form + Zod | Schema único en `src/lib/validations.ts`. |
| **Testing** | Vitest + Playwright | Unitarios + E2E. |

---

## 2. 📂 Arquitectura

```
src/
├── actions/        # Server Actions (mutations)
├── app/
│   ├── (admin)/    # Rutas protegidas CMS
│   ├── (public)/   # Rutas públicas SEO-friendly
│   └── api/        # Solo webhooks/endpoints externos
├── components/
│   ├── admin/      # Forms de edición, tablas
│   ├── layout/     # Navbar, Footer, ThemeProvider
│   ├── providers/  # AppProviders.tsx (ÚNICO lugar para Contexts)
│   ├── public/     # Hero, Gallery, ContactForm
│   └── ui/         # Átomos de diseño (Button, Card, Input)
├── lib/
│   ├── db.ts       # Singleton Prisma
│   ├── seo.ts      # Helpers metadata
│   ├── utils.ts    # cn() y formateadores
│   └── validations.ts  # Schemas Zod compartidos
└── styles/
    └── globals.css # Tokens CSS + Tailwind
```

---

## 3. 🎨 Sistema de Diseño (Canva Spec)

### Tokens CSS (`globals.css`)
| Token | Light | Dark |
|-------|-------|------|
| `--background` | `#fff1f9` | `#6c0a0a` |
| `--foreground` | `#6c0a0a` | `#ffaadd` |
| `--primary` | `#6c0a0a` | `#ffaadd` |
| `--accent` | `#ffaadd` | `#000000` |
| `--card-bg` | `#ffaadd` | `#ffaadd` |

### Tipografía (Google Fonts)
| Uso | Fuente | Variable |
|-----|--------|----------|
| Script (firmas) | Great Vibes | `--font-script` |
| Headings | Poppins | `--font-heading` |
| Body | Open Sans | `--font-body` |

### Reglas
- **No hardcodear colores**: Usar `text-[var(--foreground)]`, `bg-[var(--background)]`.
- **Transiciones**: Usar `duration-500` para cambios de tema.
- **Rounded extremos**: Cards con `rounded-[2.5rem]`.

---

## 4. 🗄️ Base de Datos (Neon Branching)

| Entorno | Branch Git | Branch Neon | .env File |
|---------|------------|-------------|-----------|
| Producción | `main` | `main` | `.env.production` |
| Desarrollo | `develop` | `preview/develop` | `.env` |

### Scripts de Seeding
```bash
pnpm db:seed          # Poblar datos de desarrollo
pnpm db:seed:admin    # Crear usuario admin (dev)
pnpm db:seed:prod     # Crear usuario admin (prod)
pnpm db:push          # Sincronizar schema con DB
pnpm db:studio        # Abrir Prisma Studio
```

---

## 5. 🛡️ Seguridad

- **Archivos IGNORADOS**: `.env`, `.env.production`, `.pnpm-store`, `scripts/` (si contiene keys).
- **Server Actions**: Validar con Zod, verificar sesión (`await auth()`).
- **Imágenes**: Usar `next/image` con `placeholder="blur"`.

---

## 6. 🔧 Comandos Frecuentes

```bash
pnpm dev              # Desarrollo local
pnpm build            # Build producción (verifica tipos)
pnpm verify           # Lint + TypeCheck + Tests
pnpm fresh            # Instalación limpia
pnpm db:push          # Sync schema a DB
pnpm db:seed          # Poblar DB desarrollo
```

---

## 7. 🚫 Anti-Patrones

- ❌ Usar `any` o `// @ts-ignore`.
- ❌ Hardcodear colores HEX en componentes.
- ❌ Usar `useEffect` para fetch (usar Server Components).
- ❌ Dejar `console.log` en producción.
- ❌ Modificar `node_modules` o migrations manualmente.
