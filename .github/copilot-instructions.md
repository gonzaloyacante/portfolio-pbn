# GitHub Copilot Instructions — Portfolio PBN

> Monorepo: `web/` (Next.js 16 App Router) + `app/` (Flutter Admin).
> Siempre leer `AGENTS.md` antes de implementar cualquier cambio.

---

## REGLAS GLOBALES

- TypeScript Strict Mode en `web/` — **PROHIBIDO** `any` y `@ts-ignore`
- Dart idiomático en `app/` — **PROHIBIDO** `print()`, usar `AppLogger`
- **PROHIBIDO** hardcodear HEX, padding, radius o rutas
- Antes de borrar algo: verificar que no se usa. Borrar en `web/` → `pnpm type-check`. Borrar en `app/` → `flutter analyze`

---

## WEB — Next.js 16

- **Package manager**: `pnpm` exclusivamente. NUNCA `npm` o `yarn`
- Server Actions y Server Components por defecto (App Router)
- Rutas internas en inglés, URLs públicas en español. Usar `ROUTES` de `src/config/routes.ts`
- Componentes UI: `import { X } from '@/components/ui'` (barrel en `src/components/ui/index.ts`)
- Forms: React Hook Form + Zod. Schemas en `src/lib/validations.ts`
- Imágenes: subir vía `/api/upload` (Cloudinary server-side). Nunca exponer credenciales
- **PROHIBIDO** `useEffect` para fetch (usar Server Components)
- **PROHIBIDO** mostrar el `slug` en UI admin — es metadata interna

---

## APP — Flutter

### Límites de Tamaño (ESTRICTOS)
| Tipo | Límite | Acción si supera |
|------|--------|-----------------|
| Pantalla (`*_page.dart`) | 100 líneas | Extraer builders a `*_builders.dart` |
| Widget | 150 líneas | Extraer en archivos separados |
| Provider | 150 líneas | Extraer lógica a helpers |

### Pantallas
- Solo orquestan: escuchan providers, llaman widgets, manejan navegación
- **PROHIBIDO** definir widgets dentro de una pantalla
- **PROHIBIDO** `FutureBuilder` / `StreamBuilder` — usar `AsyncValue.when()`

### Widgets
- Cada widget = **un archivo**. Sin excepciones
- **PROHIBIDO** clases privadas `_Widget` dentro de otro archivo
- Widget reutilizable (>20 líneas) → `shared/widgets/<subcarpeta>/`
- Widget específico de feature → `features/<feature>/presentation/widgets/`

### Estructura `shared/widgets/`
```
shared/widgets/
  widgets.dart          ← barrel principal (exporta desde subcarpetas)
  adaptive_form_layout.dart
  adaptive_grid.dart
  app_card.dart
  draggable_list.dart
  layout/               ← app_scaffold, app_drawer, app_drawer_widgets, nav_items + barrel.dart
  display/              ← section_header, shimmer_loader, stat_card, status_badge, sync_indicator,
                           fade_slide_in, pbn_splash_logo, skeleton_* + barrel.dart
  feedback/             ← empty_state, error_state, loading_overlay, app_snack_bar,
                           confirm_dialog, help_tooltip + barrel.dart
  inputs/               ← app_search_bar, app_filter_chips, color_field, color_picker_field,
                           duration_picker_field, emoji_icon_picker*, font_picker_field*,
                           phone_input_field + barrel.dart
  media/                ← image_upload_widget*, barrel.dart
```
- **Importar SIEMPRE** desde `package:portfolio_pbn/shared/widgets/widgets.dart`
- **PROHIBIDO** importar directamente desde subcarpetas

### Ubicaciones Correctas
- Update dialog → `core/updates/presentation/app_update_dialog.dart`
- App preferences → `features/app_settings/providers/app_preferences_provider.dart`
- Builders de pantalla → mismo directorio que la pantalla, sufijo `_builders.dart`

### State Management
- Riverpod exclusivamente con `@riverpod` (code-gen)
- **PROHIBIDO** `setState` para estado global
- **PROHIBIDO** `Navigator.push()` — usar `context.go()` / `context.push()`

### Design System
```
AppColors.X      ← NUNCA HEX directo
AppSpacing.X     ← NUNCA números de padding directo
AppRadius.X      ← NUNCA radius numérico directo
AppLogger.X()    ← NUNCA print()
RouteNames.X     ← NUNCA strings de ruta hardcodeados
```

### Modelos
- `@freezed` + `@JsonSerializable` obligatorio
- **PROHIBIDO** `Map<String, dynamic>` en lógica de negocio

---

## COMMITS

Formato: `feat(scope): descripción` | `fix(scope): descripción` | `chore(scope): descripción`

Scopes: `web`, `app`, `api`, `db`, `auth`, `theme`, `ci`, `docs`

**Antes de cada commit que afecte `app/`:**
1. `dart run build_runner build --delete-conflicting-outputs`
2. `flutter analyze` → debe ser 0 issues
3. Incrementar `versionCode` en `app/pubspec.yaml` (formato: `X.Y.Z+N`, incrementar `N`)
4. `git add` específico — nunca `git add .`

**Antes de cada commit que afecte `web/`:**
1. `pnpm type-check` → 0 errores
2. `pnpm lint` → 0 warnings

---

## SEGURIDAD

- **NUNCA** subir `.env`, `google-services.json`, `*.pem`, `*.key`
- API `/api/admin/*`: siempre `withAdminJwt()` + `checkApiRateLimit()`
- Server Actions: siempre `await requireAdmin()` + validación Zod
- Tokens en `flutter_secure_storage` — NUNCA en SharedPreferences plano
- Upload imágenes: siempre server-side vía `/api/upload`
