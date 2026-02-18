# AGENTS.md - Portfolio PBN

> **CONTEXTO**: Sitio web personal y CMS de Paola Bolívar Nievas. Portfolio público + Panel de Administración completo.
> **OBJETIVO**: Codebase limpia, moderna, TypeScript estricto. Prioridad: estabilidad, SEO y rendimiento.

---

## 1. 🛠 Stack & Herramientas (Estricto)

| Herramienta         | Versión/Detalle          | Restricción                                               |
| :------------------ | :----------------------- | :-------------------------------------------------------- |
| **Package Manager** | `pnpm`                   | **PROHIBIDO** usar `npm` o `yarn`.                        |
| **Framework**       | Next.js 16 (App Router)  | Server Actions y Server Components por defecto.           |
| **Lenguaje**        | TypeScript               | **Strict Mode**. Prohibido `any`.                         |
| **Base de Datos**   | PostgreSQL (Neon Tech)   | Usar Pooling. Branching: `main` (prod) / `develop` (dev). |
| **ORM**             | Prisma                   | Schema en `prisma/schema.prisma`.                         |
| **Estilos**         | Tailwind CSS 4           | Variables CSS en `globals.css`. Prohibido hardcodear HEX. |
| **Componentes**     | Radix/Shadcn modificados | `@/components/ui`. Iconos: `lucide-react`.                |
| **Forms**           | React Hook Form + Zod    | Schema único en `src/lib/validations.ts`.                 |
| **Testing**         | Vitest + Playwright      | Unitarios + E2E.                                          |

---

## 2. 📂 Arquitectura

```
src/
├── actions/        # Server Actions (mutations). 100% Inglés.
├── app/
│   ├── (admin)/    # Rutas protegidas CMS. Carpetas en Inglés.
│   ├── (public)/   # Rutas SEO-friendly. Carpetas en Inglés.
│   └── api/        # Solo webhooks/endpoints externos.
├── config/
│   └── routes.ts   # Única fuente de verdad para URLs en Español (centralizado).
├── components/
│   ├── admin/      # Forms de edición, tablas del CMS.
│   ├── layout/     # Navbar, Footer, ThemeProvider.
│   ├── providers/  # AppProviders.tsx (Contexts).
│   ├── public/     # Hero, Gallery, ContactForm (Landing).
│   └── ui/         # Átomos de diseño (Atomizados y Centralizados).
├── lib/            # Singletons, Helpers, Validaciones.
└── styles/         # Tokens CSS + Tailwind.
```

---

## 3. 🧩 Estándar de Componentes UI (`src/components/ui`)

Para evitar duplicidad y mantener consistencia, los componentes atómicos deben seguir esta estructura estrictamente:

### Organización de Carpetas

- **`forms/`**: Inputs, Buttons, Selects, Switches, DatePickers (Todo lo que sea entrada de datos).
- **`data-display/`**: Card, Badge, ProjectCard, CategoryCard (Visualización de datos).
- **`feedback/`**: Toast, EmptyState, ErrorState, LoadingState, Skeleton.
- **`animations/`**: FadeIn, SlideIn, StaggerChildren (Framer Motion wrappers).
- **`media/`**: OptimizedImage, VideoPlayer.
- **`navigation/`**: Tabs, Breadcrumb, Pagination.
- **`overlay/`**: Modal, Dropdown, Popover.

### Reglas de Oro para Componentes

1. **Un Solo Archivo por Componente**: Se prefieren archivos planos (`Button.tsx`) en lugar de carpetas con `index.tsx` a menos que sea un componente extremadamente complejo.
2. **Barrel File**: **TODO** componente en `ui/` debe exportarse desde `src/components/ui/index.ts`.
3. **Importación Centralizada**: Los archivos externos **SIEMPRE** deben importar desde `@/components/ui`.
   - ✅ `import { Button, Input } from '@/components/ui'`
   - ❌ `import Button from '@/components/ui/forms/Button'` (PROHIBIDO)
4. **Variantes**: Usar el patrón de objetos de clases (`const variants = { ... }`) y `cn()` para combinar estilos dinámicos.
5. **Polimorfismo**: Los componentes clave (Button, Input) deben soportar `forwardRef` y opcionalmente `asChild`.

---

## 4. 🔗 Manejo de Rutas

- **Código e Internals**: 100% Inglés (`/projects`, `/contact`).
- **URLs Públicas**: 100% Español (`/proyectos`, `/contacto`).
- **Implementación**:
  1. Definir el mapeo en `next.config.ts` (Rewrites).
  2. Definir la constante en `src/config/routes.ts`.
  3. **REGLA**: Nunca usar strings hardcodeados para rutas en componentes o actions. Usar siempre el objeto `ROUTES`.

---

## 5. 🎨 Sistema de Diseño (Canva Spec)

### Tokens CSS (`globals.css`)

| Token          | Light     | Dark      |
| -------------- | --------- | --------- |
| `--background` | `#fff8fc` | `#0f0505` |
| `--foreground` | `#1a050a` | `#fafafa` |
| `--primary`    | `#6c0a0a` | `#fb7185` |
| `--secondary`  | `#fce7f3` | `#881337` |
| `--card`       | `#ffffff` | `#1c0a0f` |

### Tipografía (Google Fonts)

| Uso             | Fuente      | Variable         |
| --------------- | ----------- | ---------------- |
| Script (firmas) | Great Vibes | `--font-script`  |
| Headings        | Poppins     | `--font-heading` |
| Body            | Open Sans   | `--font-body`    |

### Reglas

- **No hardcodear colores**: Usar `text-[var(--foreground)]`, `bg-[var(--background)]`.
- **Transiciones**: Usar `duration-500` para cambios de tema.
- **Rounded extremos**: Cards con `rounded-[2.5rem]`.

---

## 4. 🗄️ Base de Datos (Neon Branching)

| Entorno    | Branch Git | Branch Neon       | .env File         |
| ---------- | ---------- | ----------------- | ----------------- |
| Producción | `main`     | `main`            | `.env.production` |
| Desarrollo | `develop`  | `preview/develop` | `.env`            |

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

---

## 8. ⚠️ Regla de Oro: Verificación de Regresiones

> **JAMÁS** eliminar código, importaciones o variables sin verificar al 100% que no se usan.

1. **Antes de editar**: Leer el archivo completo y entender las dependencias.
2. **Después de borrar algo**: Correr `npx tsc --noEmit` OBLIGATORIAMENTE para detectar errores de tipos o imports faltantes.
3. **Refactorización**: Si mueves lógica a un helper (ej. emails), verifica que el archivo original siga teniendo todo lo necesario (Zod, tipos, utils) para funcionar.
