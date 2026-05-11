# AGENTS.md - Portfolio PBN

> **CONTEXTO**: Sitio web personal y CMS de Paola Bolívar Nievas.
> Portfolio público (Next.js PWA) + Panel de Administración Web + App nativa Flutter para tablet/móvil.
> **OBJETIVO**: Monorepo ordenado, codebase limpia y moderna. TypeScript estricto en web. Dart idiomático en app.
> Prioridad: estabilidad, SEO (web), rendimiento. **App admin:** online-first con borradores y prefs locales (ver §6 Reglas Dart #10); sin SQLite/Drift hasta converger dependencias.

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
| **ORM**             | Prisma + `PrismaPg`      | Schema en `prisma/schema/*.prisma`. Adaptador `@prisma/adapter-pg` + `pg` Pool en `db.ts`. Las transacciones con `prisma.$transaction()` funcionan correctamente con este adaptador. |
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
│   ├── cms/        # CRUD de imágenes de galería, categorías, servicios, testimonios
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
│   ├── db.ts       # Prisma client singleton (PrismaPg adapter + Neon pooling)
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

- **Internals (código)**: 100% Inglés (`/portfolio`, `/contact`)
- **URLs Públicas**: 100% Español (`/portfolio`, `/contacto`)
- **Nunca** usar strings hardcodeados. Siempre usar el objeto `ROUTES` de `src/config/routes.ts`.

### Base de Datos (Neon Branching)

| Entorno    | Branch Git | Branch Neon | .env File         |
| ---------- | ---------- | ----------- | ----------------- |
| Producción | `main`     | `main`      | `.env.production` |
| Desarrollo | `develop`  | `develop`   | `.env`            |

> **Proyecto Neon**: `dry-cake-98386708` (org: Vercel: Gonzalo Yacante's projects)
> **Pool config**: `max: 3`, `idleTimeoutMillis: 10_000` — crítico para free tier (suspende compute rápido)
> **⚠️ PROHIBIDO**: escribir en DB desde rate limiters — usar solo memoria. Ver `src/lib/rate-limit.ts`.

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
- ❌ **Mostrar el `slug` en cualquier UI admin** — el slug es metadata interna autogenerada. NUNCA mostrarlo como texto visible al administrador en ningún componente, lista, card o formulario. Solo puede usarse internamente en href de navegación a la web pública.
- ❌ **Filtrar categorías por `isActive: true` en contexto admin** — En páginas de administración (crear/editar categorías, listados admin), las queries de categorías deben usar `where: { deletedAt: null }` sin filtrar por `isActive`. El filtro `isActive: true` solo aplica a queries públicas (`getPaginatedCategories`, `getImagesByCategory`, etc.). Filtrar por `isActive` en admin causa falsos negativos: "no hay categorías" cuando sí existen pero están inactivas.
- ❌ **Generar slugs en el cliente** — NUNCA generar slugs en el navegador con `.replace(/[^a-z0-9\s-]/g, '')` u otras expresiones sin NFD normalization. Los caracteres españoles (á, é, í, ó, ú, ñ) se eliminan silenciosamente. Siempre generar slugs server-side: enviar campo vacío desde el formulario y dejar que el Server Action llame a `generateSlug(name)` de `@/lib/string-utils` (usa `normalize('NFD')`). El slug en formularios de creación debe ser `<input type="hidden" name="slug" value="">` — la generación es responsabilidad del servidor.

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
| **DB Local**             | *Roadmap:* `drift` (SQLite)          | **No activo:** conflicto `sqlite3` vs `riverpod_generator` (ver Decisiones Cerradas). Hoy: prefs + borradores + secure storage. |
| **Imágenes - Upload**    | `image_picker` + `image_cropper`    | Calidad 100% (sin compresión — portafolio artístico, calidad máxima intencional). Ver `AppConstants.imageQuality`. |
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
| **Env Config**           | `flutter_dotenv ^6.0.0`             | Variables de entorno seguras via `.env`. NUNCA hardcodear URLs/keys. Acceder SIEMPRE via `EnvConfig.X` — nunca `dotenv.env[]` directo. |
| **Code Gen**             | `build_runner` + `riverpod_generator` | Reejecutar tras cambios en modelos o providers.              |
| **Testing**              | `flutter_test` + `mocktail`         | Unit + widget + integration tests.                             |
| **Logging**              | `logger`                            | Sin `print()` en producción.                                   |
| **Distribución**         | Android + iOS                       | Play Store (Android) + TestFlight/App Store (iOS).             |

### Arquitectura App (Clean Architecture + Feature-Based)

> **INSPIRACIÓN**: Estructura idéntica al proyecto minipc — la referencia canónica de arquitectura para este proyecto.

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
│   │   ├── env_config.dart        # API_BASE_URL, SENTRY_DSN (flutter_dotenv — wrapper tipado)
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
│   ├── updates/
│   │   ├── app_update_model.dart  # Modelo de versión/release
│   │   ├── app_update_repository.dart # Checks de nueva versión
│   │   └── presentation/
│   │       ├── app_update_dialog.dart       # Dialog principal de actualización
│   │       └── app_update_dialog_phases.dart # Fases del proceso de update
│   └── utils/
│       ├── date_utils.dart        # Formateo español (dd 'de' MMMM, yyyy)
│       ├── validators.dart        # Validaciones de formulario (alineadas con web)
│       ├── extensions.dart        # Extensions útiles de Dart
│       └── app_logger.dart        # Logger wrapper (sin print())
│
├── shared/                        # Widgets y modelos reutilizables entre features
│   ├── models/
│   │   ├── api_response.dart      # Wrapper genérico: { success, data?, error?, message? }
│   │   ├── paginated_response.dart
│   │   └── sync_operation.dart    # Operación encolada offline
│   └── widgets/
│       ├── widgets.dart           # Barrel principal — re-exporta todas las subcarpetas
│       ├── adaptive_form_layout.dart  # Layout de formulario adaptativo
│       ├── adaptive_grid.dart         # Grid responsivo
│       ├── app_card.dart              # Card base del design system
│       ├── draggable_list.dart        # Lista con drag & drop
│       ├── layout/                # Estructura/navegación de la app
│       │   ├── barrel.dart        # export 'app_scaffold.dart'; export 'app_drawer.dart'; ...
│       │   ├── app_scaffold.dart  # Scaffold adaptativo (drawer tablet / bottom nav phone)
│       │   ├── app_drawer.dart    # Drawer lateral — réplica del AdminSidebar web
│       │   ├── app_drawer_widgets.dart  # Sub-widgets del drawer
│       │   └── nav_items.dart     # Items de navegación
│       ├── display/               # Widgets de presentación de datos
│       │   ├── barrel.dart        # export 'section_header.dart'; export 'shimmer_loader.dart'; ...
│       │   ├── section_header.dart
│       │   ├── shimmer_loader.dart
│       │   ├── stat_card.dart
│       │   ├── status_badge.dart
│       │   ├── sync_indicator.dart    # Badge de operaciones pendientes offline
│       │   ├── fade_slide_in.dart     # Animación de entrada
│       │   ├── pbn_splash_logo.dart   # Logo splash
│       │   ├── skeleton_category.dart
│       │   ├── skeleton_dashboard.dart
│       │   ├── skeleton_misc.dart
│       │   ├── skeleton_project.dart
│       │   └── skeleton_service.dart
│       ├── feedback/              # Widgets de feedback al usuario
│       │   ├── barrel.dart        # export 'empty_state.dart'; export 'error_state.dart'; ...
│       │   ├── empty_state.dart
│       │   ├── error_state.dart
│       │   ├── loading_overlay.dart
│       │   ├── app_snack_bar.dart
│       │   ├── confirm_dialog.dart
│       │   └── help_tooltip.dart
│       ├── inputs/                # Inputs y selectores de formulario
│       │   ├── barrel.dart        # export 'app_search_bar.dart'; export 'app_filter_chips.dart'; ...
│       │   ├── app_search_bar.dart
│       │   ├── app_filter_chips.dart
│       │   ├── color_field.dart
│       │   ├── color_picker_field.dart
│       │   ├── duration_picker_field.dart
│       │   ├── emoji_icon_picker.dart
│       │   ├── emoji_icon_picker_sheet.dart
│       │   ├── font_picker_field.dart
│       │   ├── font_picker_field_sheet.dart
│       │   └── phone_input_field.dart
│       └── media/                 # Upload y previsualización de imágenes
│           ├── barrel.dart        # export 'image_upload_widget.dart'; ...
│           ├── image_upload_widget.dart
│           ├── image_upload_widget_builders.dart
│           └── image_upload_widget_previews.dart
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
    ├── app_settings/              # Preferencias de la app (notif, tema, servidor)
    │   └── providers/
    │       └── app_preferences_provider.dart  # ← Movido de core/providers/
    ├── trash/
    ├── account/
    └── help/
```

---

### Reglas de Arquitectura — ESTRICTAS (basadas en minipc)

#### Pantallas
- Una pantalla **solo orquesta** — llama widgets, escucha providers, maneja navegación
- **PROHIBIDO** definir widgets dentro de una pantalla. Si cabe en la pantalla → extrae a `/widgets/`
- **Límite máximo: 100 líneas por pantalla**. Si se supera → extraer builders en `*_builders.dart`

#### Widgets
- Cada widget = **un archivo**. Sin excepciones
- **PROHIBIDO** clases privadas `_Widget` dentro de otro archivo como atajo
- Si un widget tiene más de 20 líneas y se puede reusar → `shared/widgets/<subcarpeta>/`
- Si un widget es específico de una feature → `features/<feature>/presentation/widgets/`
- **Límite máximo: 150 líneas por widget**. Si se supera → extraer en archivos separados

#### Providers
- **Límite máximo: 150 líneas por provider**. Si se supera → extraer lógica a helpers

#### Barrel files (patrón obligatorio para shared/widgets)
- Cada subcarpeta tiene un `barrel.dart` que re-exporta todos sus archivos
- El `widgets.dart` raíz re-exporta desde cada `barrel.dart` de subcarpeta
- **Importación SIEMPRE desde el barrel**: `import 'package:portfolio_pbn/shared/widgets/widgets.dart'`
- **PROHIBIDO** importar directamente desde subcarpetas en código de features

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
10. **Offline**: Objetivo documentado = network-first + cache local cuando exista Drift; **hoy** la app es online-first: interceptor bloquea HTTP sin red; UX debe informar offline (`AppScaffold` + `ErrorState.forFailure`). Fallback local actual: perfil auth cacheado, borradores de formularios, prefs.

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

### Google Calendar Integration (Reservas/Bookings) — OBLIGATORIO

La pantalla de Calendario tiene integración **obligatoria** con Google Calendar:

**Flujo:**
1. Usuario puede conectar su cuenta Google (OAuth2 con `google_sign_in`)
2. Al confirmar/crear una reserva, aparece opción "Agregar a Google Calendar"
3. Usa `googleapis` (Google Calendar API) para crear un evento en el calendario del usuario
4. El evento incluye: título (nombre del cliente + servicio), descripción (notas, teléfono), fecha/hora de inicio y fin, recordatorio 1h antes
5. Se puede desconectar la cuenta Google desde la pantalla de Account
6. El token OAuth de Google se guarda en `flutter_secure_storage` (separado del JWT admin)


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

### Distribución Android — Workflow Automatizado

> **La AI DEBE seguir este procedimiento exacto cada vez que distribuya la app Android.**

#### Mecanismo de distribución (2 canales simultáneos)

| Canal | Herramienta | Propósito |
|-------|-------------|-----------|
| **GitHub Releases** | `gh` CLI | Hospedaje APK gratuito y permanente. URL estable calculada automáticamente. |
| **Firebase App Distribution** | `firebase-tools` | Email de notificación a testers. |
| **API in-app update** | `curl` + backend | Notificación FCM push + diálogo de descarga dentro de la app. |

#### Ejecutar distribución

> ⚠️ **Los scripts son OBLIGATORIOS y no aceptan flags.** Cada ejecución ejecuta todos los pasos sin excepción.

```bash
# Distribución DESARROLLO (APK debug, prerelease)
# Desde la raíz del monorepo:
bash app/scripts/distribute-dev.sh

# Distribución PRODUCCIÓN (APK release, obfuscated)
bash app/scripts/distribute-prod.sh
```

**Ambos scripts calculan automáticamente:**
- Versión y versionCode desde `app/pubspec.yaml`
- Tag dev: `app/v{VERSION}-dev` / Tag prod: `app/v{VERSION}`
- Nombre del APK: `portfolio-pbn-admin-v{VERSION}-debug.apk` o `-release.apk`
- URL de descarga desde la API de GitHub Releases
- `DEPLOY_SECRET_TOKEN` auto-leído de `web/.env`

#### Primera configuración (solo una vez)

```bash
# 1. Keystore Android
bash app/scripts/setup_keystore.sh

# 2. Firebase CLI
npm install -g firebase-tools && firebase login

# 3. GitHub CLI
brew install gh && gh auth login
```

**Variables de entorno requeridas:**

| Variable | Dónde | Descripción |
|----------|-------|-------------|
| `DEPLOY_SECRET_TOKEN` | `web/.env` y **Vercel** | Generado con `openssl rand -hex 32`. Autenticación del POST al backend. |

> ⚠️ IMPORTANTE: `DEPLOY_SECRET_TOKEN` debe estar en **dos lugares**:
> 1. `web/.env` (ya configurado)
> 2. **Vercel** → Settings → Environment Variables (el usuario debe hacerlo manualmente)

#### Generar nuevo DEPLOY_SECRET_TOKEN (si se necesita rotar)

```bash
# La AI debe ejecutar esto automáticamente, nunca pedir al usuario que lo genere:
NEW_TOKEN=$(openssl rand -hex 32)
echo "DEPLOY_SECRET_TOKEN=\"$NEW_TOKEN\"" >> web/.env
echo "Añadir también en Vercel -> Settings -> Environment Variables:"
echo "  DEPLOY_SECRET_TOKEN = $NEW_TOKEN"
```

#### Flujo obligatorio de los scripts de distribución

Ambos scripts ejecutan **todos** estos pasos sin excepción (ninguno es opcional):

```
1/4  flutter pub get + flutter build apk (debug o release --obfuscate)
2/4  gh release create/upload → GitHub Releases (prerelease dev o release prod)
3/4  firebase appdistribution:distribute → email a testers vía Firebase
4/4  POST /api/admin/app/latest-release → crea AppRelease en DB + envía FCM push in-app
```

> Si `firebase` CLI, `FIREBASE_APP_ID` o `FIREBASE_TOKEN` no están disponibles → el script **falla** con error. No omite pasos.

### Anti-Patrones App

- ❌ Usar `print()` (usar `AppLogger`)
- ❌ Hardcodear URLs o API keys (usar `flutter_dotenv` via `EnvConfig.X`)
- ❌ `setState` para estado global o de carga
- ❌ `Navigator.push()` (usar GoRouter)
- ❌ `Map<String, dynamic>` como modelo de datos
- ❌ `FutureBuilder`/`StreamBuilder` en pantallas completas (usar Riverpod)
- ❌ Ignorar errores de `flutter analyze`
- ❌ Subir secretos, `.env`, `google-services.json` al repo
- ❌ Lógica de negocio en widgets (va en providers/repositories)
- ❌ Acceder a Server Actions de Next.js directamente (solo via `/api/admin/*`)
- ❌ **Mostrar el `slug` en cualquier UI admin** — el slug es metadata interna autogenerada. NUNCA incluirlo en listas, cards, formularios ni pantallas de detalle como texto visible. Solo se usa internamente (auto-generado, enviado al backend, nunca renderizado).

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
- **Requisito OBLIGATORIO:** Cada commit que afecte `app/` debe incluir un aumento de versión en `app/pubspec.yaml` (ej.: `version: X.Y.Z+N`). Esto es indispensable para que los scripts de distribución detecten builds nuevas y las notificaciones in-app funcionen. Sin bump de versión, la app no detecta actualizaciones.

---

## 6. 🧠 MEMORIA ACTIVA

> [!IMPORTANT] MEMORIA PERMANENTE
> Este proyecto está indexado en el Cerebro Digital (Obsidian). **Antes de cada sesión de trabajo**, el Agente DEBE consultar `~/cerebro/Proyectos/portfolio-pbn/` para cargar el contexto de arquitectura, deuda técnica y decisiones cerradas.

### Notas clave en Obsidian

| Nota | Propósito |
|------|-----------|
| `Proyectos/portfolio-pbn/SOP_Reglas.md` | Reglas, prohibiciones y protocolos — fuente de verdad |
| `Proyectos/portfolio-pbn/Stack_Tecnico.md` | Versiones exactas, dependencias, scripts |
| `Proyectos/portfolio-pbn/Mapa_Estructura.md` | Jerarquía de carpetas y responsabilidades |
| `Proyectos/portfolio-pbn/Design_System_Real.md` | Tokens reales (HEX, spacing, radius, typography) |
| `Proyectos/portfolio-pbn/Flujo_Datos_Estado.md` | Providers Riverpod, auth state machine, persistencia |
| `Proyectos/portfolio-pbn/Features/` | Una nota por feature con capa datos/dominio/UI |
| `Proyectos/portfolio-pbn/Tareas_Pendientes.md` | Backlog priorizado de deuda técnica |
| `Proyectos/portfolio-pbn/Auditoria_Calidad_*.md` | Hallazgos de auditoría con fecha |
| `wiki/entities/portfolio-pbn.md` | Índice central con wikilinks a todo |

### Decisiones Cerradas (no reabrir sin evidencia nueva)

| Decisión | Razón |
|----------|-------|
| `flutter_dotenv` en lugar de `envied` | No se necesita code-gen; wrapper tipado `EnvConfig` es suficiente |
| `imageQuality = 100` (sin compresión) | Portafolio artístico — calidad máxima es requerimiento del cliente |
| Rate limit in-memory | Aceptable para deployment single-region en Vercel; documentado como limitación |
| `unstable_cache` (no migrado aún) | `"use cache"` directive en Next.js 16 es API experimental; migrar gradualmente |
| Theme DB-driven | Permite al cliente cambiar colores sin redeploy; caché con `revalidateTag` |
| JWT custom (Flutter) independiente de NextAuth | NextAuth no tiene endpoint REST consumible desde Flutter nativo |
| Refresh tokens como UUID en DB (no JWT) | Permite revocación inmediata; JWTs de refresh son irrevocables |
| Sin Drift/SQLite local (por ahora) | `drift` + `drift_dev` chocaban con `riverpod_generator` ≥4.0.1 por **conflicto de versiones del paquete `sqlite3`**; persistencia local real = SecureStorage + SharedPreferences + borradores (`DraftService`). Re-evaluar cuando converjan dependencias. |

### Deuda Técnica Activa (ver `Tareas_Pendientes.md` para detalle)

Verificación 2026-05-01: **no hay tests rotos** en app (`flutter test` OK) ni deuda P0 abierta en categorías. Lo siguiente es **mejora/backlog**, no bug en producción:

- 🟡 **P1**: Migrar `unstable_cache` → `"use cache"` en `web/src/actions/**` — **sigue pendiente** (~11 archivos con `unstable_cache`; ver `rg unstable_cache web/src`). Alto riesgo; sprint dedicado cuando se habilite `cacheComponents` de forma segura.
- 🟡 **P1 (backlog)**: Rate limit multi-worker — **decisión actual**: in-memory en Vercel (documentado). Upstash Redis solo si aparece tráfico multi-región o ataques que lo justifiquen.
- 🟢 **P2 (opcional)**: Tokens semánticos extra en `AppColors` (`divider` / `disabled` / `hint`) si el diseño los quiere explícitos — **no es corrección de bugs**: `app_theme.dart` ya no tiene HEX sueltos (`Color(0x…)`); colores base están en `app_colors.dart`.
- 🟢 **P2**: Persistencia local tipo Drift + cola sync — **bloqueado** por pin `sqlite3` vs Riverpod codegen (ver decisión cerrada arriba).

