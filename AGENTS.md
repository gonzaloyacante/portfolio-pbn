# AGENTS.md - Portfolio PBN

> **CONTEXTO**: Sitio web personal y CMS de Paola Bolívar Nievas.
> Portfolio público (Next.js PWA) + Panel de Administración Web + App nativa Flutter para tablet/móvil.
> **OBJETIVO**: Monorepo ordenado, codebase limpia y moderna. TypeScript estricto en web. Dart idiomático en app.
> Prioridad: estabilidad, SEO (web), rendimiento, offline-first (app).

---

## 0. 📁 Estructura del Monorepo

```
portfolio-pbn/             # Raíz del monorepo
├── AGENTS.md              # Este archivo — reglas globales del proyecto
├── README.md              # Documentación general
├── .gitignore             # Reglas Git globales
├── .github/               # GitHub Actions, instrucciones Codacy
│   ├── workflows/
│   └── instructions/
├── .husky/                # Hooks de pre-commit / pre-push (aplican a web/)
├── .codacy/               # Configuración Codacy CLI multi-lenguaje
├── docs/                  # Documentación técnica del proyecto
│   ├── FLUTTER_ADMIN_APP.md
│   └── *.md
├── web/                   # ✅ TODO lo de Next.js va aquí — NADA de web en raíz
│   ├── src/
│   ├── prisma/
│   ├── public/
│   ├── scripts/
│   ├── package.json
│   ├── next.config.ts
│   └── ...
└── app/                   # ✅ TODO lo de Flutter va aquí — NADA de app en raíz
    ├── lib/
    ├── android/
    ├── ios/
    ├── pubspec.yaml
    └── ...
```

### Regla de Oro del Monorepo

> **Cada cosa en su lugar, estrictamente.**
> - Si es de `web` y no se necesita en `app` → va en `web/`
> - Si es de `app` y no se necesita en `web` → va en `app/`
> - En la raíz SOLO va lo que es verdaderamente compartido (`.gitignore`, `AGENTS.md`, `README.md`, config de GitHub/Husky/Codacy, `docs/`)
> - **PROHIBIDO** poner archivos `package.json`, `pubspec.yaml`, `.env`, `tsconfig.json` u otros archivos de proyecto en la raíz si pertenecen a un sub-proyecto

---

## 1. 🌐 WEB — Next.js (Stack Estricto)

### Stack

| Herramienta         | Versión/Detalle          | Restricción                                               |
| :------------------ | :----------------------- | :-------------------------------------------------------- |
| **Package Manager** | `pnpm`                   | **PROHIBIDO** usar `npm` o `yarn`.                        |
| **Framework**       | Next.js 16 (App Router)  | Server Actions y Server Components por defecto.           |
| **Lenguaje**        | TypeScript               | **Strict Mode**. Prohibido `any` y `@ts-ignore`.          |
| **Base de Datos**   | PostgreSQL (Neon Tech)   | Usar Pooling. Branching: `main` (prod) / `develop` (dev). |
| **ORM**             | Prisma                   | Schema en `prisma/schema/*.prisma` (multi-file schema).   |
| **Estilos**         | Tailwind CSS 4           | Variables CSS en `globals.css`. Prohibido hardcodear HEX. |
| **Componentes**     | Radix/Shadcn modificados | `@/components/ui`. Iconos: `lucide-react`.                |
| **Forms**           | React Hook Form + Zod    | Schema único en `src/lib/validations.ts`.                 |
| **Testing**         | Vitest + Playwright      | Unitarios + E2E.                                          |
| **Auth**            | NextAuth.js v4           | JWT strategy, CredentialsProvider, `maxAge: 7d`.          |
| **Imágenes**        | Cloudinary               | Upload via `/api/upload`. Nunca subir a `/public/`.       |
| **Email**           | Resend                   | Servicio en `src/lib/email-service.ts`.                   |
| **Deploy**          | Vercel                   | Branch `main` → producción. Branch `develop` → preview.   |
| **Error Tracking**  | Sentry                   | Configurado en `sentry.*.config.ts`.                      |

### Arquitectura Web

