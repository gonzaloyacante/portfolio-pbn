# Portfolio PBN

**Portfolio profesional + CMS completo de Paola Bolívar Nievas** — Maquilladora profesional especializada en audiovisuales, FX, teatro y caracterización.

Monorepo con dos componentes independientes:
- **`web/`** — Sitio público Next.js 16 (PWA) + panel de administración web
- **`app/`** — App nativa Flutter para administración desde tablet/móvil

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Flutter](https://img.shields.io/badge/Flutter-stable-02569B?logo=flutter)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Neon](https://img.shields.io/badge/PostgreSQL-Neon-00E599?logo=postgresql)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## Índice

- [Portfolio PBN](#portfolio-pbn)
  - [Índice](#índice)
  - [Descripción del proyecto](#descripción-del-proyecto)
  - [Arquitectura del monorepo](#arquitectura-del-monorepo)
  - [Web — Next.js (`web/`)](#web--nextjs-web)
    - [Stack](#stack)
    - [Sistema de diseño](#sistema-de-diseño)
  - [App — Flutter Admin (`app/`)](#app--flutter-admin-app)
    - [Stack](#stack-1)
    - [Funcionalidades](#funcionalidades)
  - [Primeros pasos](#primeros-pasos)
    - [Requisitos previos](#requisitos-previos)
  - [Estrategia de base de datos (Neon Branching)](#estrategia-de-base-de-datos-neon-branching)
  - [Sistema de notificaciones push](#sistema-de-notificaciones-push)
  - [Seguridad](#seguridad)
  - [Autor](#autor)

---

## Descripción del proyecto

Portfolio dinámico para una maquilladora profesional. El sitio público muestra una galería de imágenes organizada por categorías y permite a los visitantes contactar o hacer reservas. Toda la gestión de contenido (imágenes de galería, categorías, servicios, testimoniales, reservas) se realiza desde dos herramientas de administración: el panel web y la app nativa Flutter.

**Flujo de administración:**

```
Administrador
    │
    ├── Desde escritorio → Panel CMS web  (web/(admin))
    └── Desde móvil/tablet → App Flutter  (app/)
            │
            └── API REST  /api/admin/*  (Next.js Route Handlers)
                    │
                    └── PostgreSQL (Neon)
```

---

## Arquitectura del monorepo

```
portfolio-pbn/
├── web/                  # Next.js 16 — sitio público + CMS web
│   ├── src/
│   │   ├── app/
│   │   │   ├── (public)/       # Rutas SEO en español (/portfolio, /contacto...)
│   │   │   ├── (admin)/        # Panel CMS protegido (/admin/...)
│   │   │   └── api/
│   │   │       ├── admin/      # REST para app Flutter (JWT custom)
│   │   │       └── upload/     # Cloudinary server-side
│   │   ├── actions/            # Server Actions (mutations)
│   │   ├── components/         # UI: admin/, features/, layout/, public/, ui/
│   │   ├── lib/                # db.ts, auth.ts, validations.ts, string-utils.ts...
│   │   └── config/routes.ts    # ÚNICA fuente de verdad de URLs
│   └── prisma/
│       └── schema/             # Multi-file Prisma schema
│           ├── core.prisma     # Project, Category, Image
│           ├── auth.prisma     # User, Session
│           └── ...
├── app/                  # Flutter — app admin nativa
│   └── lib/
│       ├── core/               # DB local, routing, API client, updates
│       ├── features/           # projects/, categories/, bookings/, settings/...
│       └── shared/             # Widgets compartidos, design system
├── docs/                 # Documentación técnica adicional
└── AGENTS.md             # Reglas del proyecto para agentes AI (leer antes de tocar código)
```

---

## Web — Next.js (`web/`)

### Stack

| Herramienta | Versión/Detalle |
|---|---|
| Framework | Next.js 16 — App Router, Server Components, Server Actions |
| Lenguaje | TypeScript 5 en modo estricto — prohibido `any` y `@ts-ignore` |
| Base de datos | PostgreSQL (Neon) — branching dev/prod vía `PrismaPg` adapter |
| ORM | Prisma — multi-file schema en `prisma/schema/` |
| Estilos | Tailwind CSS 4 — tokens CSS en `globals.css` |
| Auth | NextAuth.js v4 — JWT + CredentialsProvider |
| Email | Resend |
| Imágenes | Cloudinary — upload siempre server-side via `/api/upload` |
| Deploy | Vercel — `main` → prod, `develop` → preview |
| Error tracking | Sentry |
| Analytics | Google Analytics 4 |
| Notificaciones push | Firebase Cloud Messaging (FCM HTTP v1) |
| Package manager | `pnpm` exclusivamente — prohibido `npm` o `yarn` |

### Sistema de diseño

Los colores, tipografías, radios y espaciados están definidos como tokens CSS en `globals.css`. Nunca usar valores hardcodeados en componentes.

| Token      | Descripción |
|---|---|
| `--primary` | Rojo vino (marca) |
| `--background` | Blanco cálido (light) / Negro profundo (dark) |
| `--card` | Fondo de tarjetas |

Tipografías: **Great Vibes** (títulos decorativos), **Poppins** (encabezados), **Open Sans** (cuerpo de texto).

---

## App — Flutter Admin (`app/`)

App nativa Android/iOS para que la administradora gestione el portfolio desde su teléfono o tablet. Se conecta al backend vía API REST en `/api/admin/*` usando JWT custom.

### Stack

| Herramienta | Detalle |
|---|---|
| SDK | Flutter stable + Dart ^3.10 |
| State management | Riverpod + code-gen (`@riverpod`) |
| Navegación | `go_router` — rutas tipadas con guards |
| HTTP | `dio` + interceptors (auth, retry, refresh token) |
| DB local | `drift` (SQLite) — cache offline-first |
| Push | Firebase Cloud Messaging (FCM) |
| Auth storage | `flutter_secure_storage` — JWT. Nunca SharedPreferences plano |
| Modelos | `freezed` + `json_serializable` — code-gen obligatorio |
| Error tracking | Sentry |

### Funcionalidades

- Dashboard con estadísticas en tiempo real
- Gestión completa de imágenes, categorías, servicios y testimoniales
- Bandeja de mensajes de contacto con estados
- Calendario de reservas con vista mensual
- Notificaciones push con deep links, activables por tipo
- Modo oscuro/claro con persistencia
- Soporte offline con cola de sincronización
- Actualizaciones in-app con notificación al detectar nueva versión

---

## Primeros pasos

### Requisitos previos

- Node.js 20+, `pnpm` 9+
- Flutter SDK (stable channel)
- Cuenta en Neon (PostgreSQL), Cloudinary, Resend, Firebase, Vercel
- `gh` CLI (GitHub CLI) — para scripts de distribución Android

---

## Estrategia de base de datos (Neon Branching)

| Entorno | Branch Git | Branch Neon | Archivo .env |
|---|---|---|---|
| Producción | `main` | `main` | `.env.production` (gestionado por Vercel) |
| Desarrollo | `develop` | `preview/develop` | `.env` (local) |

---

## Sistema de notificaciones push

Las notificaciones se envían via FCM HTTP v1 desde el servidor Next.js. Cada tipo se activa/desactiva individualmente desde la app en **Preferencias → Notificaciones**.

| Tipo | Descripción |
|---|---|
| `contact` | Nuevo mensaje del formulario público |
| `booking` | Nueva reserva creada |
| `booking_reminder` | Recordatorio 24h / 1h antes de una reserva |
| `gallery` | Imagen de galería publicada o actualizada |
| `service` | Servicio añadido o modificado |
| `testimonial` | Nuevo testimonial recibido |
| `system` | Alertas de sistema (sync, actualizaciones de app) |

---

## Seguridad

Repositorio público solo con fines de portafolio. No se aceptan contribuciones.

Los siguientes archivos están en `.gitignore` y **nunca se deben commitear**:

| Archivo | Motivo |
|---|---|
| `web/.env*` | Variables de entorno (DB, API keys, JWT secrets) |
| `app/android/app/google-services.json` | Config Firebase Android |
| `app/ios/Runner/GoogleService-Info.plist` | Config Firebase iOS |
| `app/lib/firebase_options.dart` | Opciones Firebase con API keys |
| `app/keystore/` y `app/android/key.properties` | Firma APK Android |
| `*firebase-adminsdk*.json` | Service account Firebase Admin |

Mecanismos de seguridad implementados:

- **Panel CMS web**: Session JWT vía NextAuth. Todas las Server Actions tienen `await requireAdmin()` como primera línea.
- **API Flutter** (`/api/admin/*`): JWT custom (access 15min + refresh 30 días con rotación). Cada endpoint usa `withAdminJwt()`.
- **Rate limiting**: `checkApiRateLimit()` en formularios públicos y endpoints de autenticación.
- **Imágenes**: upload siempre server-side — el cliente nunca recibe credenciales de Cloudinary.
- **Tokens Flutter**: almacenados en `flutter_secure_storage` (Keychain en iOS, EncryptedSharedPreferences en Android).

---

## Autor

**Gonzalo Yacante** — Full Stack Developer

- Portfolio: [gonzaloyacante.com](https://gonzaloyacante.com)
- LinkedIn: [/in/gonzaloyacante](https://linkedin.com/in/gonzaloyacante)
- GitHub: [@gonzaloyacante](https://github.com/gonzaloyacante)

---

<p align="center">Desarrollado por <strong>Gonzalo Yacante</strong></p>