```
web/src/
├── actions/        # Server Actions (mutations). 100% Inglés.
│   ├── cms/        # CRUD de proyectos, categorías, servicios, testimonios
│   ├── settings/   # Gestión de configuraciones (theme, home, about, contact, etc.)
│   ├── user/       # Auth, contacto, reservas
│   ├── analytics/  # Eventos y datos de analytics
│   └── gallery-ordering.ts
├── app/
│   ├── (admin)/    # Rutas protegidas CMS. Carpetas en Inglés.
│   ├── (public)/   # Rutas SEO-friendly. Carpetas en Inglés.
│   └── api/        # REST endpoints externos (Flutter app + webhooks).
│       ├── admin/  # ← NUEVA: API REST para Flutter admin app
│       │   ├── auth/
│       │   ├── projects/
│       │   ├── categories/
│       │   ├── services/
│       │   ├── testimonials/
│       │   ├── contacts/
│       │   ├── bookings/
│       │   ├── settings/
│       │   ├── analytics/
│       │   ├── social-links/
│       │   ├── trash/
│       │   └── push/
│       ├── auth/   # NextAuth handler
│       ├── upload/ # Cloudinary upload/delete
│       └── ...
├── config/
│   └── routes.ts   # Única fuente de verdad para URLs (español + inglés).
├── components/
│   ├── admin/      # Componentes del CMS web.
│   ├── features/   # Componentes por dominio (dashboard, projects, etc.)
│   ├── layout/     # Navbar, Footer, Sidebar, ThemeProvider.
│   ├── providers/  # AppProviders.tsx (Contexts).
│   ├── public/     # Hero, Gallery, ContactForm (Landing).
│   └── ui/         # Átomos de diseño (Atomizados y Centralizados).
├── lib/            # Singletons, Helpers, Validaciones.
│   ├── auth.ts     # NextAuth config
│   ├── jwt-admin.ts # JWT custom para API Flutter (jose)
│   ├── db.ts       # Prisma client singleton (Neon pooling)
│   ├── validations.ts # Todos los Zod schemas
│   ├── cloudinary.ts
│   ├── email-service.ts
│   ├── push-service.ts # ← NUEVA: FCM push notifications
│   └── ...
├── styles/         # Tokens CSS + Tailwind.
└── types/          # TypeScript interfaces globales.
```

### Reglas de Componentes UI

1. **Un Solo Archivo por Componente**: archivos planos (`Button.tsx`), no carpetas con `index.tsx`.
2. **Barrel File**: TODO componente en `ui/` exportado desde `src/components/ui/index.ts`.
3. **Importación Centralizada**: siempre `import { Button } from '@/components/ui'`. PROHIBIDO importar desde subcarpetas.
4. **Variantes**: patrón de objetos de clases + `cn()`.
5. **Polimorfismo**: `forwardRef` en componentes clave.

### Rutas Web

- **Internals (código)**: 100% Inglés (`/projects`, `/contact`)
- **URLs Públicas**: 100% Español (`/proyectos`, `/contacto`)
- **Nunca** usar strings hardcodeados. Siempre usar el objeto `ROUTES` de `src/config/routes.ts`.

### Base de Datos (Neon Branching)

| Entorno    | Branch Git | Branch Neon       | .env File         |
| ---------- | ---------- | ----------------- | ----------------- |
| Producción | `main`     | `main`            | `.env.production` |
| Desarrollo | `develop`  | `preview/develop` | `.env`            |

### Scripts Web (ejecutar desde `web/`)

```bash
pnpm dev              # Servidor de desarrollo
pnpm build            # Build producción (verifica tipos + prisma generate)
pnpm verify           # Lint + TypeCheck + Tests
pnpm fresh            # Instalación limpia
pnpm db:push          # Sync schema a DB
pnpm db:seed          # Poblar DB desarrollo
pnpm db:seed:admin:dev  # Crear usuario admin (dev)
pnpm db:studio        # Abrir Prisma Studio
pnpm test             # Playwright E2E
pnpm test:unit        # Vitest unitarios
pnpm type-check       # tsc --noEmit (OBLIGATORIO antes de commit)
```

### Sistema de Diseño Web (Tokens CSS)

| Token          | Light     | Dark      |
| -------------- | --------- | --------- |
| `--background` | `#fff8fc` | `#0f0505` |
| `--foreground` | `#1a050a` | `#fafafa` |
| `--primary`    | `#6c0a0a` | `#fb7185` |
| `--secondary`  | `#fce7f3` | `#881337` |
| `--card`       | `#ffffff` | `#1c0a0f` |
| `--muted`      | `#f5f5f5` | `#2a1015` |
| `--accent`     | `#fff1f9` | `#2a1015` |
| `--border`     | `#e5e5e5` | `#2a1015` |

Tipografías: `Great Vibes` (script), `Poppins` (headings), `Open Sans` (body).
Cards: `rounded-[2.5rem]`. Transiciones: `duration-500`.

### Seguridad Web

- **Server Actions**: siempre `await requireAdmin()` + validación Zod.
- **API `/api/admin/*`**: siempre `withAdminJwt()` — JWT custom para Flutter.
- **Rate Limiting**: `checkApiRateLimit()` en todas las mutaciones.
- **CSRF**: middleware verifica cookie + header para rutas `/admin/*`.
- **Imágenes**: `next/image` con `placeholder="blur"`.

### Anti-Patrones Web

- ❌ Usar `any` o `// @ts-ignore`
- ❌ Hardcodear colores HEX en componentes
- ❌ Usar `useEffect` para fetch (usar Server Components)
- ❌ Dejar `console.log` en producción
- ❌ Modificar `node_modules` o migrations manualmente
- ❌ Strings hardcodeados para rutas
- ❌ Llamar a Server Actions directamente desde Flutter (usar endpoints `/api/admin/*`)

---

## 2. 📱 APP — Flutter Admin (Stack Estricto)

### Stack

| Herramienta              | Versión/Detalle                     | Restricción                                                    |
| :----------------------- | :---------------------------------- | :------------------------------------------------------------- |
| **SDK**                  | Flutter stable + Dart ^3.10.7       | Sin downgrade de SDK.                                          |
| **State Management**     | Riverpod (`flutter_riverpod`) + code-gen | **PROHIBIDO** `setState` fuera de componentes triviales. |
| **HTTP Client**          | `dio` + interceptors                | Un solo `ApiClient` singleton. Prohibido `http` package.       |
| **Navegación**           | `go_router`                         | Rutas tipadas, guards en `redirect`. Sin `Navigator.push`.     |
| **Auth Storage**         | `flutter_secure_storage`            | JWT access + refresh token. NUNCA en SharedPreferences.        |
| **DB Local**             | `drift` (SQLite)                    | Tablas tipadas, DAOs, streams reactivos.                       |
| **Imágenes - Upload**    | `image_picker` + `image_cropper`    | Compresión a calidad 85% antes de subir.                       |
| **Push Notifications**   | `firebase_messaging`                | FCM. Token registrado en backend al login.                     |
| **Imágenes - Red**       | `cached_network_image`              | Siempre con placeholder shimmer.                               |
| **Tipografías**          | `google_fonts`                      | Poppins, Open Sans, Great Vibes — igual que la web.             |
| **Forms**                | `flutter_form_builder` + validators | Schema de validación consistente con la web (mismas reglas).   |
| **Gráficos**             | `fl_chart`                          | Dashboard analytics.                                           |
| **Calendario**           | `table_calendar`                    | Vista mensual de reservas.                                     |
| **Google Calendar**      | `googleapis` + `google_sign_in`     | Integración opcional para exportar reservas a Google Calendar. |
| **Mapa**                 | `flutter_map` (OpenStreetMap)       | Mapa de visitantes en dashboard. Sin API key.                  |
| **Serialización**        | `freezed` + `json_serializable`     | Modelos inmutables con code-gen. **PROHIBIDO** maps dinámicos. |
| **Error Tracking**       | `sentry_flutter`                    | Mismo proyecto Sentry que la web.                              |
| **Env Config**           | `envied`                            | Variables de entorno seguras. NUNCA hardcodear URLs/keys.      |
| **Code Gen**             | `build_runner` + `riverpod_generator` | Reejecutar tras cambios en modelos o providers.              |
| **Testing**              | `flutter_test` + `mocktail`         | Unit + widget + integration tests.                             |
| **Logging**              | `logger`                            | Sin `print()` en producción.                                   |
| **Distribución**         | Android + iOS                       | Play Store (Android) + TestFlight/App Store (iOS).             |

### Arquitectura App (Clean Architecture + Feature-Based)

```
app/lib/
├── main.dart                      # Entry point: bootstrap() → ProviderScope → App()
├── app.dart                       # MaterialApp.router + GoRouter + ThemeData
├── bootstrap.dart                 # Init: Firebase, Sentry, DB, SecureStorage pre-load
│
├── core/                          # Infraestructura transversal — NO depende de features
│   ├── api/
│   │   ├── api_client.dart        # Dio singleton, baseUrl desde EnvConfig
│   │   ├── api_interceptors.dart  # Auth, Retry, Logging, Connectivity
│   │   ├── api_exceptions.dart    # Excepciones tipadas: AuthException, NetworkException...
│   │   └── endpoints.dart         # Constantes de URLs (/api/admin/*)
│   ├── auth/
│   │   ├── auth_provider.dart     # AsyncNotifier<AuthState> global
│   │   ├── auth_repository.dart   # login / logout / refresh / me
│   │   ├── auth_interceptor.dart  # Inyecta JWT + auto-refresh en 401
│   │   └── token_storage.dart     # flutter_secure_storage wrapper
│   ├── config/
│   │   ├── env_config.dart        # API_BASE_URL, SENTRY_DSN (envied)
│   │   └── app_constants.dart     # Constantes de la app (timeouts, límites, etc.)
│   ├── database/
│   │   ├── app_database.dart      # drift AppDatabase class
│   │   ├── tables/                # Definición de tablas SQLite (una por entidad)
│   │   └── daos/                  # Data Access Objects por dominio
│   ├── sync/
│   │   ├── sync_queue.dart        # Cola FIFO de operaciones pendientes offline
│   │   ├── sync_manager.dart      # Procesa cola, resuelve conflictos
│   │   └── sync_status_provider.dart # Estado reactivo de sync (pendiente/ok/error)
│   ├── network/
│   │   └── connectivity_provider.dart # StreamProvider<ConnectivityResult>
│   ├── notifications/
│   │   ├── push_service.dart      # FCM setup, token management
│   │   └── notification_handler.dart  # Deeplinks de notificaciones
│   ├── router/
│   │   ├── app_router.dart        # GoRouter con redirect guards
│   │   └── route_names.dart       # Constantes de nombre de rutas
│   ├── theme/
│   │   ├── app_theme.dart         # ThemeData light + dark
│   │   ├── app_colors.dart        # Paleta completa (réplica exacta de globals.css)
│   │   ├── app_typography.dart    # TextStyles con Google Fonts
│   │   └── theme_provider.dart    # Toggle light/dark + persistencia
│   └── utils/
│       ├── date_utils.dart        # Formateo español (dd 'de' MMMM, yyyy)
│       ├── validators.dart        # Validaciones de formulario (alineadas con web)
│       ├── extensions.dart        # Extensions útiles de Dart
│       └── app_logger.dart        # Logger wrapper (sin print())
│
├── shared/                        # Widgets y modelos reutilizables entre features
│   ├── widgets/
│   │   ├── app_scaffold.dart      # Scaffold adaptativo (drawer tablet / bottom nav phone)
│   │   ├── app_drawer.dart        # Drawer lateral — réplica del AdminSidebar web
│   │   ├── loading_overlay.dart
│   │   ├── empty_state.dart
│   │   ├── error_state.dart
│   │   ├── stat_card.dart
│   │   ├── confirm_dialog.dart
│   │   ├── image_upload_widget.dart
│   │   ├── draggable_list.dart
│   │   ├── status_badge.dart
│   │   ├── sync_indicator.dart    # Badge de operaciones pendientes offline
│   │   └── shimmer_loader.dart
│   └── models/
│       ├── api_response.dart      # Wrapper genérico: { success, data?, error?, message? }
│       ├── paginated_response.dart
│       └── sync_operation.dart    # Operación encolada offline
│
└── features/                      # Cada feature: presentation/ + data/ + providers/
    ├── auth/
    ├── dashboard/
    ├── projects/
    ├── categories/
    ├── services/
    ├── testimonials/
    ├── contacts/
    ├── calendar/                  # Reservas + integración Google Calendar
    ├── settings/                  # Hub de settings: home, about, contact, theme, site
    ├── trash/
    ├── account/
    └── help/
```

### Reglas de Dart/Flutter

1. **State Management**: Usar Riverpod exclusivamente. Un `Provider` por responsabilidad. Code-gen con `@riverpod`.
2. **Modelos**: Usar `@freezed` + `@JsonSerializable`. **PROHIBIDO** usar `Map<String, dynamic>` directamente en lógica de negocio.
3. **Async**: Usar `AsyncValue` de Riverpod. **PROHIBIDO** `setState` para loading/error global. **PROHIBIDO** `FutureBuilder` en pantallas principales.
4. **Navegación**: Solo `context.go()`, `context.push()` de GoRouter. **PROHIBIDO** `Navigator.push()`.
5. **Logging**: Usar `AppLogger.info/warn/error()`. **PROHIBIDO** usar `print()` en ningún archivo.
6. **Imports**: Preferir imports relativos dentro de un feature, imports de paquete (`package:`) para core/shared.
7. **Const**: Usar `const` siempre que sea posible en widgets.
8. **BuildContext**: No pasar `BuildContext` a repositories o providers.
9. **Error Handling**: Usar `Either<Failure, Success>` o `AsyncValue.error`. Nunca silenciar excepciones.
10. **Offline**: Todo Repository debe implementar el patrón network-first con fallback a cache local.

### Sistema de Diseño App (réplica exacta de web)

```
Colores Light: primary=#6C0A0A, background=#FFF8FC, foreground=#1A050A
              card=#FFFFFF, secondary=#FCE7F3, muted=#F5F5F5
              success=#10B981, warning=#F59E0B, destructive=#EF4444

Colores Dark:  primary=#FB7185, background=#0F0505, foreground=#FAFAFA
              card=#1C0A0F, secondary=#881337, muted=#2A1015

Tipografías:   Poppins (headings), Open Sans (body), Great Vibes (decorativo)
Cards:         BorderRadius 40px (= rounded-[2.5rem])
Transiciones:  500ms (= duration-500)
```

### Google Calendar Integration (Reservas/Bookings)

La pantalla de Calendario tiene integración opcional con Google Calendar:

**Flujo:**
1. Usuario puede conectar su cuenta Google (OAuth2 con `google_sign_in`)
2. Al confirmar/crear una reserva, aparece opción "Agregar a Google Calendar"
3. Usa `googleapis` (Google Calendar API) para crear un evento en el calendario del usuario
4. El evento incluye: título (nombre del cliente + servicio), descripción (notas, teléfono), fecha/hora de inicio y fin, recordatorio 1h antes
5. Se puede desconectar la cuenta Google desde la pantalla de Account
6. El token OAuth de Google se guarda en `flutter_secure_storage` (separado del JWT admin)
7. **Retrocompatibilidad**: Si el usuario no tiene Google Calendar conectado, el botón muestra "Conectar Google Calendar"

**Backend:** No requiere cambios en el backend. La integración es puramente client-side desde la app Flutter usando OAuth2 de Google directamente.

**Modelos:**
- `GoogleCalendarEvent`: título, descripción, startDateTime, endDateTime, attendees?, reminder
- `GoogleAuthState`: disconnected / connecting / connected(email, token)

### Scripts Flutter (ejecutar desde `app/`)

```bash
flutter pub get           # Instalar dependencias
flutter pub run build_runner build --delete-conflicting-outputs   # Code gen
flutter analyze           # Análisis estático (0 warnings tolerados)
flutter test              # Todos los tests
flutter build apk --release    # Build Android
flutter build ios --release    # Build iOS
flutter run               # Desarrollo local
```

### CI/CD App

- Workflow: `.github/workflows/flutter-ci.yml`
- Triggers: push/PR a `develop` en paths `app/**`
- Steps: `flutter analyze` → `flutter test` → `flutter build apk` → `flutter build ios`
- Distribución Android: Firebase App Distribution (test) → Play Store (prod)
- Distribución iOS: TestFlight (test) → App Store (prod)

### Anti-Patrones App

- ❌ Usar `print()` (usar `AppLogger`)
- ❌ Hardcodear URLs o API keys (usar `envied`)
- ❌ `setState` para estado global o de carga
- ❌ `Navigator.push()` (usar GoRouter)
- ❌ `Map<String, dynamic>` como modelo de datos
- ❌ `FutureBuilder`/`StreamBuilder` en pantallas completas (usar Riverpod)
- ❌ Ignorar errores de `flutter analyze`
- ❌ Subir secretos, `.env`, `google-services.json` al repo
- ❌ Lógica de negocio en widgets (va en providers/repositories)
- ❌ Acceder a Server Actions de Next.js directamente (solo via `/api/admin/*`)

---

## 3. 🔒 Seguridad Global

- **Archivos IGNORADOS**: `.env`, `.env.production`, `google-services.json`, `GoogleService-Info.plist`, `*.pem`, `*.key`, scripts con keys.
- **JWT Custom (API Flutter)**: Access token 15min + Refresh token 30 días, rotación en cada refresh, revocación en logout.
- **CORS API `/api/admin/*`**: Solo acepta requests con JWT válido. No accesible desde browser sin token.
- **flutter_secure_storage**: Encrypted SharedPreferences (Android) + Keychain (iOS). NUNCA guardar tokens en SharedPreferences plano.
- **Cloudinary**: Upload siempre server-side (el cliente sube a `/api/upload` que llama a Cloudinary). NUNCA exponer credenciales Cloudinary al cliente.

---

## 4. 🔧 Comandos Frecuentes por Contexto

### Desde `web/`
```bash
pnpm dev                  # Dev server Next.js
pnpm build                # Build producción
pnpm type-check           # TypeScript check (OBLIGATORIO ante cualquier error)
pnpm lint                 # ESLint
pnpm test:unit            # Vitest
pnpm test                 # Playwright E2E
pnpm db:push              # Sync schema
pnpm db:studio            # Prisma Studio
```

### Desde `app/`
```bash
flutter pub get           # Instalar deps
flutter pub run build_runner build --delete-conflicting-outputs
flutter analyze           # Análisis (0 warnings)
flutter test              # Tests
flutter run               # Dev en dispositivo/emulador
```

---

## 5. ⚠️ Reglas de Oro Globales

### Regresiones
> **JAMÁS** eliminar código, importaciones o variables sin verificar al 100% que no se usan.
1. **Antes de editar**: Leer el archivo completo y entender las dependencias.
2. **Después de borrar algo** en web: Correr `pnpm type-check` OBLIGATORIAMENTE.
3. **Después de borrar algo** en app: Correr `flutter analyze` OBLIGATORIAMENTE.
4. **Refactorización**: Si mueves lógica a un helper, verifica que el archivo original siga teniendo todo lo necesario.

### Orden de Verificación por Fase
Al terminar cada fase de implementación:
1. **Web**: `pnpm type-check` → `pnpm lint` → `pnpm test:unit`
2. **App**: `flutter analyze` → `flutter test` → `flutter pub run build_runner build`
3. **Git**: Commit atómico con mensaje descriptivo en formato `feat(scope): descripción`
4. **Codacy**: Análisis automático post-commit via CI

### Commits
- Formato: `feat(scope): descripción` / `fix(scope): descripción` / `chore(scope): descripción`
- Scopes: `web`, `app`, `api`, `db`, `auth`, `theme`, `ci`, `docs`
- Ejemplos:
  - `feat(api): add JWT auth endpoints for Flutter admin app`
  - `feat(app): implement Phase 0 - project structure and dependencies`
  - `feat(app): add Google Calendar integration to bookings`

