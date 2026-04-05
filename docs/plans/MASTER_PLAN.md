# Portfolio PBN — Plan Maestro (50 Mejoras)

> **Para Claude:** USA el skill `executing-plans` para implementar este plan tarea por tarea.  
> Reemplaza `2025-01-31-portfolio-improvements.md` y `2025-07-15-audit-implementation-plan.md`.

**Goal:** Cerrar brechas de seguridad, inconsistencias, funcionalidades faltantes y mejoras UX identificadas en auditorías exhaustivas del monorepo.

**Architecture:** Monorepo `web/` (Next.js 16 App Router, Prisma/Neon) + `app/` (Flutter, Riverpod, go_router).  
- APIs Flutter-facing en `/api/admin/*` — autenticadas con JWT custom (`withAdminJwt()`)  
- Mutaciones web usan Server Actions con `requireAdmin()` + Zod  
- Package manager web: `pnpm` exclusivamente  
- Flutter state: Riverpod + `@riverpod` code-gen. Navegación: `context.go()` / `context.push()`  
- Imports Flutter desde barrel: `package:portfolio_pbn/shared/widgets/widgets.dart`  
- PROHIBIDO: `any` en TS, `print()` en Dart, HEX hardcodeados, `Navigator.push()`

---

## Índice rápido

> ✅ = Completado y commiteado | ⏳ = Pendiente

| # | Estado | Título | Área | Prioridad |
|---|--------|--------|------|-----------|
| 1 | ✅ | Google reCAPTCHA v3 en formularios públicos | web | 🔴 CRÍTICA |
| 2 | ✅ | Actualizar CSP para reCAPTCHA (next.config.ts) | web | 🔴 CRÍTICA |
| 3 | ✅ | Instagram como 4ª opción de responsePreference | DB + web + app | 🔴 CRÍTICA |
| 4 | ✅ | Quitar CTA WhatsApp de detalle de servicio | web + app | 🟠 ALTA |
| 5 | ✅ | Pull-to-refresh en TODAS las pantallas Flutter | app | 🟠 ALTA |
| 6 | ⏳ | Unificar PhoneInput en booking form Flutter | app | 🟠 ALTA |
| 7 | ⏳ | Editor de pricingTiers en servicio Flutter | app | 🟠 ALTA |
| 8 | ⏳ | Campo videoUrl en formulario de servicio Flutter | app | 🟠 ALTA |
| 9 | ⏳ | Drag-and-drop reorden de galería en Flutter | app | 🟠 ALTA |
| 10 | ⏳ | Verificar toggles EmailSettings en email-service.ts | web | 🟠 ALTA |
| 11 | ⏳ | Verificar endpoint /api/latest-release | web | 🟠 ALTA |
| 12 | ⏳ | FontPickerField en settings_theme_page (13 campos) | app | 🟠 ALTA |
| 13 | ⏳ | Fix botón editar booking + sync formularios | web + app | 🟠 ALTA |
| 14 | ⏳ | Permiso REQUEST_INSTALL_PACKAGES en runtime | app | 🟠 ALTA |
| 15 | ⏳ | Fix botones lentos/dobles (debounce + loading states) | web + app | 🟡 MEDIA |
| 16 | ✅ | Testimonios auto-show en páginas públicas + icono | web | 🟡 MEDIA |
| 17 | ✅ | Galería portfolio: máx 3 cols desktop, 2 mobile | web | 🟡 MEDIA |
| 18 | ✅ | Widget Instagram en página de contacto | web | 🟡 MEDIA |
| 19 | ⏳ | Verificar nombre propietaria editable end-to-end | web + app | 🟡 MEDIA |
| 20 | ⏳ | Animación GSAP expand a pantalla completa | web | 🟡 MEDIA |
| 21 | ⏳ | Lightbox: carga progresiva thumbnail → full | web | 🟡 MEDIA |
| 22 | ✅ | Botones inline aprobar/rechazar en admin testimonios | web | 🟡 MEDIA |
| 23 | ✅ | Filtro de categoría en portfolio público por URL | web | 🟡 MEDIA |
| 24 | ✅ | CTA "Reservar este servicio" pre-rellena booking | web | 🟡 MEDIA |
| 25 | ⏳ | App: pre-poblar servicio en booking form | app | 🟡 MEDIA |
| 26 | ✅ | Dashboard web: widget "Reservas Recientes" | web | 🟡 MEDIA |
| 27 | ✅ | Exportar contactos a CSV desde admin | web | 🟡 MEDIA |
| 28 | ⏳ | Fix imágenes de banderas en PhoneInputField | app | 🟡 MEDIA |
| 29 | ✅ | SEO: JSON-LD para páginas de servicios y categorías | web | 🟢 BAJA |
| 30 | ✅ | Sitemap: lastModified real desde DB para páginas estáticas | web | 🟢 BAJA |
| 31 | ✅ | Preload de fuentes críticas en layout | web | 🟢 BAJA |
| 32 | ✅ | Confirmación "¿Salir sin guardar?" en formularios Flutter | app | 🟢 BAJA |
| 33 | ✅ | Badge de pendientes en items del Drawer | app | 🟢 BAJA |
| 34 | ✅ | EmptyState en calendar_page | app | 🟢 BAJA |
| 35 | ✅ | AppSearchBar en trash_page | app | 🟢 BAJA |
| 36 | ✅ | AppSearchBar en category_gallery_page | app | 🟢 BAJA |
| 37 | ✅ | Localización española en date/time pickers | app | 🟢 BAJA |
| 38 | ✅ | Haptic feedback en acciones clave | app | 🟢 BAJA |
| 39 | ✅ | Botón "Reintentar" al recuperar conectividad | app | 🟢 BAJA |
| 40 | ✅ | Swipe-to-delete en listas Flutter (Dismissible) | app | 🟢 BAJA |
| 41 | ✅ | Menú contextual con long-press en items de listas | app | 🟢 BAJA |
| 42 | ✅ | Buscador de texto en admin lista de servicios | web | 🟢 BAJA |
| 43 | ✅ | Buscador de texto en admin lista de categorías | web | 🟢 BAJA |
| 44 | ⏳ | Vista semanal en calendario admin | web | 🟢 BAJA |
| 45 | ✅ | Copiar email/teléfono en detalle de contacto admin | web | 🟢 BAJA |
| 46 | ⏳ | Página offline personalizada para PWA | web | 🟢 BAJA |
| 47 | ✅ | Pinch-to-zoom en galería de imágenes Flutter | app | 🟢 BAJA |
| 48 | ⏳ | Loading overlay en app_settings al cambiar servidor | app | 🟢 BAJA |
| 49 | ⏳ | Command palette (Cmd+K) para navegación admin | web | 🟢 BAJA |
| 50 | ⏳ | CSP: directive report-to para violaciones | web | 🟢 BAJA |
| 51 | ⏳ | Badges de estado en preview de mensajes (read/important/confirmed) | web + app | 🔴 CRÍTICA |
| 52 | ✅ | Eliminar funcionalidad "Responder" de mensajes | web + app | 🔴 CRÍTICA |
| 53 | ✅ | Fix botón "Editar Reserva" (redirect roto) | web + app | 🔴 CRÍTICA |
| 54 | ⏳ | Sincronizar campos del formulario reserva creación = edición | web + app | 🔴 CRÍTICA |
| 55 | ⏳ | Nombre propietaria editable en header/navbar (CMS setting) | web + app | 🟠 ALTA |
| 56 | ⏳ | Fix sistema de temas completo — cada color muestra dónde se usa | web + app | 🟠 ALTA |
| 57 | ⏳ | FontPicker con componente Google Fonts (no textfield plano) | app | 🟠 ALTA |
| 58 | ⏳ | REQUEST_INSTALL_PACKAGES en primer lanzamiento con mensaje amigable | app | 🟠 ALTA |
| 59 | ⏳ | Fix imágenes de banderas PhoneInputField (lib correcta + estilos web) | app | 🟠 ALTA |
| 60 | ⏳ | Animación GSAP "expand" galería imagen → pantalla completa | web | 🟠 ALTA |
| 61 | ⏳ | Lightbox: thumbnail mientras carga full-res + pre-fetch adyacentes | web | 🟠 ALTA |
| 62 | ⏳ | Formularios Flutter tablet: max-width + layout 2 columnas | app | 🟠 ALTA |
| 63 | ⏳ | Drag-and-drop galería: placeholder animado + push de imágenes | app | 🟠 ALTA |
| 64 | ⏳ | Orientación imagen (portrait/landscape/square) en galería Flutter | app | 🟠 ALTA |
| 65 | ⏳ | Pantalla Home CMS rediseño para coincidir con admin web | app | 🟠 ALTA |
| 66 | ⏳ | Pantalla Login rediseño (panel izquierdo, sin rosa cegador) | app | 🟠 ALTA |
| 67 | ⏳ | Auditoría debounce + loading states en botones (web + app) | web + app | 🟠 ALTA |
| 68 | ⏳ | Mensaje de confirmación testimonios + icono estético (no check) | web | 🟡 MEDIA |
| 69 | ⏳ | Auditoría GSAP web completa + plan de animaciones scroll-triggered | web | 🟡 MEDIA |
| 70 | ⏳ | Modal "¿Dónde se usa este color?" en configuración de tema (web) | web | 🟡 MEDIA |
| 71 | ⏳ | Bottom sheet "¿Dónde se usa este color?" en configuración de tema (app) | app | 🟡 MEDIA |
| 72 | ⏳ | Tracking read/unread mensajes en DB + API | web | 🟡 MEDIA |
| 73 | ⏳ | Toggle "Importante" en mensajes admin | web + app | 🟡 MEDIA |
| 74 | ⏳ | Campo instagramUsername en formulario de contacto público | web | 🟡 MEDIA |
| 75 | ⏳ | Schema DB: campo `instagramUsername` en modelo Contact | web | 🟡 MEDIA |
| 76 | ⏳ | Admin contactos: mostrar Instagram handle en lista y detalle | web | 🟡 MEDIA |
| 77 | ⏳ | App contactos: mostrar Instagram handle en detalle | app | 🟡 MEDIA |
| 78 | ⏳ | Formulario reserva: sección de precios/dinero en creación | web + app | 🟡 MEDIA |
| 79 | ⏳ | Animaciones scroll-triggered GSAP en páginas públicas | web | 🟡 MEDIA |
| 80 | ⏳ | Gallery web: pre-fetch imágenes alta calidad con IntersectionObserver | web | 🟡 MEDIA |
| 81 | ⏳ | Responsive tablet landscape: auditoría de TODAS las pantallas Flutter | app | 🟡 MEDIA |
| 82 | ✅ | Pull-to-refresh en TODAS las pantallas Flutter | app | 🟡 MEDIA |
| 83 | ⏳ | App galería reorden: preview animada de posición nueva | app | 🟢 BAJA |
| 84 | ✅ | Admin servicios (web): búsqueda y filtro client-side | web | 🟢 BAJA |
| 85 | ⏳ | Admin reservas: bulk status update | web | 🟢 BAJA |
| 86 | ⏳ | App reservas: swipe para cambiar estado | app | 🟢 BAJA |
| 87 | ⏳ | Web público: lazy load imágenes con blur placeholder | web | 🟢 BAJA |
| 88 | ⏳ | App: skeleton screens en todas las páginas de lista | app | 🟢 BAJA |
| 89 | ⏳ | PWA: prompt "Añadir a inicio" + instrucciones iOS | web | 🟢 BAJA |
| 90 | ⏳ | Admin web: toggle manual dark/light mode | web | 🟢 BAJA |
| 91 | ⏳ | App: modo oscuro sigue exactamente la preferencia del sistema | app | 🟢 BAJA |
| 92 | ⏳ | Reservas: integración Google Calendar / Apple Calendar | web + app | 🟢 BAJA |
| 93 | ⏳ | App: opción de login biométrico (FaceID / huella) | app | 🟢 BAJA |
| 94 | ⏳ | Admin web: atajos de teclado adicionales (Cmd+S, Cmd+N) | web | 🟢 BAJA |
| 95 | ⏳ | App: tour de onboarding en el primer arranque | app | 🟢 BAJA |
| 96 | ✅ | AppSearchBar en category_gallery_page | app | 🟢 BAJA |
| 97 | ✅ | Badge pendientes en items del Drawer | app | 🟢 BAJA |
| 98 | ✅ | Botón "Reintentar" al recuperar conectividad | app | 🟢 BAJA |
| 99 | ✅ | Pinch-to-zoom en galería de imágenes Flutter | app | 🟢 BAJA |
| 100 | ⏳ | GSAP stagger animation al cargar imágenes en galería | web | 🟢 BAJA |

---

## Árbol de dependencias

```
3 (Instagram DB) ──→ 4 (WhatsApp CTA) 
                 ──→ 18 (Widget Instagram contacto)
1 (reCAPTCHA) ──→ 2 (CSP update)
11 (latest-release API) ──→ 14 (permiso runtime)
6 (PhoneInput unify) — independiente
5 (Pull-to-refresh) — independiente
```

---

## TAREA 1 — Google reCAPTCHA v3 en formularios públicos

**Por qué**: `ContactForm` y `TestimonialForm` tienen cero protección anti-bot. `grep` en todo el codebase da 0 matches para `recaptcha`, `captcha`, `turnstile`. Solo existe rate-limiting server-side.  
**Paquete**: `react-google-recaptcha-v3` — invisible para usuarios reales, token en header, verificación server-side.

**Archivos:**
- Crear: `web/src/lib/recaptcha.ts`
- Modificar: `web/src/components/features/contact/ContactForm.tsx`
- Modificar: `web/src/components/features/testimonials/TestimonialForm.tsx`
- Modificar: `web/src/actions/user/contact.ts`
- Modificar: `web/src/actions/user/testimonials.ts` (si existe acción pública)
- Modificar: `web/src/app/layout.tsx` (añadir `GoogleReCaptchaProvider`)
- Modificar: `web/.env` (añadir vars)

**Step 1: Instalar**
```bash
cd web && pnpm add react-google-recaptcha-v3
```

**Step 2: Crear `web/src/lib/recaptcha.ts`**
```typescript
export async function verifyRecaptchaToken(token: string): Promise<boolean> {
  if (!process.env.RECAPTCHA_SECRET_KEY) return false
  const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
  })
  const data = (await res.json()) as { success: boolean; score: number }
  return data.success && data.score >= 0.5
}
```

**Step 3: Añadir vars en `web/.env`**
```
NEXT_PUBLIC_RECAPTCHA_SITE_KEY="6L..."   # pública, usada en cliente
RECAPTCHA_SECRET_KEY="6L..."              # privada, NUNCA al cliente
```

**Step 4: Envolver layout con provider** (`web/src/app/layout.tsx`)
```tsx
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
// ...
<GoogleReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}>
  {children}
</GoogleReCaptchaProvider>
```

**Step 5: Usar en `ContactForm.tsx`**
```tsx
'use client'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
// ...
const { executeRecaptcha } = useGoogleReCaptcha()
// en handleSubmit:
const token = await executeRecaptcha('contact_form')
formData.append('recaptchaToken', token)
```

**Step 6: Verificar en `contact.ts` action**
```typescript
const token = formData.get('recaptchaToken') as string
const isHuman = await verifyRecaptchaToken(token)
if (!isHuman) return { error: 'Verificación fallida. Inténtalo de nuevo.' }
```

**Step 7 (igual para `TestimonialForm.tsx` + acción pública)**  
Misma lógica con `executeRecaptcha('testimonial_form')`.

**Verificación:**
- `pnpm type-check` → 0 errores
- `pnpm lint` → 0 warnings
- Probar envío en localhost — debe pasar
- Probar con token vacío/falso — debe rechazar

---

## TAREA 2 — Actualizar CSP para Google reCAPTCHA v3

**Por qué**: `next.config.ts` tiene CSP completo pero NO incluye los dominios de Google reCAPTCHA. Sin esto el script falla en producción con error de CSP.

**Archivo:** `web/next.config.ts`

**Cambios en la directiva `script-src`** — añadir:
```
https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/
```

**Cambios en `connect-src`** — añadir:
```
https://www.google.com/recaptcha/ https://www.gstatic.com/
```

**Cambios en `frame-src`** — añadir:
```
https://www.google.com/recaptcha/ https://recaptcha.google.com/
```

Buscar el objeto `headers` en `next.config.ts` y localizar la directiva que construye `Content-Security-Policy`.

**Verificación:**
- `pnpm build` sin errores CSP en consola de navegador
- `pnpm type-check` → 0 errores
- Test manual: abrir ContactForm en localhost, verificar que reCAPTCHA widget carga

---

## TAREA 3 — Instagram como 4ª opción de responsePreference

**Por qué**: DB solo tiene `EMAIL | PHONE | WHATSAPP`. Formulario de contacto web tiene 3 botones. App booking form no tiene Instagram. Muchos clientes prefieren Instagram DM.

**Archivos:**
- `web/prisma/schema/content.prisma` — modelo `Contact` + `ContactSettings`
- `web/src/components/features/contact/ContactForm.tsx`
- `web/src/lib/validations.ts`
- `web/src/actions/user/contact.ts`
- `app/lib/features/calendar/presentation/booking_form_page.dart`
- `app/lib/features/contacts/data/contact_model.dart` (o similar)

**Step 1: Migración DB**
```prisma
// content.prisma — modelo Contact:
instagramUser      String?   // @usuario de Instagram, presente si responsePreference == 'INSTAGRAM'
responsePreference String    @default("EMAIL") // EMAIL | PHONE | WHATSAPP | INSTAGRAM

// settings.prisma — modelo ContactSettings:
instagramUsername  String?   @default("")  // IG del estudio para widget público
```
```bash
cd web && pnpm prisma migrate dev --name add_instagram_contact
pnpm type-check
```

**Step 2: `ContactForm.tsx`** — añadir 4º botón y campo condicional
```tsx
type ResponsePreference = 'EMAIL' | 'PHONE' | 'WHATSAPP' | 'INSTAGRAM'
// Añadir botón Instagram en el grupo de preferencia de respuesta
// Añadir campo condicional:
{preference === 'INSTAGRAM' && (
  <Input name="instagramUser" placeholder="@tu_usuario_de_instagram" />
)}
```

**Step 3: Actualizar validación en `validations.ts`**
```typescript
responsePreference: z.enum(['EMAIL', 'PHONE', 'WHATSAPP', 'INSTAGRAM'])
instagramUser: z.string().optional()
```

**Step 4: Actualizar `contact.ts` action** — guardar `instagramUser` en DB.

**Step 5: Flutter `booking_form_page.dart`** — añadir opción INSTAGRAM al dropdown/radio de `responsePreference`. Mostrar campo `TextFormField` de usuario Instagram si seleccionado.

**Step 6: Actualizar modelo Flutter** — añadir `instagramUser: String?` al modelo `Contact`/`Booking` Freezed. Correr `build_runner`.

**Verificación:**
- `pnpm type-check` → 0 errores
- `flutter analyze` → 0 issues
- Enviar formulario con preferencia INSTAGRAM → verificar en DB

---

## TAREA 4 — Quitar CTA WhatsApp de detalle de servicio

**Por qué**: la página pública de servicio tiene dos CTAs: "Agendar Cita" y "Consultar por WhatsApp". Queda mejor un solo CTA claro.

**Archivos:**
- `web/src/app/(public)/services/[slug]/page.tsx` — eliminar botón WhatsApp (variant="outline")
- `app/lib/features/services/presentation/service_detail_page.dart` — si existe botón WhatsApp, eliminarlo

**Verificación:**
- `pnpm type-check` → 0 errores
- `flutter analyze` → 0 issues

---

## TAREA 5 — Pull-to-refresh en TODAS las pantallas Flutter

**Por qué**: Solo 5 pantallas tienen `RefreshIndicator`. Las siguientes ~17 NO lo tienen y muestran datos obsoletos al volver de una edición:

**Pantallas que necesitan RefreshIndicator:**
- `calendar_page.dart`
- `booking_detail_page.dart`
- `contact_detail_page.dart`
- `category_gallery_page.dart`
- `trash_page.dart`
- `trash_item_detail_page.dart`
- `account_page.dart`
- `help_page.dart`
- `settings_page.dart`
- `settings_home_page.dart`
- `settings_site_page.dart`
- `settings_about_page.dart`
- `settings_contact_page.dart`
- `settings_social_page.dart`
- `settings_theme_page.dart`
- `app_settings_page.dart`
- `app_update_page.dart`

**Patrón a aplicar en cada pantalla:**
```dart
// En el cuerpo principal del Scaffold, envolver el contenido con:
RefreshIndicator(
  onRefresh: () async {
    ref.invalidate(/* provider de datos de esta pantalla */);
    await ref.read(/* provider */.future);
  },
  child: /* contenido actual */,
)
```

Para pantallas que no tengan un ListView (usan SingleChildScrollView o Column), envolver `SingleChildScrollView` con `physics: const AlwaysScrollableScrollPhysics()`.

**Ejemplo para `settings_home_page.dart`:**
```dart
RefreshIndicator(
  onRefresh: () async {
    ref.invalidate(homeSettingsProvider);
    await ref.read(homeSettingsProvider.future);
  },
  child: SingleChildScrollView(
    physics: const AlwaysScrollableScrollPhysics(),
    child: /* contenido existente */,
  ),
)
```

**Verificación:**
- `flutter analyze` → 0 issues
- Pull-to-refresh funciona en emulador en las 17 pantallas

---

## TAREA 6 — Unificar PhoneInput en booking form Flutter

**Por qué**: `booking_form_page.dart` usa `intl_phone_field` directamente en lugar del widget compartido `PhoneInputField` (ya existe en `shared/widgets/inputs/`).

**Archivo:** `app/lib/features/calendar/presentation/booking_form_page.dart`

**Cambio:**
```dart
// ANTES: IntlPhoneField(...)
// DESPUÉS:
import 'package:portfolio_pbn/shared/widgets/widgets.dart';
// ...
PhoneInputField(
  label: 'Teléfono',
  onChanged: (value) => _phoneCtrl.text = value,
  initialValue: _phoneCtrl.text,
)
```

Verificar que el formato de valor resultante (`+34 612345678`) es compatible con el que espera el backend.

**Verificación:**
- `flutter analyze` → 0 issues
- El formulario de reserva muestra selector de país + input unificado

---

## TAREA 7 — Editor de pricingTiers en formulario de servicio Flutter

**Por qué**: La web admin tiene editor de tiers (UI completa). La app Flutter no tiene forma de crear/editar tiers.

**Archivos:**
- `app/lib/features/services/presentation/service_form_page.dart`
- Crear: `app/lib/features/services/presentation/widgets/pricing_tiers_editor.dart`

**Estructura del widget:**
```dart
// pricing_tiers_editor.dart
class PricingTiersEditor extends StatefulWidget {
  final List<Map<String, dynamic>> initialTiers;
  final void Function(List<Map<String, dynamic>>) onChanged;
  // ...
}
```

Cada tier tiene: `name` (String), `price` (String), `description` (String).  
El editor muestra lista de tiers con botones "Añadir tier" y "Eliminar". Reorderable con `ReorderableListView`.

**Verificación:**
- `flutter analyze` → 0 issues
- Se pueden crear, editar y eliminar tiers
- Los tiers se guardan correctamente al enviar el formulario

---

## TAREA 8 — Campo videoUrl en formulario de servicio Flutter

**Por qué**: La web admin tiene campo de videoUrl para servicios. La app Flutter no lo expone.

**Archivo:** `app/lib/features/services/presentation/service_form_page.dart`

**Cambio:** Añadir `TextFormField` o picker de video para `videoUrl`. Usar `image_picker` con `ImageSource.camera/gallery` tipo video.

```dart
TextFormField(
  controller: _videoUrlCtrl,
  decoration: const InputDecoration(label: Text('URL de video (opcional)')),
  keyboardType: TextInputType.url,
)
```

Confirmar que el modelo `ServiceModel` tiene campo `videoUrl: String?`.

**Verificación:**
- `flutter analyze` → 0 issues
- `build_runner build` sin conflictos

---

## TAREA 9 — Drag-and-drop reorden de galería en Flutter

**Por qué**: La galería de imágenes de una categoría no puede reordenarse desde la app. Solo desde web admin.

**Archivos:**
- `app/lib/features/categories/presentation/category_gallery_page.dart`
- API: `web/src/app/api/admin/categories/[id]/gallery/reorder/route.ts` (verificar si existe, si no crear)

**Flutter (UI):**
```dart
// Reemplazar ListView con ReorderableListView o usar DraggableList del design system
import 'package:portfolio_pbn/shared/widgets/widgets.dart';
// DraggableList ya existe en shared/widgets/draggable_list.dart
DraggableList(
  items: galleryImages,
  onReorder: (oldIndex, newIndex) async {
    // Actualizar orden localmente
    // Llamar API PATCH /api/admin/categories/{id}/gallery/reorder
  },
)
```

**Web API** — si no existe `reorder/route.ts`:
```typescript
// PATCH /api/admin/categories/[id]/gallery/reorder
// Body: { imageIds: string[] }  (en orden deseado)
// Auth: withAdminJwt()
```

**Verificación:**
- `flutter analyze` → 0 issues
- `pnpm type-check` → 0 errores si se toca web
- Drag y drop en emulador reordena imágenes y persiste tras refresh

---

## TAREA 10 — Verificar toggles EmailSettings en email-service.ts

**Por qué**: En `EmailSettings` existen toggles `notifyOnContact`, `notifyOnBooking`, `notifyOnTestimonial`. Se debe verificar que `email-service.ts` las respete antes de enviar.

**Archivo:** `web/src/lib/email-service.ts`

**Verificación:**
1. Leer `email-service.ts` completo
2. Confirmar que antes de cada envío se consulta `EmailSettings` y se verifica el toggle correspondiente
3. Si algún toggle no se comprueba, añadir la verificación
4. `pnpm type-check` → 0 errores

---

## TAREA 11 — Verificar endpoint /api/latest-release

**Por qué**: `app_update_repository.dart` hace `GET /api/latest-release?version=X&versionCode=Y`. Se debe confirmar que el endpoint existe, devuelve el formato correcto y lee de `AppRelease` en DB.

**Archivos:**
- `web/src/app/api/latest-release/route.ts` (o `web/src/app/api/admin/app/latest-release/route.ts`)
- `app/lib/core/updates/app_update_repository.dart`

**Formato esperado por Flutter:**
```json
{ "version": "1.2.3", "versionCode": 10, "downloadUrl": "https://...", "releaseNotes": "...", "sha256": "abc..." }
```

Si el endpoint no existe, crearlo leyendo desde `prisma.appRelease.findFirst({ orderBy: { createdAt: 'desc' } })`.

**Verificación:**
- `curl https://localhost:3000/api/latest-release?version=1.0.0&versionCode=1` devuelve JSON correcto
- `pnpm type-check` → 0 errores

---

## TAREA 12 — FontPickerField en settings_theme_page (13 campos)

**Por qué**: `settings_theme_page.dart` tiene 13 `TextFormField` planos para fuentes (headingFont, bodyFont, scriptFont, brandFont, portfolioFont, signatureFont + 6 campos de tamaño + borderRadius). El widget `FontPickerField` ya existe en `shared/widgets/inputs/font_picker_field.dart` pero no se usa aquí.

**Archivo:** `app/lib/features/settings/presentation/settings_theme_page.dart`

**Cambio:** Reemplazar los `TextFormField` de nombre de fuente (NO los de tamaño numérico) con `FontPickerField`:
```dart
import 'package:portfolio_pbn/shared/widgets/widgets.dart';
// ...
FontPickerField(
  label: 'Fuente de títulos',
  controller: _headingFontCtrl,
  onChanged: (_) => /* trigger preview */,
)
```

Los campos de tamaño (`headingFontSize`, etc.) pueden permanecer como `TextFormField` con `keyboardType: TextInputType.number`.

**Verificación:**
- `flutter analyze` → 0 issues
- El picker muestra preview de la fuente seleccionada

---

## TAREA 13 — Fix botón editar booking + sync formularios

**Por qué**: El botón de editar reserva en web tiene un redirect roto. Además, el formulario de edición no tiene los mismos campos que el de creación (falta sección de pago).

**Archivos:**
- `web/src/components/features/contact/bookings/CalendarView.tsx` (o BookingDetail)
- `web/src/app/(admin)/admin/calendar/` (ruta de edición)

**Verificación:**
1. Localizar el botón "Editar" en el detalle de booking en web
2. Verificar que el `href` del Link es correcto y lleva al formulario de edición
3. Comparar campos de creación vs edición — sincronizar los faltantes
4. `pnpm type-check` → 0 errores

---

## TAREA 14 — Permiso REQUEST_INSTALL_PACKAGES en runtime

**Por qué**: El AndroidManifest declara `REQUEST_INSTALL_PACKAGES` pero la app lanza `open_file` sin verificar el permiso en tiempo de ejecución → crash en Android 8+.

**Archivo:** `app/lib/core/updates/presentation/app_update_dialog.dart` (o `app_update_dialog_phases.dart`)

**Cambio:**
```dart
import 'package:permission_handler/permission_handler.dart';
// ...
// Antes de llamar open_file:
final status = await Permission.requestInstallPackages.status;
if (!status.isGranted) {
  final result = await Permission.requestInstallPackages.request();
  if (!result.isGranted) {
    // Mostrar AppSnackBar con instrucción para activar manualmente
    return;
  }
}
// Continuar con open_file
```

Verificar que `permission_handler` está en `pubspec.yaml` y en AndroidManifest.

**Verificación:**
- `flutter analyze` → 0 issues
- En Android 8+ no crashea al instalar actualización

---

## TAREA 15 — Fix botones lentos/dobles (debounce + loading states)

**Por qué**: Botones de formularios en web y app permiten doble envío.

**Web:** Usar `useTransition` de React o `disabled` durante submit en forms con React Hook Form:
```tsx
const { formState: { isSubmitting } } = useForm()
<Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
  {isSubmitting ? 'Enviando...' : 'Enviar'}
</Button>
```

**Flutter:** En los `ElevatedButton`/`FilledButton` de formularios:
```dart
bool _isLoading = false;

FilledButton(
  onPressed: _isLoading ? null : _save,
  child: _isLoading 
    ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2))
    : const Text('Guardar'),
)
```

**Archivos a revisar:**
- `web/src/components/features/contact/ContactForm.tsx`
- `web/src/components/features/testimonials/TestimonialForm.tsx`
- `app/lib/features/calendar/presentation/booking_form_page.dart`
- `app/lib/features/services/presentation/service_form_page.dart`
- `app/lib/features/categories/presentation/category_form_page.dart`

**Verificación:**
- `pnpm type-check` + `flutter analyze` → 0 errores

---

## TAREA 16 — Testimonios auto-show en páginas públicas + icono confirmación

**Por qué**: Los testimonios solo aparecen en `/sobre-mi` cuando `showOnAbout: true`. Hay lógica de `showOnAll` o similar en `TestimonialSettings` que no se activa en el layout principal.

**Archivos:**
- `web/prisma/schema/settings.prisma` — modelo `TestimonialSettings`
- `web/src/app/(public)/layout.tsx` o componente raíz del área pública
- `web/src/app/(public)/services/[slug]/page.tsx` — excluir el bloque

**Step 1:** Verificar campos en `TestimonialSettings` (probablemente ya existe `showOnHome`, `showOnServices`, etc.)  
**Step 2:** En el layout público (o en cada página relevante), leer los testimonios aprobados y renderizar `<AboutTestimonialsSection>` si la configuración lo indica.  
**Step 3:** Cambiar el icono de confirmación de testimonio enviado (de checkmark genérico a confeti/corazón).

**Verificación:**
- Testimonios aparecen en home/sobre-mí/servicios si la config lo indica
- `pnpm type-check` → 0 errores

---

## TAREA 17 — Galería portfolio: máx 3 cols desktop, 2 mobile

**Por qué**: La galería actualmente admite hasta 4 columnas (`xl:columns-4`). Visualmente se satura.

**Archivo:** `web/src/components/features/portfolio/CategoryGallery.tsx` (o donde esté el masonry)

**Cambio:**
```tsx
// ANTES: podría tener xl:columns-4
// DESPUÉS:
className="columns-1 sm:columns-2 md:columns-3"
// Máximo 3 columnas en desktop, 2 en tablet
```

También verificar `CategorySettings.gridColumns` — si la DB permite `gridColumns: 4`, limitar la validación a máx 3.

**Verificación:**
- `pnpm type-check` → 0 errores
- Visual: galería nunca supera 3 columnas en desktop

---

## TAREA 18 — Widget Instagram en página de contacto

**Por qué**: La página de contacto muestra email, teléfono y WhatsApp, pero no Instagram. Con el campo `instagramUsername` en `ContactSettings` (añadido en Tarea 3), ya tenemos el dato disponible.

**Archivo:** `web/src/app/(public)/contacto/page.tsx` (o `contact/page.tsx`)

**Cambio:** Añadir card/widget de Instagram junto a los otros métodos de contacto:
```tsx
{contactSettings.instagramUsername && (
  <a href={`https://instagram.com/${contactSettings.instagramUsername}`} target="_blank">
    <card con icono Instagram + @usuario>
  </a>
)}
```

**Verificación:**
- `pnpm type-check` → 0 errores
- Si `instagramUsername` está vacío, el widget no aparece

---

## TAREA 19 — Verificar nombre propietaria editable end-to-end

**Por qué**: El navbar web ya lee `brandName` de `SiteSettings`. Verificar que el formulario de edición en admin guarda correctamente y que la app Flutter también actualiza el nombre.

**Archivos:**
- `web/src/app/(admin)/admin/settings/site/page.tsx`
- `web/src/actions/settings/site.ts`
- `app/lib/features/settings/presentation/settings_site_page.dart`

**Verificación:**
1. Cambiar `brandName` en admin web → verificar que el navbar lo refleja
2. Cambiar en app Flutter → verificar que lleva al mismo endpoint y persiste
3. `pnpm type-check` + `flutter analyze` → 0 errores

---

## TAREA 20 — Animación GSAP expand a pantalla completa (galería)

**Por qué**: Al hacer clic en una imagen de la galería, la transición al lightbox es instantánea. Una animación de expand GSAP mejoraría la UX.

**Archivo:** `web/src/components/ui/Lightbox.tsx` (o donde esté el lightbox trigger)

**Cambio:**
```tsx
import { gsap } from 'gsap'
// En el handler de apertura del lightbox:
gsap.fromTo(clickedImageRef.current, 
  { scale: 1, borderRadius: '1rem' },
  { scale: 1.05, duration: 0.2, ease: 'power2.out', onComplete: () => openLightbox() }
)
```

O animación de "zoom desde origen":
- Guardar `getBoundingClientRect()` de la imagen clickeada
- Animar desde esas coordenadas hasta pantalla completa con GSAP `.fromTo()`

**Verificación:**
- Animación fluida a 60fps sin jank
- Funciona desde touch (mobile) y click (desktop)
- `pnpm type-check` → 0 errores

---

## TAREA 21 — Lightbox: carga progresiva thumbnail → full

**Por qué**: Al abrir el lightbox se espera la imagen full-size. Mejora mostrar el thumbnail blurred mientras carga.

**Archivo:** `web/src/components/ui/Lightbox.tsx`

**Cambio:**
```tsx
// Mostrar imagen de baja resolución (thumbnail) como placeholder mientras carga la full
<Image
  src={thumbnailUrl}  // versión pequeña de Cloudinary: añadir ?w=100&q=10
  alt=""
  fill
  className="blur-md scale-110 transition-all duration-300"
  style={{ opacity: isFullLoaded ? 0 : 1 }}
/>
<Image
  src={fullUrl}
  alt={caption}
  fill
  className="transition-opacity duration-300"
  style={{ opacity: isFullLoaded ? 1 : 0 }}
  onLoad={() => setIsFullLoaded(true)}
/>
```

**Verificación:**
- Blur visible al abrir, desaparece al cargar la full
- `pnpm type-check` → 0 errores

---

## TAREA 22 — Botones inline aprobar/rechazar en admin testimonios

**Por qué**: La página `/admin/testimonials` muestra badges APPROVED/REJECTED/PENDING pero no tiene botones inline para cambiar el status. Solo tiene `toggleTestimonial` (que alterna `isActive`) y `deleteTestimonial`.

**Archivos:**
- `web/src/app/(admin)/admin/testimonials/page.tsx`
- `web/src/actions/cms/testimonials.ts` (añadir `approveTestimonial` + `rejectTestimonial`)

**Step 1: Añadir server actions en `testimonials.ts`:**
```typescript
export async function approveTestimonial(id: string) {
  await requireAdmin()
  await prisma.testimonial.update({ where: { id }, data: { status: 'APPROVED' } })
  revalidatePath('/admin/testimonials')
}
export async function rejectTestimonial(id: string) {
  await requireAdmin()
  await prisma.testimonial.update({ where: { id }, data: { status: 'REJECTED' } })
  revalidatePath('/admin/testimonials')
}
```

**Step 2: Añadir botones en UI** (solo visibles cuando `status === 'PENDING'`):
```tsx
{t.status === 'PENDING' && (
  <>
    <form action={approveTestimonial.bind(null, t.id)}>
      <Button type="submit" size="sm" variant="success">✓ Aprobar</Button>
    </form>
    <form action={rejectTestimonial.bind(null, t.id)}>
      <Button type="submit" size="sm" variant="destructive">✕ Rechazar</Button>
    </form>
  </>
)}
```

**Verificación:**
- `pnpm type-check` → 0 errores
- Aprobar/rechazar funciona sin recargar la página

---

## TAREA 23 — Filtro de categoría en portfolio público por URL

**Por qué**: Al compartir un enlace del portfolio no se puede apuntar a una categoría específica. Añadir `?category=slug` permite URLs compartibles.

**Archivos:**
- `web/src/app/(public)/portfolio/page.tsx`

**Cambio:**
```tsx
// Server component — leer searchParams
export default async function PortfolioPage({ searchParams }: { searchParams: { category?: string } }) {
  const activeCategory = searchParams.category
  // Filtrar categorías o resaltar la activa
}
```

Los chips/tabs de categoría pasan `?category=slug` en el href.

**Verificación:**
- `/portfolio?category=retratos` muestra solo la categoría correspondiente resaltada
- Al cambiar de categoría la URL se actualiza
- `pnpm type-check` → 0 errores

---

## TAREA 24 — CTA "Reservar este servicio" pre-rellena booking

**Por qué**: El botón "Agendar Cita" en la página pública de servicio lleva a `/contacto` sin pre-rellenar el servicio.

**Archivos:**
- `web/src/app/(public)/services/[slug]/page.tsx`

**Cambio:**
```tsx
// ANTES:
<Link href={ROUTES.public.contact}>Agendar Cita</Link>
// DESPUÉS:
<Link href={`${ROUTES.public.contact}?service=${service.slug}`}>
  Agendar Cita
</Link>
```

Este parámetro ya es leído por `ContactForm.tsx` (`useSearchParams` para `?service=slug`) — confirmar que pre-rellena el selector de servicio.

**Verificación:**
- `pnpm type-check` → 0 errores
- Clic en "Agendar Cita" → formulario de contacto con servicio pre-seleccionado

---

## TAREA 25 — App: pre-poblar servicio en booking form

**Por qué**: Cuando se navega desde `service_detail_page` al formulario de reserva, no se pre-selecciona el servicio.

**Archivo:** `app/lib/features/calendar/presentation/booking_form_page.dart`

**Cambio:**
```dart
// El GoRouter pasa el serviceId o serviceSlug como extra o query param:
// En service_detail_page.dart:
context.push(RouteNames.bookingForm, extra: {'serviceId': service.id})

// En booking_form_page.dart:
@override
void initState() {
  super.initState();
  final extra = GoRouterState.of(context).extra as Map<String, dynamic>?;
  if (extra?['serviceId'] != null) {
    _selectedServiceId = extra!['serviceId'] as String;
  }
}
```

**Verificación:**
- `flutter analyze` → 0 issues
- Navegar desde detalle de servicio → booking form tiene el servicio pre-seleccionado

---

## TAREA 26 — Dashboard web: widget "Reservas Recientes"

**Por qué**: El dashboard solo muestra contadores (`pendingBookings: N`). No hay lista de reservas recientes.

**Archivos:**
- `web/src/app/(admin)/admin/dashboard/page.tsx` (o componente de dashboard)
- Crear: `web/src/components/features/dashboard/RecentBookingsWidget.tsx`

**Cambio:**
```tsx
// Leer las últimas 5 reservas con estado PENDING o CONFIRMED
const recentBookings = await prisma.booking.findMany({
  where: { deletedAt: null, status: { in: ['PENDING', 'CONFIRMED'] } },
  orderBy: { createdAt: 'desc' },
  take: 5,
  include: { /* campos necesarios */ }
})
```

El widget muestra nombre del cliente, servicio, fecha y badge de estado.

**Verificación:**
- `pnpm type-check` → 0 errores
- Widget visible en dashboard con las 5 últimas reservas

---

## TAREA 27 — Exportar contactos a CSV desde admin

**Por qué**: El admin no puede exportar los mensajes de contacto para análisis externo.

**Archivos:**
- `web/src/actions/cms/contacts.ts` — añadir `exportContactsToCSV()`
- `web/src/app/(admin)/admin/contacts/page.tsx` — añadir botón de descarga

**Step 1: Server Action:**
```typescript
export async function exportContactsToCSV(): Promise<string> {
  await requireAdmin()
  const contacts = await prisma.contact.findMany({
    where: { deletedAt: null },
    orderBy: { createdAt: 'desc' }
  })
  const header = 'Nombre,Email,Teléfono,Mensaje,Fecha,Estado\n'
  const rows = contacts.map(c =>
    `"${c.name}","${c.email}","${c.phone ?? ''}","${c.message.replace(/"/g, '""')}","${c.createdAt.toISOString()}","${c.isRead ? 'Leído' : 'No leído'}"`
  )
  return header + rows.join('\n')
}
```

**Step 2: Botón de descarga en UI:**
```tsx
<Button variant="outline" size="sm" onClick={async () => {
  const csv = await exportContactsToCSV()
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a'); a.href = url; a.download = 'contactos.csv'; a.click()
}}>Exportar CSV</Button>
```

**Verificación:**
- `pnpm type-check` → 0 errores
- Descarga CSV con todos los contactos correctamente formateados

---

## TAREA 28 — Fix imágenes de banderas en PhoneInputField

**Por qué**: Las banderas en `PhoneInputField` del app Flutter no se cargan (imágenes rotas o faltantes).

**Archivo:** `app/lib/shared/widgets/inputs/phone_input_field.dart`

**Verificación:**
1. Revisar cómo se cargan los assets de banderas (inline SVG, paquete `country_flags`, assets locales)
2. Si usa `Image.asset`, verificar que los archivos existen en `app/assets/`
3. Si usa un paquete, verificar que está declarado en `pubspec.yaml`
4. `flutter analyze` → 0 issues

---

## TAREA 29 — SEO: JSON-LD para servicios y categorías

**Por qué**: Solo la página de inicio tiene JSON-LD (`Person`). Los servicios y categorías no tienen schema markup.

**Archivo:** `web/src/lib/seo.ts` y páginas de servicios/categorías

**Cambio:**
```typescript
// Para services/[slug]/page.tsx — schema Service:
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": service.name,
  "description": service.description,
  "provider": { "@type": "Person", "name": ownerName },
  "offers": pricingTiers.map(tier => ({
    "@type": "Offer",
    "name": tier.name,
    "price": tier.price
  }))
}

// Para portfolio/[category]/page.tsx — schema ImageGallery:
{
  "@context": "https://schema.org",
  "@type": "ImageGallery",
  "name": category.name,
  "description": category.description
}
```

Inyectar con `<script type="application/ld+json">`.

**Verificación:**
- `pnpm type-check` → 0 errores
- Google Rich Results Test valida el schema

---

## TAREA 30 — Sitemap: lastModified real para páginas estáticas

**Por qué**: `web/src/app/sitemap.ts` usa `new Date()` (siempre hoy) para las páginas estáticas. Debería usar la fecha real del último cambio en `SiteSettings` / `HomeSettings`.

**Archivo:** `web/src/app/sitemap.ts`

**Cambio:**
```typescript
const siteSettings = await prisma.siteSettings.findFirst()
const lastModified = siteSettings?.updatedAt ?? new Date()

// En las rutas estáticas:
{ url: ROUTES.public.home, lastModified, changeFrequency: 'monthly', priority: 1 }
{ url: ROUTES.public.about, lastModified, changeFrequency: 'monthly', priority: 0.8 }
```

**Verificación:**
- `pnpm type-check` → 0 errores
- `curl /sitemap.xml` muestra fechas reales en `<lastmod>`

---

## TAREA 31 — Preload de fuentes críticas en layout

**Por qué**: Las fuentes de Google Fonts se cargan sin hint de preload, causando FOUT (flash of unstyled text).

**Archivo:** `web/src/app/layout.tsx`

**Cambio:** Añadir `<link rel="preload">` para las fuentes críticas:
```tsx
<head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
  {/* Preload para Great Vibes (fuente decorativa, la más visual) */}
  <link
    rel="preload"
    as="font"
    type="font/woff2"
    href="https://fonts.gstatic.com/s/greatvibes/v19/RWmMoKWR9v4ksMfaWd_JN-XCg6UKDXlCbA.woff2"
    crossOrigin=""
  />
</head>
```

**Verificación:**
- Lighthouse Performance Score → verificar mejora en CLS/FCP
- `pnpm type-check` → 0 errores

---

## TAREA 32 — Confirmación "¿Salir sin guardar?" en formularios Flutter

**Por qué**: El usuario puede perder cambios al presionar atrás en formularios de la app.

**Archivos a modificar:**
- `app/lib/features/services/presentation/service_form_page.dart`
- `app/lib/features/categories/presentation/category_form_page.dart`
- `app/lib/features/calendar/presentation/booking_form_page.dart`
- `app/lib/features/settings/presentation/settings_*_page.dart`

**Patrón:**
```dart
PopScope(
  canPop: false,
  onPopInvokedWithResult: (bool didPop, dynamic result) async {
    if (!_isDirty) { context.pop(); return; }
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => ConfirmDialog(
        title: '¿Salir sin guardar?',
        message: 'Tienes cambios sin guardar.',
        confirmLabel: 'Salir',
        cancelLabel: 'Continuar editando',
      ),
    );
    if (confirmed == true && context.mounted) context.pop();
  },
  child: /* scaffold existente */,
)
```

Activar `_isDirty = true` en el `onChanged` de cualquier campo del formulario.

**Verificación:**
- `flutter analyze` → 0 issues
- Presionar atrás con cambios → aparece dialog
- Presionar atrás sin cambios → navega directamente

---

## TAREA 33 — Badge de pendientes en items del Drawer

**Por qué**: El usuario no sabe cuántos contactos sin leer o reservas pendientes hay sin entrar a cada pantalla.

**Archivos:**
- `app/lib/shared/widgets/layout/nav_items.dart`
- `app/lib/shared/widgets/layout/app_drawer.dart`
- Crear o usar provider existente que cuente `pendingContacts` y `pendingBookings`

**Cambio:**
```dart
// En el NavItem de "Contactos":
badge: Consumer(builder: (_, ref, __) {
  final count = ref.watch(unreadContactsCountProvider);
  return count > 0 ? Badge(label: Text('$count')) : null;
})
// Igual para "Calendario" con pendingBookingsCount
```

Crear `unreadContactsCountProvider` y `pendingBookingsCountProvider` que lean de la API o del cache local.

**Verificación:**
- `flutter analyze` → 0 issues
- `build_runner build` sin conflictos
- Los badges aparecen y se actualizan al marcar como leído

---

## TAREA 34 — EmptyState en calendar_page

**Por qué**: Si no hay reservas en el mes seleccionado, no se muestra nada. El widget `EmptyState` ya existe.

**Archivo:** `app/lib/features/calendar/presentation/calendar_page.dart`

**Cambio:**
```dart
import 'package:portfolio_pbn/shared/widgets/widgets.dart';
// ...
if (bookings.isEmpty)
  const EmptyState(
    icon: Icons.calendar_today_outlined,
    title: 'Sin reservas',
    message: 'No hay reservas en el período seleccionado',
  )
```

**Verificación:**
- `flutter analyze` → 0 issues
- Calendar sin reservas muestra EmptyState

---

## TAREA 35 — AppSearchBar en trash_page

**Por qué**: La página de papelera no tiene búsqueda. Con muchos items eliminados es difícil encontrar uno específico.

**Archivo:** `app/lib/features/trash/presentation/trash_page.dart`

**Cambio:**
```dart
import 'package:portfolio_pbn/shared/widgets/widgets.dart';
// Añadir AppSearchBar sobre la lista
AppSearchBar(
  onChanged: (query) => ref.read(_searchQueryProvider.notifier).state = query,
)
```

Filtrar la lista de items en el provider por el query de búsqueda.

**Verificación:**
- `flutter analyze` → 0 issues
- Búsqueda filtra los items eliminados por nombre/título

---

## TAREA 36 — AppSearchBar en category_gallery_page

**Por qué**: La galería de imágenes de una categoría puede tener muchos items. La búsqueda permite encontrar una imagen específica.

**Archivo:** `app/lib/features/categories/presentation/category_gallery_page.dart`

Misma lógica que Tarea 35.

**Verificación:**
- `flutter analyze` → 0 issues
- Búsqueda filtra imágenes por nombre/descripción

---

## TAREA 37 — Localización española en date/time pickers

**Por qué**: Los pickers de fecha/hora en Flutter muestran meses y días en inglés.

**Archivos:**
- `app/lib/main.dart` o `app.dart` — añadir delegates de localización
- `app/lib/features/calendar/presentation/booking_form_page.dart`

**Cambio en `app.dart`:**
```dart
import 'package:flutter_localizations/flutter_localizations.dart';
// ...
MaterialApp.router(
  localizationsDelegates: [
    GlobalMaterialLocalizations.delegate,
    GlobalWidgetsLocalizations.delegate,
    GlobalCupertinoLocalizations.delegate,
  ],
  supportedLocales: const [Locale('es', 'ES')],
  locale: const Locale('es', 'ES'),
)
```

Añadir `flutter_localizations` a `pubspec.yaml` si no está.

**Verificación:**
- `flutter analyze` → 0 issues
- DatePicker muestra "enero, febrero..." y días "lun, mar..."

---

## TAREA 38 — Haptic feedback en acciones clave

**Por qué**: Confirm/delete en Flutter no tienen feedback táctil. Mejora la sensación de respuesta.

**Archivos:** Cualquier botón de confirmación/eliminación en la app

**Cambio:**
```dart
import 'package:flutter/services.dart';
// En confirmación de eliminación:
await HapticFeedback.mediumImpact();
// En guardado exitoso:
await HapticFeedback.lightImpact();
```

Añadir en `confirm_dialog.dart` al confirmar y en form saves.

**Verificación:**
- `flutter analyze` → 0 issues
- Vibración sutil en confirmaciones (en dispositivo real)

---

## TAREA 39 — Botón "Reintentar" al recuperar conectividad

**Por qué**: `OfflineBanner` existe pero las pantallas con error de red no tienen botón Retry visible cuando vuelve la conexión.

**Archivos:**
- `app/lib/core/network/connectivity_provider.dart`
- `app/lib/shared/widgets/feedback/error_state.dart`

**Cambio en `ErrorState`:**
```dart
// Añadir parámetro onRetry:
class ErrorState extends StatelessWidget {
  final VoidCallback? onRetry;
  // ...
  if (onRetry != null)
    FilledButton(onPressed: onRetry, child: const Text('Reintentar'))
}
```

En los providers de datos, exponer `refresh()` que se llama desde el botón de retry.

**Verificación:**
- `flutter analyze` → 0 issues
- Sin conexión → muestra ErrorState con botón Retry
- Al recuperar conexión y presionar Retry → recarga datos

---

## TAREA 40 — Swipe-to-delete en listas Flutter (Dismissible)

**Por qué**: Eliminar en la app requiere abrir ítem → presionar botón eliminar → confirmar. Swipe es más rápido.

**Archivos:**
- `app/lib/features/testimonials/presentation/testimonials_list_page.dart`
- Posiblemente servicios y categorías también

**Cambio:**
```dart
Dismissible(
  key: Key(item.id),
  direction: DismissDirection.endToStart,
  background: Container(
    color: AppColors.destructive,
    alignment: Alignment.centerRight,
    padding: const EdgeInsets.only(right: AppSpacing.lg),
    child: const Icon(Icons.delete_outline, color: Colors.white),
  ),
  confirmDismiss: (direction) async {
    await HapticFeedback.mediumImpact();
    return showDialog<bool>(context: context, builder: (_) => ConfirmDialog(...));
  },
  onDismissed: (_) => ref.read(provider.notifier).delete(item.id),
  child: /* ListTile existente */,
)
```

**Verificación:**
- `flutter analyze` → 0 issues
- Swipe derecha-izquierda muestra fondo rojo con icono papelera
- Confirmar → elimina y remueve del listado

---

## TAREA 41 — Menú contextual con long-press en items de listas

**Por qué**: Las acciones rápidas (editar, eliminar, activar/desactivar) solo están disponibles al abrir el detalle.

**Archivos:** List pages del app (servicios, categorías, testimonios)

**Cambio:**
```dart
GestureDetector(
  onLongPress: () async {
    await HapticFeedback.mediumImpact();
    showModalBottomSheet(context: context, builder: (_) => _ItemActionsSheet(item: item));
  },
  child: /* ListTile existente */,
)
```

El `_ItemActionsSheet` contiene botones: Editar, Activar/Desactivar, Eliminar.

**Verificación:**
- `flutter analyze` → 0 issues
- Long-press abre sheet de acciones rápidas

---

## TAREA 42 — Buscador de texto en admin lista de servicios

**Por qué**: La lista de servicios en web admin no tiene campo de búsqueda. Con muchos servicios es lento encontrar uno.

**Archivo:** `web/src/app/(admin)/admin/services/page.tsx` o `ServiceManager.tsx`

**Cambio:**
```tsx
// Añadir input de búsqueda con client-side filter o URL param
const [search, setSearch] = useState('')
const filtered = services.filter(s => 
  s.name.toLowerCase().includes(search.toLowerCase())
)
```

**Verificación:**
- `pnpm type-check` → 0 errores
- Input visible que filtra la lista en tiempo real

---

## TAREA 43 — Buscador de texto en admin lista de categorías

**Por qué**: Similar a Tarea 42 pero para categorías.

**Archivo:** `web/src/app/(admin)/admin/categories/page.tsx` o componente de lista

**Verificación:** mismas que Tarea 42.

---

## TAREA 44 — Vista semanal en calendario admin

**Por qué**: La vista mensual muestra demasiado (pocas reservas por día). Una vista semanal es más útil en el día a día.

**Archivo:** `web/src/components/features/contact/bookings/CalendarView.tsx`

**Cambio:** Añadir toggle de vista mensual/semanal. Cuando es semanal, renderizar solo los 7 días de la semana activa con bloques horarios.

**Verificación:**
- `pnpm type-check` → 0 errores
- Toggle mes/semana funciona sin romper vista mensual existente

---

## TAREA 45 — Copiar email/teléfono en detalle de contacto admin

**Por qué**: Al revisar un mensaje de contacto en web admin, hay que copiar manualmente el email o teléfono.

**Archivo:** `web/src/components/features/contact/ContactList.tsx` (panel de detalle)

**Cambio:**
```tsx
<button
  onClick={() => navigator.clipboard.writeText(contact.email)}
  className="hover:text-primary transition-colors"
  aria-label="Copiar email"
>
  <Copy className="h-4 w-4" />
</button>
```

**Verificación:**
- `pnpm type-check` → 0 errores
- Clic en icono copia email al portapapeles (toast de confirmación opcional)

---

## TAREA 46 — Página offline personalizada para PWA

**Por qué**: Cuando la web PWA está offline, se muestra la pantalla genérica del navegador.

**Archivos:**
- Crear: `web/src/app/offline/page.tsx`
- Verificar configuración en `next.config.ts` (`@ducanh2912/next-pwa` fallback)

**Cambio:**
```tsx
// web/src/app/offline/page.tsx
export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-poppins text-2xl font-bold">Sin conexión</h1>
      <p className="text-muted-foreground">Por favor revisa tu conexión a internet</p>
    </div>
  )
}
```

Verificar en `next.config.ts` que `@ducanh2912/next-pwa` apunta a `/offline` como fallback.

**Verificación:**
- `pnpm type-check` → 0 errores
- Con red desactivada, la PWA muestra la página custom en lugar del error del navegador

---

## TAREA 47 — Pinch-to-zoom en galería de imágenes Flutter

**Por qué**: Las imágenes en `category_gallery_page.dart` no se pueden agrandar con los dedos.

**Archivo:** `app/lib/features/categories/presentation/category_gallery_page.dart`

**Cambio:** Envolver las imágenes con `InteractiveViewer`:
```dart
InteractiveViewer(
  minScale: 1.0,
  maxScale: 4.0,
  child: CachedNetworkImage(imageUrl: image.url),
)
```

O al abrir una imagen en detalle (diálogo/bottom sheet), permitir zoom.

**Verificación:**
- `flutter analyze` → 0 issues
- Pinch agranda la imagen hasta 4x en dispositivo real

---

## TAREA 48 — Loading overlay en app_settings al cambiar servidor

**Por qué**: Al cambiar la URL del servidor en `app_settings_page.dart`, no hay feedback visual durante la reconexión.

**Archivo:** `app/lib/features/app_settings/presentation/app_settings_page.dart` (o equivalente)

**Cambio:** Usar `LoadingOverlay` de `shared/widgets/feedback/loading_overlay.dart` mientras se verifica la nueva URL del servidor.

**Verificación:**
- `flutter analyze` → 0 issues
- Al guardar nueva URL del servidor, aparece overlay mientras verifica conectividad

---

## TAREA 49 — Command palette (Cmd+K) para navegación admin

**Por qué**: Con muchas secciones en el admin web, el acceso por teclado acelera la navegación.

**Crear:** `web/src/components/admin/CommandPalette.tsx`

**Implementación básica** con `cmdk` (ya popular en proyectos Next.js/Shadcn):
```bash
cd web && pnpm add cmdk
```

```tsx
// CommandPalette.tsx — dialog con input de búsqueda + lista de rutas admin
// Trigger: Cmd+K (useEffect con keydown listener)
// Items: todas las rutas de ROUTES.admin.*
```

Incluir en `web/src/components/providers/AppProviders.tsx` para que esté disponible en todo el admin.

**Verificación:**
- `pnpm type-check` → 0 errores
- Cmd+K (Mac) / Ctrl+K (Windows) abre la paleta
- Escribir "contact" filtra a la ruta de contactos

---

## TAREA 50 — CSP: directive report-to para violaciones

**Por qué**: El CSP en `next.config.ts` reporta violaciones pero no hay endpoint para recibir y loguear esas violaciones.

**Archivos:**
- `web/next.config.ts` — añadir `report-uri` o `report-to`
- Crear: `web/src/app/api/csp-report/route.ts`

**Cambio en `next.config.ts`:**
```typescript
// Añadir al final de la directiva CSP:
`; report-uri /api/csp-report`
```

**Crear `route.ts`:**
```typescript
export async function POST(req: Request) {
  const report = await req.json()
  // Loguear en Sentry o console.error en producción
  console.error('[CSP Violation]', report)
  return new Response(null, { status: 204 })
}
```

**Verificación:**
- `pnpm type-check` → 0 errores
- En producción, las violaciones de CSP aparecen en logs de Sentry/consola del servidor

---

## VERIFICACIÓN FINAL

Tras completar todas las tareas:

```bash
# Web
cd web
pnpm type-check   # → 0 errores TypeScript
pnpm lint         # → 0 warnings ESLint
pnpm test:unit    # → tests pasan

# App
cd app
flutter analyze   # → 0 issues
flutter test      # → tests pasan
dart run build_runner build --delete-conflicting-outputs  # → sin conflictos
```

### Incremento de versión obligatorio antes de cada commit que afecte `app/`:
- Editar `app/pubspec.yaml`: incrementar el número `N` en `version: X.Y.Z+N`

### Formato de commits:
```
feat(web): add Google reCAPTCHA v3 to public forms
feat(app): add pull-to-refresh to all screens  
fix(web): update CSP for reCAPTCHA domains
feat(db): add instagram responsePreference to Contact model
```

---

## TAREAS 51–100 — Nuevos Requerimientos del Cliente

> Derivadas del feedback detallado del cliente. Área: web (Next.js) + app (Flutter).

---

## TAREA 51 — Badges de estado en preview de mensajes (read/important/confirmed)

**Por qué**: La lista de mensajes recibidos no muestra el estado de cada mensaje (leído, no leído, importante, confirmado) sin abrirlo uno a uno. Pérdida de tiempo en el flujo admin diario.

**Archivos web:**
- `web/src/components/features/contacts/ContactsList.tsx` (o el componente de lista)
- `web/src/app/(admin)/admin/contacts/` — ServerComponent de la lista
- `web/src/lib/validations.ts` — enum status

**Archivos app:**
- `app/lib/features/contacts/presentation/contacts_list_page.dart`
- `app/lib/features/contacts/presentation/widgets/contact_tile.dart`

**Implementación web:**
- Añadir badge de color en cada fila: 🔵 No leído | ⚪ Leído | ⭐ Importante
- Badge "estado de respuesta" (pendiente / respondido / confirmado) con chip de color

**Implementación app:**
- Añadir `StatusBadge` widget (ya existe en `shared/widgets/display/`) a `ContactTile`
- Mostrar `isRead` (punto azul), `isImportant` (estrella) y `status` en la fila

**Verificación:**
- `pnpm type-check` → 0 errores
- `flutter analyze` → 0 issues
- Los estados se actualizan reactivamente al leer/marcar

---

## TAREA 52 — Eliminar funcionalidad "Responder" de mensajes

**Por qué**: El admin no responde mensajes desde el panel. En su lugar, usa los canales de contacto del cliente (Instagram, email). El botón "Responder" crea confusión y fue pedido eliminar explícitamente.

**Archivos web:**
- `web/src/components/features/contacts/ContactDetail.tsx` (o similar)
- `web/src/app/(admin)/admin/contacts/[id]/` — página de detalle
- Eliminar cualquier `<ReplyForm>`, `<textarea>` de respuesta, o Server Action de reply

**Archivos app:**
- `app/lib/features/contacts/presentation/contact_detail_page.dart`
- Eliminar botón/form de respuesta; mantener solo info de contacto + canales

**Step 1:** Buscar con grep: `reply|Reply|responder|Responder` en admin contacts
**Step 2:** Eliminar componentes de reply manteniendo los datos del mensaje
**Step 3:** En su lugar, mostrar los canales de contacto del cliente de forma prominente (email, Instagram, teléfono)

**Verificación:**
- `pnpm type-check` → 0 errores
- `flutter analyze` → 0 issues
- No aparece ningún campo de respuesta en web ni app

---

## TAREA 53 — Fix botón "Editar Reserva" (redirect roto)

**Por qué**: El botón de editar reserva en la app Flutter y/o web admin no navega correctamente al formulario de edición. Bloquea la gestión de reservas.

**Archivos app:**
- `app/lib/features/calendar/presentation/booking_detail_page.dart`
- `app/lib/core/router/app_router.dart` — verificar ruta `bookingEdit`

**Archivos web:**
- `web/src/app/(admin)/admin/bookings/` — verificar link de edición

**Diagnóstico:**
```bash
grep -r "bookingEdit\|booking_edit\|editBooking" app/lib --include="*.dart" -l
```

**Fix:** Verificar que `context.pushNamed(RouteNames.bookingEdit, pathParameters: {'id': booking.id})` es correcto y que `app_router.dart` tiene la ruta definida con el parámetro correcto.

**Verificación:**
- `flutter analyze` → 0 issues
- Navegar a detalle de reserva → "Editar" → abre formulario con datos pre-poblados

---

## TAREA 54 — Sincronizar campos del formulario reserva creación = edición

**Por qué**: El formulario de creación de reserva tiene menos campos que el de edición. En particular, la **sección de precios/dinero** (precio acordado, precio pagado, etc.) solo aparece en edición, no en creación. El cliente quiere los mismos campos en ambos.

**Archivos:**
- `app/lib/features/calendar/presentation/booking_form_page.dart`
- `app/lib/features/calendar/presentation/booking_form_page_builders.dart` (si existe)
- `web/src/app/(admin)/admin/bookings/new/` (formulario de creación web)
- `web/src/app/(admin)/admin/bookings/[id]/edit/` (formulario de edición web)

**Step 1:** Comparar ambos formularios — listar campos en creación vs edición
**Step 2:** Añadir los campos faltantes (precio acordado, notas de pago, etc.) al formulario de creación
**Step 3:** Asegurarse que los campos opcionales en creación no bloqueen submit si están vacíos
**Step 4:** Actualizar Server Action / endpoint de creación para aceptar los nuevos campos

**Verificación:**
- `pnpm type-check` → 0 errores
- `flutter analyze` → 0 issues
- Crear reserva trae misma UI que editar reserva (excepto estado y campos generados automáticamente)

---

## TAREA 55 — Nombre propietaria editable en header/navbar (CMS setting)

**Por qué**: El nombre "Paola Bolívar Nieva" en la esquina superior izquierda del navbar y sidebar está hardcodeado. Debe ser un campo editable desde el CMS (Settings > Site) para que la propietaria pueda cambiarlo.

**Archivos:**
- `web/prisma/schema/` — verificar `SiteSettings` model tiene `ownerName` o `siteName`
- `web/src/app/(admin)/admin/settings/site/` — formulario de configuración
- `web/src/components/layout/Navbar.tsx` — donde se muestra el nombre
- `web/src/components/layout/AdminSidebar.tsx` — donde se muestra el nombre
- `app/lib/shared/widgets/layout/app_drawer.dart` — donde se muestra en la app

**Step 1:** Verificar si ya existe el campo en el schema y en la API `/api/admin/settings/site`
**Step 2:** Si no existe, añadir `ownerName String?` al modelo SiteSettings
**Step 3:** Migrar DB: `pnpm db:push`
**Step 4:** En Navbar/Sidebar, leer el valor desde `getSiteSettings()` server-side
**Step 5:** En el formulario settings/site, añadir campo `ownerName`
**Step 6:** En app, asegurarse que el drawer lee `siteSettings.ownerName` del API

**Verificación:**
- `pnpm type-check` → 0 errores
- Cambiar el nombre en admin → se refleja en el navbar inmediatamente
- App: el nombre se actualiza al hacer pull-to-refresh o al navegar

---

## TAREA 56 — Fix sistema de temas completo + modal "¿Dónde se usa este color?"

**Por qué**: El sistema de temas tiene bugs pendientes. Además, cuando el admin cambia un color, no sabe qué componentes se verán afectados. El cliente pide un modal que muestre la lista de variables CSS y componentes que usan ese color.

**Archivos web:**
- `web/src/app/(admin)/admin/settings/theme/` — ThemeSettingsPage
- `web/src/styles/globals.css` — variables CSS
- Crear: `web/src/components/features/settings/ColorUsageModal.tsx`

**Implementación:**
1. **Fix bugs del tema actual**: identificar qué no funciona — si el color no se aplica en tiempo real, si la preview es incorrecta, etc.
2. **Modal de uso**: al hacer click en un color, abrir modal que lista componentes afectados
   - Map hardcodeado: `{ '--primary': ['Botones primarios', 'Links activos', 'CTA hero'], '--secondary': [...], ... }`
   - Mostrar mini-preview visual del componente con el color aplicado
3. **Preview en tiempo real**: usar CSS custom properties con `style` attribute dinámico

**Verificación:**
- `pnpm type-check` → 0 errores
- Cambiar color → preview en tiempo real
- Click en color → modal muestra lista de uso

---

## TAREA 57 — FontPicker con componente Google Fonts (app)

**Por qué**: El `FontPickerField` en `settings_theme_page` es un `TextFormField` plano donde el admin escribe el nombre de fuente. Debe ser un picker visual con preview (como el componente de la pantalla Home CMS).

**Archivos:**
- `app/lib/shared/widgets/inputs/font_picker_field.dart`
- `app/lib/shared/widgets/inputs/font_picker_field_sheet.dart`
- `app/lib/features/settings/presentation/settings_theme_page.dart`

**Implementación:**
- El `FontPickerFieldSheet` debe:
  1. Mostrar una lista de fuentes disponibles (Google Fonts: Poppins, Open Sans, Great Vibes, Playfair Display, Lato, Montserrat, etc.)
  2. Cada opción muestra un `Text('Paola Bolívar', style: GoogleFonts.poppins(fontSize: 18))` como preview
  3. Búsqueda/filtro de fuentes
  4. Al seleccionar, actualizar el campo y cerrar el sheet
- El `FontPickerField` muestra la fuente seleccionada con preview del texto real

**Verificación:**
- `flutter analyze` → 0 issues
- Tap en campo de fuente → abre sheet con lista visual
- Seleccionar fuente → campo se actualiza con preview

---

## TAREA 58 — REQUEST_INSTALL_PACKAGES en primer lanzamiento con mensaje amigable

**Por qué**: Para que la actualización in-app funcione en Android, la app necesita el permiso `REQUEST_INSTALL_PACKAGES`. Actualmente no se pide en runtime con explicación. El usuario puede rechazarlo por desconocimiento.

**Archivos:**
- `app/android/app/src/main/AndroidManifest.xml` — verificar declaración del permiso
- `app/lib/core/updates/presentation/app_update_dialog.dart` — flujo de actualización
- Crear: `app/lib/core/permissions/install_permission_page.dart` o dialog

**Implementación:**
1. Verificar que `<uses-permission android:name="android.permission.REQUEST_INSTALL_PACKAGES"/>` está en AndroidManifest
2. En el flujo de actualización, antes de intentar instalar el APK, verificar si el permiso existe
3. Si no existe: mostrar dialog amigable: "Para instalar actualizaciones automáticas, Portfolio Admin necesita permiso para instalar apps. ¿Activas esta opción en ajustes?"
4. Botón "Activar" → abre la pantalla de ajustes correcta de Android
5. Botón "Ahora no" → saltarse la actualización in-app

**Verificación:**
- `flutter analyze` → 0 issues
- En Android, sin permiso → dialog aparece antes de intentar instalar
- Con permiso → instalación directa sin pedir nada

---

## TAREA 59 — Fix imágenes de banderas en PhoneInputField

**Por qué**: El widget `PhoneInputField` (en `shared/widgets/inputs/phone_input_field.dart`) muestra imágenes de banderas rotas. Los assets no cargan o la librería usada no tiene los assets correctamente configurados.

**Archivos:**
- `app/lib/shared/widgets/inputs/phone_input_field.dart`
- `app/pubspec.yaml` — verificar qué librería de teléfono se usa

**Diagnóstico:**
1. Verificar la librería usada (`intl_phone_number_input`, `phone_form_field`, etc.)
2. Verificar que los assets de banderas están declarados en `pubspec.yaml`
3. Si la librería usa assets de paquete, verificar que el `flutter pub get` fue ejecutado
4. Si la librería está desactualizada o rota → migrar a una alternativa estable

**Implementación:**
- Si hay assets faltantes → añadir declaración en `pubspec.yaml` y `flutter pub get`
- Si la librería es el problema → evaluar migración a `flutter_phone_number_field` o similar
- Asegurarse que el estilo coincide con el del formulario web (mismo padding, tamaño de flag, separador)

**Verificación:**
- `flutter analyze` → 0 issues
- Abrir formulario de booking → banderas se muestran correctamente
- Seleccionar país → bandera y código de país actualizan

---

## TAREA 60 — Animación GSAP "expand" galería imagen → pantalla completa

**Por qué**: Al hacer click en una imagen de la galería, actualmente "salta" abruptamente al lightbox. El cliente pide una animación fluida donde la imagen se expande desde su posición en la grid hasta cubrir la pantalla (como el efecto "magic move" de iOS).

**Archivos:**
- `web/src/components/features/gallery/GalleryGrid.tsx`
- `web/src/components/features/gallery/LightboxModal.tsx` (o el componente de lightbox actual)
- Skill a usar: `gsap-react` + `gsap-core`

**Implementación con GSAP:**
```tsx
// En GalleryGrid: guardar posición/tamaño del elemento clickeado
const handleImageClick = (e: React.MouseEvent, index: number) => {
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  openLightbox(index, rect)
}

// En LightboxModal: animar desde rect origen hasta fullscreen
useEffect(() => {
  if (originRect) {
    gsap.fromTo(overlayRef.current, 
      { clipPath: `inset(${originRect.top}px ${window.innerWidth - originRect.right}px ${window.innerHeight - originRect.bottom}px ${originRect.left}px)` },
      { clipPath: 'inset(0px 0px 0px 0px)', duration: 0.4, ease: 'power3.inOut' }
    )
  }
}, [originRect])
```

**Skill:** Leer `gsap-react` SKILL.md antes de implementar.

**Verificación:**
- `pnpm type-check` → 0 errores
- Click en imagen → animación expand suave < 500ms
- Cerrar lightbox → animación collapse de vuelta
- `prefers-reduced-motion` → sin animación, transición instantánea

---

## TAREA 61 — Lightbox: thumbnail mientras carga full-res + pre-fetch adyacentes

**Por qué**: Al abrir el lightbox, hay un flash de blanco porque la imagen de alta calidad tarda en cargar. El cliente quiere que aparezca la thumbnail inmediatamente mientras se carga la versión completa.

**Archivos:**
- `web/src/components/features/gallery/LightboxModal.tsx`
- `web/src/components/features/gallery/GalleryGrid.tsx`

**Implementación:**
1. **Thumbnail como placeholder**: mostrar `blurDataURL` (ya generado por Next.js) o la URL de Cloudinary con transformaciones `q_10,w_50` como placeholder
2. **Carga progresiva**: usar `<Image>` de Next.js con `placeholder="blur"` + la imagen de alta calidad en un `<img>` sobrexpuesto que reemplaza cuando carga
3. **Pre-fetch adyacentes**: cuando se abre imagen `n`, pre-fetch `n-1` y `n+1` con `new Image().src = url`

```tsx
// Pre-fetch adyacentes
useEffect(() => {
  if (currentIndex > 0) new Image().src = images[currentIndex - 1].url
  if (currentIndex < images.length - 1) new Image().src = images[currentIndex + 1].url
}, [currentIndex])
```

**Verificación:**
- `pnpm type-check` → 0 errores
- Abrir lightbox → thumbnail aparece inmediatamente, luego full-res reemplaza suavemente
- Navegar → siguiente imagen carga más rápido por pre-fetch

---

## TAREA 62 — Formularios Flutter tablet: max-width + layout 2 columnas

**Por qué**: En tablet 12" landscape los formularios estiran todos los campos al 100% del ancho. Queda muy feo y difícil de usar. Deben tener un max-width y opcionalmente layout de 2 columnas para campos relacionados.

**Archivos:**
- `app/lib/shared/widgets/adaptive_form_layout.dart` — el widget de layout de formularios
- `app/lib/features/services/presentation/service_form_page.dart` (y otros form pages)

**Implementación:**
1. En `AdaptiveFormLayout`, añadir `maxWidth: double? = 720` — en tablet, centrar y limitar ancho
2. Para campos que van en pareja (precio / moneda, fecha inicio / fecha fin), usar `Row` condicionalmente cuando `constraints.maxWidth > 600`
3. Usar `LayoutBuilder` o `AdaptiveLayout` de Flutter

**Skill:** Leer `flutter-adaptive-ui` SKILL.md para implementar correctamente.

**Verificación:**
- `flutter analyze` → 0 issues
- En tablet landscape: formulario centrado, max-width respetado
- En móvil: sin cambios, campos a 100% como siempre

---

## TAREA 63 — Drag-and-drop galería: placeholder animado + push de imágenes

**Por qué**: Al reordenar imágenes en la galería Flutter con drag-and-drop, no hay feedback visual claro de dónde caerá la imagen. El cliente pide: (1) el hueco de destino muestre un borde punteado animado, (2) las otras imágenes se "empujan" suavemente para mostrar dónde quedará.

**Archivos:**
- `app/lib/features/projects/presentation/` (o donde esté el reordenador de galería)
- `app/lib/shared/widgets/draggable_list.dart`

**Implementación:**
- Usar `ReorderableGridView` + customizar el `proxyDecorator` para mostrar la imagen con sombra mientras se arrastra
- En el slot de destino, mostrar un `AnimatedContainer` con borde punteado (`Border.all(style: BorderStyle.solid, color: AppColors.primary.withOpacity(0.5))`, `BorderRadius.circular(8)`)
- Animar el gap con `AnimatedPadding` o `AnimatedContainer` para el efecto push

**Skill:** Leer `flutter-animations` SKILL.md para la animación de push.

**Verificación:**
- `flutter analyze` → 0 issues
- Drag imagen → hueco destino muestra borde punteado
- Imágenes adyacentes se mueven suavemente
- Soltar → imagen cae en posición con animación de lugar

---

## TAREA 64 — Orientación imagen (portrait/landscape/square) en galería Flutter

**Por qué**: En la web pública, las imágenes de galería respetan su orientación (verticales más altas, horizontales más anchas, cuadradas iguales). En la app Flutter, todas se muestran en grid cuadrado, lo que deforma las imágenes.

**Archivos:**
- `app/lib/features/projects/presentation/` — galería de imágenes del proyecto
- El modelo `GalleryImage` probablemente ya tiene `width` y `height` desde Cloudinary

**Implementación:**
- Leer `aspectRatio` desde el modelo de imagen (`width / height`)
- En `StaggeredGrid` (o similar), usar `aspectRatio` para determinar las celdas que ocupa cada imagen
- Usar `flutter_staggered_grid_view` si no está instalado, para un masonry layout
- Categorías de orientación: landscape (> 1.2:1), portrait (< 0.8:1), square (resto)

**Verificación:**
- `flutter analyze` → 0 issues
- Imágenes verticales se ven más altas, horizontales más anchas
- No hay distorsión/recorte

---

## TAREA 65 — Pantalla Home CMS rediseño para coincidir con admin web

**Por qué**: La pantalla `settings_home_page.dart` no refleja fielmente la UI del admin web de configuración de la sección Home. El cliente exige paridad visual exacta con el CMS web.

**Archivos:**
- `app/lib/features/settings/presentation/settings_home_page.dart`
- `web/src/app/(admin)/admin/settings/home/` — referencia web
- Captura visual del admin web como guía

**Implementación:**
1. Auditar qué campos tiene el formulario web (hero title, subtitle, CTA text, background image, etc.)
2. Replicar exactamente la estructura de secciones en la app
3. Usar `AppCard` para agrupar secciones, igual que en web
4. Misma jerarquía de campos, mismo orden, mismas etiquetas (traducidas si es necesario)

**Skill:** Leer `flutter-architecture` SKILL.md para estructura de pantallas.

**Verificación:**
- `flutter analyze` → 0 issues
- Todos los campos del admin web están presentes en la app
- Guardar cambios desde app → se reflejan en el admin web

---

## TAREA 66 — Pantalla Login rediseño (panel izquierdo estético)

**Por qué**: El panel izquierdo de la pantalla de login de la app es un rosa intenso que lastima la vista. El cliente pide un rediseño más elegante y acorde al design system.

**Archivos:**
- `app/lib/features/auth/presentation/login_page.dart`
- `app/lib/core/theme/app_colors.dart` — colores de referencia
- Posible inspiración: logo splash de la app (`pbn_splash_logo.dart`)

**Diseño propuesto:**
- Panel izquierdo: gradiente oscuro húmedo (del `AppColors.background` dark al `AppColors.card` dark) con el logo `PbnSplashLogo` centrado y las tipografías del design system
- Eliminar el fondo rosa sólido
- Opcional: imagen de fondo con overlay oscuro semitransparente

**Skill:** Leer `flutter-expert` SKILL.md para buenas prácticas de UI Flutter.

**Verificación:**
- `flutter analyze` → 0 issues
- Panel izquierdo visualmente atractivo, coherente con el design system
- Funcionalidad de login sin cambios

---

## TAREA 67 — Auditoría debounce + loading states en botones (web + app)

**Por qué**: Algunos botones se pueden pulsar varias veces seguidas enviando duplicados. En la app, botones "lentos" sin feedback inmediato.

**Archivos web:**
- Revisar todos los `<Button onClick={...}>` en formularios y acciones
- Añadir `disabled={isSubmitting}` y spinner en botones de submit

**Archivos app:**
- Revisar `ElevatedButton`, `TextButton`, `IconButton` en acciones que hacen requests
- Usar patrón: `isLoading ? CircularProgressIndicator() : Text('Guardar')`
- Añadir `if (isLoading) return;` al inicio del handler

**Implementación:**
1. Buscar en web: `onClick` sin estado de loading en formularios
2. Buscar en app: buttons sin `isLoading` guard
3. Implementar patrón consistente en ambas plataformas
4. Considerar un helper `useAsyncAction` para web o un wrapper `AsyncButton` para app

**Verificación:**
- `pnpm type-check` → 0 errores
- `flutter analyze` → 0 issues
- No se pueden enviar duplicados en ningún formulario

---

## TAREA 68 — Mensaje de confirmación testimonios + icono estético

**Por qué**: El mensaje de éxito al enviar un testimonio usa un ícono genérico (check verde) y texto estándar. El cliente pide algo más estético, acorde al branding del sitio.

**Archivos:**
- `web/src/components/features/testimonials/TestimonialForm.tsx`
- El componente de mensaje de éxito post-submit

**Implementación:**
- Cambiar el ícono de ✅ a algo más estético: por ejemplo, un corazón animado (`♥`), una estrella de cinco puntas, o el emoji de flores del branding
- Mensaje: cambiar el texto genérico "¡Gracias!" por algo más personal y acorde al tono del sitio
- Añadir pequeña animación de entrada con Framer Motion o CSS keyframes
- Color acorde al design system (usar `--primary` en lugar de verde genérico)

**Verificación:**
- `pnpm type-check` → 0 errores
- Enviar testimonio → aparece icono estético + mensaje personalizado

---

## TAREA 69 — Auditoría GSAP web + plan de animaciones scroll-triggered

**Por qué**: El sitio web público tiene muy pocas animaciones. El cliente quiere una web "viva" con micro-interacciones y animaciones de entrada al hacer scroll.

**Archivos:**
- `web/src/app/(public)/` — todas las páginas públicas
- Crear: `web/src/lib/animations.ts` — helper de configuraciones GSAP

**Skill:** Leer `gsap-scrolltrigger` y `gsap-react` SKILL.md antes de implementar.

**Implementación (plan):**
1. **Hero section**: palabras de título entran con stagger desde abajo
2. **Sección de servicios**: cards entran con fade + translateY al hacer scroll
3. **Testimonios**: fade-in stagger
4. **Galería**: imágenes entran con scale + opacity
5. Usar `gsap.matchMedia()` para respetar `prefers-reduced-motion`
6. Wrappear en `useGSAP()` con cleanup correcto

**Verificación:**
- `pnpm type-check` → 0 errores
- No hay layout shifts (CLS) por las animaciones
- Con `prefers-reduced-motion: reduce` → sin animaciones

---

## TAREA 70 — Modal "¿Dónde se usa este color?" en configuración de tema (web)

**Por qué**: El admin necesita saber qué componentes se verán afectados al cambiar un color del tema, sin tener que ir manualmente a cada página.

**Archivos:**
- `web/src/app/(admin)/admin/settings/theme/` — página de tema
- Crear: `web/src/components/features/settings/ColorUsageModal.tsx`

**Implementación:**
```typescript
// Map de variables CSS → componentes que las usan
const COLOR_USAGE_MAP: Record<string, string[]> = {
  '--primary': ['Botones primarios', 'Links activos', 'CTA hero', 'Título de sección', 'Borde focus'],
  '--secondary': ['Fondos de card hover', 'Badges de categoría', 'Chips de filtro'],
  '--background': ['Fondo de página', 'Navbar background'],
  '--card': ['Cards de servicio', 'Panel lateral', 'Modales'],
  // ...etc
}
```

- Al hacer click en un swatch de color → modal con lista + mini-preview visual
- Mini-preview: un snippet del componente renderizado con el color de muestra

**Verificación:**
- `pnpm type-check` → 0 errores
- Click en color → modal aparece con lista de uso

---

## TAREA 71 — Bottom sheet "¿Dónde se usa este color?" en configuración de tema (app)

**Por qué**: Equivalente móvil de la Tarea 70 — al editar un color en la app, mostrar un bottom sheet con la lista de componentes afectados.

**Archivos:**
- `app/lib/features/settings/presentation/settings_theme_page.dart`
- Crear: `app/lib/features/settings/presentation/widgets/color_usage_bottom_sheet.dart`

**Implementación:**
- Similar al mapa de la Tarea 70 pero en Dart
- Mostrar con `showModalBottomSheet`
- Lista de chips de componentes con el color aplicado como fondo

**Verificación:**
- `flutter analyze` → 0 issues
- Tap en un color → bottom sheet con lista de uso

---

## TAREA 72 — Tracking read/unread mensajes en DB + API

**Por qué**: Para los badges de estado (Tarea 51), la DB necesita un campo `isRead` en el modelo `Contact`. La API también debe exponer endpoints para marcar como leído.

**Archivos:**
- `web/prisma/schema/content.prisma` — añadir `isRead Boolean @default(false)` a `Contact`
- `web/src/app/api/admin/contacts/[id]/read/route.ts` — nuevo endpoint PATCH
- `web/src/actions/cms/contacts.ts` — nueva acción `markContactAsRead`

**Implementación:**
1. Añadir campo al schema + migrar: `pnpm db:push`
2. Crear endpoint `PATCH /api/admin/contacts/:id/read` — protegido con `withAdminJwt()`
3. Actualizar automáticamente `isRead = true` cuando se abre el detalle del mensaje
4. En la lista, mostrar el punto azul cuando `!isRead`

**Verificación:**
- `pnpm type-check` → 0 errores
- Abrir mensaje → se marca como leído automáticamente
- Badge desaparece en la lista

---

## TAREA 73 — Toggle "Importante" en mensajes admin (web + app)

**Por qué**: El admin necesita poder marcar mensajes como "importantes" para priorizar respuestas. Complementa el sistema de estados de Tarea 51.

**Archivos:**
- `web/prisma/schema/content.prisma` — añadir `isImportant Boolean @default(false)` a `Contact`
- `web/src/app/(admin)/admin/contacts/[id]/` — añadir botón de toggle
- `app/lib/features/contacts/presentation/contact_detail_page.dart` — mismo botón

**Implementación:**
- Star (⭐) toggle en el header del detalle — click cambia `isImportant`
- En la lista, mostrar estrella llena si `isImportant: true`
- Server Action + endpoint de API para el toggle

**Verificación:**
- `pnpm type-check` → 0 errores
- `flutter analyze` → 0 issues
- Toggle ⭐ funciona en web y app

---

## TAREA 74 — Campo instagramUsername en formulario de contacto público

**Por qué**: Cuando el visitante selecciona Instagram como preferencia de contacto, debe poder escribir su usuario de Instagram. Actualmente no hay campo para esto.

**Archivos:**
- `web/src/components/features/contact/ContactForm.tsx`
- `web/src/actions/user/contact.ts`
- `web/src/lib/validations.ts` — schema Zod de contacto
- `web/prisma/schema/content.prisma` — modelo Contact

**Implementación:**
1. En el formulario, cuando `responsePreference === 'INSTAGRAM'`, mostrar campo extra `instagramUsername` (campo texto, placeholder: "@tu_usuario")
2. Campo opcional, validado como `string().startsWith('@').optional()` en Zod
3. En la Server Action, incluir `instagramUsername` en la creación del Contact
4. No requerir teléfono si selección es Instagram

**Verificación:**
- `pnpm type-check` → 0 errores
- Seleccionar Instagram → aparece campo
- El campo se valida y guarda correctamente

---

## TAREA 75 — Schema DB: campo `instagramUsername` en modelo Contact

**Por qué**: Prerequisito de Tarea 74. El campo necesita estar en el modelo Prisma antes de usarlo.

**Archivos:**
- `web/prisma/schema/content.prisma` — modelo `Contact`

**Implementación:**
```prisma
model Contact {
  // ... campos existentes ...
  instagramUsername String?  // ← añadir
}
```

```bash
cd web && pnpm db:push
```

**Verificación:**
- `pnpm db:push` sin errores
- `pnpm type-check` → 0 errores (Prisma client regenerado)

---

## TAREA 76 — Admin contactos: mostrar Instagram handle en lista y detalle

**Por qué**: Una vez que se guarda el Instagram del visitante (Tarea 74-75), el admin necesita verlo en la lista y en el detalle del contacto.

**Archivos:**
- `web/src/components/features/contacts/ContactsList.tsx`
- `web/src/app/(admin)/admin/contacts/[id]/` — página de detalle

**Implementación:**
- En la fila de la lista: si `instagramUsername`, mostrar el handle con ícono de Instagram después del nombre
- En el detalle: section "Contacto" con el Instagram handle como link clickeable `https://instagram.com/{handle}`
- Badge de Instagram del color brand (#E1306C)

**Verificación:**
- `pnpm type-check` → 0 errores
- Mensajes con Instagram handle muestran la info correctamente

---

## TAREA 77 — App contactos: mostrar Instagram handle en detalle

**Por qué**: Equivalente app de Tarea 76.

**Archivos:**
- `app/lib/features/contacts/presentation/contact_detail_page.dart`
- El modelo `ContactModel` — añadir `instagramUsername String?`

**Implementación:**
- En la sección de datos de contacto, si `instagramUsername != null`, mostrar row con ícono de Instagram y el handle
- Tap en el handle → `launchUrl('https://instagram.com/$handle')`

**Verificación:**
- `flutter analyze` → 0 issues
- Handle de Instagram se muestra y abre el perfil al hacer tap

---

## TAREA 78 — Formulario reserva: sección de precios/dinero en creación

**Por qué**: El formulario de edición de reserva tiene campos de precio (precio acordado, precio pagado, etc.) pero el formulario de creación no los incluye. El cliente quiere poder ingresar estos datos desde el inicio.

**Archivos:**
- `web/src/app/(admin)/admin/bookings/new/` — formulario de creación
- `app/lib/features/calendar/presentation/booking_form_page.dart`
- Server Action de creación de reserva — añadir campos opcionales de precio

**Implementación:**
- Añadir una sección expandible/collapsible "Información de Pago" al formulario de creación
- Campos: `agreedPrice`, `paidAmount`, `paymentStatus`, `paymentNotes`
- Todos opcionales, con `?` en el schema Zod y en el modelo
- En la app, misma sección como `ExpansionTile`

**Verificación:**
- `pnpm type-check` → 0 errores
- `flutter analyze` → 0 issues
- Crear reserva con campos de pago → datos guardados correctamente

---

## TAREA 79 — Animaciones scroll-triggered GSAP en páginas públicas

**Por qué**: Continuación de Tarea 69 (plan). Esta tarea implementa las animaciones específicas identificadas en la auditoría.

**Archivos:**
- `web/src/components/public/Hero.tsx`
- `web/src/components/features/services/ServicesList.tsx` (página pública)
- `web/src/components/features/testimonials/TestimonialsSection.tsx`

**Skill:** Leer `gsap-scrolltrigger` + `gsap-react` SKILL.md antes de implementar.

**Implementación:**
```tsx
// En cada sección, usando useGSAP con ScrollTrigger:
useGSAP(() => {
  gsap.from(titleRef.current, {
    y: 30, opacity: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: titleRef.current, start: 'top 85%' }
  })
}, [])
```

**Verificación:**
- `pnpm type-check` → 0 errores
- Animaciones se activan al hacer scroll
- `prefers-reduced-motion` desactiva las animaciones

---

## TAREA 80 — Gallery web: pre-fetch imágenes con IntersectionObserver

**Por qué**: Las imágenes de galería de alta calidad solo se cargan al hacer click. El cliente quiere que mientras el usuario navega las miniaturas, las imágenes adyacentes se pre-carguen en background.

**Archivos:**
- `web/src/components/features/gallery/GalleryGrid.tsx`
- Usar Intersection Observer API (nativa, sin deps)

**Implementación:**
```tsx
// Cuando la miniatura es visible en viewport, pre-fetch la imagen de alta calidad
useEffect(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const highResUrl = entry.target.dataset.highres
        if (highResUrl) new Image().src = highResUrl
      }
    })
  }, { rootMargin: '200px' }) // Pre-fetch 200px antes de ser visible
  
  // Observar todas las miniaturas
  document.querySelectorAll('[data-highres]').forEach(el => observer.observe(el))
  return () => observer.disconnect()
}, [images])
```

**Verificación:**
- `pnpm type-check` → 0 errores
- En DevTools Network: imágenes se pre-cargan mientras se navega por la galería
- Abrir lightbox → imagen ya en caché, carga instantánea

---

## TAREA 81 — Responsive tablet landscape: auditoría de TODAS las pantallas Flutter

**Por qué**: Muchas pantallas Flutter no han sido revisadas para tablet. Esta tarea hace una auditoría sistemática.

**Pantallas a revisar:**
- Dashboard, Projects, Categories, Services, Testimonials, Contacts
- Calendar, Settings (todas), Trash, Account, Help

**Implementación:**
- Para cada pantalla, verificar en tablet 12" landscape que:
  1. No haya overflow horizontal
  2. Inputs no estiren al 100% del ancho
  3. Listas usen el espacio disponible (2 columnas si tiene sentido)
  4. Drawer lateral siempre visible (ya implementado en `AppScaffold`)
- Usar `AdaptiveFormLayout` (Tarea 62) en todas las pantallas que tengan forms

**Skill:** Leer `flutter-adaptive-ui` SKILL.md.

**Verificación:**
- `flutter analyze` → 0 issues
- Todas las pantallas se ven correctamente en tablet 12" landscape
- No hay overflow ni elementos distorsionados

---

## TAREA 82 — Pull-to-refresh en TODAS las pantallas Flutter

**Por qué**: (Consolidación de Tarea original #5) Las pantallas de lista no tienen pull-to-refresh. El usuario no puede forzar la actualización de datos.

**Archivos a modificar:**
- `app/lib/features/projects/presentation/projects_list_page.dart`
- `app/lib/features/categories/presentation/categories_list_page.dart`
- `app/lib/features/services/presentation/services_list_page.dart`
- `app/lib/features/testimonials/presentation/testimonials_list_page.dart`
- `app/lib/features/contacts/presentation/contacts_list_page.dart`
- `app/lib/features/calendar/presentation/calendar_page.dart`
- `app/lib/features/trash/presentation/trash_page.dart`
- `app/lib/features/dashboard/presentation/dashboard_page.dart`

**Patrón a usar:**
```dart
RefreshIndicator(
  color: AppColors.primary,
  onRefresh: () async {
    ref.invalidate(myProvider);
    await ref.read(myProvider.future);
  },
  child: ListView(...) // o GridView
)
```

**Verificación:**
- `flutter analyze` → 0 issues
- Pull-to-refresh funciona en todas las pantallas listadas
- Indicator usa `AppColors.primary`

---

## TAREA 83 — App galería reorden: preview animada de posición nueva

**Por qué**: Refinamiento de Tarea 63. Mientras se arrastra, mostrar una animación que indica que la imagen "encajará" en la nueva posición.

**Archivos:**
- `app/lib/shared/widgets/draggable_list.dart`
- `app/lib/features/projects/presentation/` — galería del proyecto

**Implementación:**
- Al soltar: animación `Hero`-like de la imagen moviéndose desde la posición de arrastre a la posición final
- Usar `AnimatedReorderableGridView` o implementar con `AnimationController` + `Tween<Offset>`

**Verificación:**
- `flutter analyze` → 0 issues
- Drag-drop visualmente satisfactorio con animación de "mover a posición"

---

## TAREA 84 — Admin servicios (web): búsqueda y filtro client-side

**Por qué**: (Consolidación de Tarea 42) La lista de servicios en admin web no tiene búsqueda.

**Archivos:**
- `web/src/app/(admin)/admin/services/` — página de listado de servicios
- Puede ser un componente `<ServicesSearch>` que filtra la lista por nombre

**Implementación:**
- Input de búsqueda en la parte superior de la lista
- Filtrado client-side con `useMemo` por nombre del servicio
- Limpiar búsqueda con botón X

**Verificación:**
- `pnpm type-check` → 0 errores
- Escribir en el input filtra los servicios en tiempo real

---

## TAREA 85 — Admin reservas: bulk status update

**Por qué**: El admin necesita poder cambiar el estado de múltiples reservas a la vez (ej: marcar 10 reservas pasadas como "completadas").

**Archivos:**
- `web/src/app/(admin)/admin/bookings/` — página de reservas
- `web/src/actions/cms/bookings.ts` — añadir `updateBookingsStatusBulk`

**Implementación:**
- Checkboxes en cada fila de la tabla
- Barra de acciones que aparece cuando hay selección: "Marcar como [estado]" + "Eliminar"
- Server Action con `prisma.booking.updateMany()`

**Verificación:**
- `pnpm type-check` → 0 errores
- Seleccionar múltiples → bulk action funciona

---

## TAREA 86 — App reservas: swipe para cambiar estado

**Por qué**: En la lista de reservas de la app, cambiar el estado requiere entrar al detalle. Con swipe se puede hacer más rápido.

**Archivos:**
- `app/lib/features/calendar/presentation/calendar_page.dart`
- El widget de item de reserva

**Implementación:**
- Swipe derecha → marcar como confirmada (fondo verde)
- Swipe izquierda → marcar como cancelada (fondo rojo) — con confirmación
- Usando `Dismissible` o `flutter_slidable`

**Verificación:**
- `flutter analyze` → 0 issues
- Swipe funciona con feedback visual correcto

---

## TAREA 87 — Web público: lazy load imágenes con blur placeholder

**Por qué**: Las imágenes de la landing más allá del fold se cargan eagerly. Mejora de performance y LCP.

**Archivos:**
- Componentes con imágenes en `web/src/components/public/` y `web/src/components/features/`
- Cambiar `loading="eager"` (o sin atributo) → `loading="lazy"` + `placeholder="blur"`

**Implementación:**
- Asegurarse que todos los `<Image>` de Next.js usan `loading="lazy"` excepto los above-the-fold
- Añadir `placeholder="blur"` + `blurDataURL` (generado por Cloudinary con `q_10,w_20`)
- Los above-the-fold (hero) deben tener `priority={true}`

**Verificación:**
- `pnpm type-check` → 0 errores
- Lighthouse Performance score mejora
- No hay blurs en imágenes above-the-fold

---

## TAREA 88 — App: skeleton screens en todas las páginas de lista

**Por qué**: Mientras cargan los datos, las páginas muestran spinner genérico. Los skeletons dan mejor feedback visual y UX más profesional.

**Archivos:**
- `app/lib/shared/widgets/display/skeleton_project.dart` (ya existe)
- `app/lib/shared/widgets/display/skeleton_category.dart` (ya existe)
- Usar en todas las páginas de lista durante el estado de loading

**Implementación:**
- En cada `AsyncValue.when(loading: ...)`, usar el skeleton correspondiente en lugar de spinner
- `skeleton_service.dart`, `skeleton_misc.dart` ya existen en `shared/widgets/display/`
- Para los que no tengan skeleton específico, usar `SkeletonMisc`

**Verificación:**
- `flutter analyze` → 0 issues
- Loading state muestra skeleton en lugar de spinner genérico

---

## TAREA 89 — PWA: prompt "Añadir a inicio" + instrucciones iOS

**Por qué**: Los usuarios de iOS no ven el prompt nativo de "Añadir a pantalla de inicio". Hay que mostrar instrucciones manuales.

**Archivos:**
- Crear: `web/src/components/pwa/AddToHomescreenBanner.tsx`
- `web/src/app/layout.tsx` — añadir el banner

**Implementación:**
- Detectar si es iOS Safari y si la PWA no está instalada (`!window.navigator.standalone`)
- Mostrar banner: "Para instalar la app: toca Compartir (◻↑) → Agregar a inicio"
- Guardar en `localStorage` cuando se descarta para no mostrar de nuevo
- En Android Chrome, usar el evento `beforeinstallprompt` para mostrar prompt nativo

**Verificación:**
- `pnpm type-check` → 0 errores
- En iOS Safari: banner aparece con instrucciones
- En Android Chrome: prompt nativo aparece

---

## TAREA 90 — Admin web: toggle manual dark/light mode

**Por qué**: El admin web no tiene un botón para cambiar entre modo oscuro y claro manualmente. Solo sigue el sistema.

**Archivos:**
- `web/src/components/layout/AdminSidebar.tsx` o Navbar — añadir toggle
- `web/src/components/providers/AppProviders.tsx` — verificar `ThemeProvider`

**Implementación:**
- Usar el `ThemeProvider` de `next-themes` (probablemente ya instalado)
- Añadir `<ThemeToggle>` con ícono luna/sol en el header del admin

**Verificación:**
- `pnpm type-check` → 0 errores
- Toggle cambia entre dark/light y persiste en `localStorage`

---

## TAREA 91 — App: modo oscuro sigue exactamente la preferencia del sistema

**Por qué**: En algunos dispositivos el modo oscuro de la app no sincroniza con la preferencia del sistema OS en tiempo real.

**Archivos:**
- `app/lib/app.dart` — `MaterialApp.router`
- `app/lib/core/theme/theme_provider.dart`

**Implementación:**
- Asegurarse que `themeMode: ThemeMode.system` cuando el usuario no ha elegido manualmente
- Usar `WidgetsBinding.instance.platformDispatcher.platformBrightness` para detectar cambios
- El provider debe reaccionar a cambios del sistema sin reiniciar la app

**Verificación:**
- `flutter analyze` → 0 issues
- Cambiar modo en iOS/Android ajustes → app cambia inmediatamente

---

## TAREA 92 — Reservas: integración Google Calendar / Apple Calendar

**Por qué**: Al confirmar una reserva, el admin debería poder añadirla directamente a su calendario. Ya está en el stack Flutter (`googleapis`).

**Archivos:**
- `app/lib/features/calendar/` — intregación Google Calendar (parcialmente implementada)
- `web/src/app/(admin)/admin/bookings/[id]/` — botón "Añadir a calendario"

**Implementación:**
- En el detalle de reserva confirmada: botón "📅 Añadir a Google Calendar"
- En web: generar enlace `https://calendar.google.com/calendar/render?action=TEMPLATE&…` con los datos de la reserva
- En app: usar el flujo de `googleapis` ya definido en AGENTS.md

**Verificación:**
- `pnpm type-check` → 0 errores
- `flutter analyze` → 0 issues
- Botón abre Google Calendar con datos pre-rellenados

---

## TAREA 93 — App: opción de login biométrico (FaceID / huella)

**Por qué**: Mejora de UX para el admin que usa la app diariamente. En lugar de escribir contraseña cada vez, usar biometría.

**Archivos:**
- `app/pubspec.yaml` — añadir `local_auth`
- `app/lib/features/auth/` — flujo de login
- `app/lib/features/app_settings/` — toggle para activar/desactivar biometría

**Implementación:**
1. Añadir `local_auth: ^2.x` a `pubspec.yaml`
2. En Settings > App, toggle "Usar biometría para entrar"
3. Si activado: al abrir la app, mostrar primero el diálogo biométrico
4. Si biometría falla → mostrar login con contraseña
5. Guardar preferencia en `flutter_secure_storage`

**Verificación:**
- `flutter analyze` → 0 issues
- Toggle activa/desactiva biometría
- FaceID / huella funciona en dispositivos compatibles

---

## TAREA 94 — Admin web: atajos de teclado adicionales

**Por qué**: (Consolidación de Tarea 49) Más allá de Cmd+K, el admin necesita atajos para crear elementos, guardar, etc.

**Archivos:**
- Crear: `web/src/hooks/useKeyboardShortcuts.ts`
- Aplicar en páginas de admin relevantes

**Atajos propuestos:**
- `Cmd+S` / `Ctrl+S` → guardar formulario activo
- `Cmd+N` / `Ctrl+N` → crear nuevo elemento (contexto-dependiente)
- `Escape` → cerrar modal/drawer activo
- `Cmd+K` → command palette (Tarea 49)

**Verificación:**
- `pnpm type-check` → 0 errores
- Atajos funcionan en Chrome/Safari/Firefox

---

## TAREA 95 — App: tour de onboarding en el primer arranque

**Por qué**: Usuarios nuevos no saben cómo navegar la app. Un tour guiado en el primer lanzamiento mejora la retención.

**Archivos:**
- Añadir `tutorial_coach_mark` o `showcaseview` al `pubspec.yaml`
- Crear: `app/lib/features/auth/presentation/onboarding/` — pantallas de onboarding
- `app/lib/features/app_settings/providers/app_preferences_provider.dart` — flag `hasSeenOnboarding`

**Implementación:**
- 3-4 pantallas estáticas con ilustraciones simples y texto breve
- Mostrar solo en primer lanzamiento (`hasSeenOnboarding == false`)
- Guardar flag en `SharedPreferences` al terminar el tour
- Botón "Saltar" siempre disponible

**Verificación:**
- `flutter analyze` → 0 issues
- Primer lanzamiento → onboarding aparece
- Segundos lanzamientos → onboarding saltado

---

## TAREA 96 — AppSearchBar en category_gallery_page

**Por qué**: (Tarea 36 original — duplicada para claridad) La galería de imágenes de una categoría no tiene búsqueda. Difícil encontrar imágenes específicas.

**Archivos:**
- `app/lib/features/categories/presentation/category_gallery_page.dart`

**Implementación:**
- Añadir `AppSearchBar` en el `SliverAppBar` o `AppBar`
- Filtrar imágenes por título/etiqueta mientras se escribe
- Si no hay resultados → mostrar `EmptyState`

**Verificación:**
- `flutter analyze` → 0 issues
- Buscador filtra imágenes correctamente

---

## TAREA 97 — Badge pendientes en items del Drawer

**Por qué**: (Tarea 33 original — duplicada para claridad) El drawer lateral no muestra cuántos elementos pendientes tiene cada sección (ej: 3 mensajes nuevos, 2 testimonios pendientes).

**Archivos:**
- `app/lib/shared/widgets/layout/app_drawer.dart`
- `app/lib/shared/widgets/layout/nav_items.dart`

**Implementación:**
- Providers que cuenten elementos pendientes (mensajes no leídos, testimonios pendientes, etc.)
- Mostrar `Badge` animado en los items del drawer correspondientes
- Actualizar automáticamente cuando cambia el estado

**Verificación:**
- `flutter analyze` → 0 issues
- Badge muestra el número correcto en tiempo real

---

## TAREA 98 — Botón "Reintentar" al recuperar conectividad

**Por qué**: (Tarea 39 original) Cuando la app pierde conectividad y la recupera, el usuario debe poder reintentar la operación que falló sin navegar manualmente.

**Archivos:**
- `app/lib/core/network/connectivity_provider.dart`
- `app/lib/shared/widgets/feedback/error_state.dart` — añadir botón retry

**Implementación:**
- En `ErrorState`, añadir parámetro opcional `onRetry: VoidCallback?`
- Cuando `onRetry` es provisto, mostrar botón "Reintentar"
- En los pages que hacen fetch, pasar `onRetry: () => ref.invalidate(myProvider)`
- Conectarse a `connectivityProvider` para auto-retry al recuperar red

**Verificación:**
- `flutter analyze` → 0 issues
- Perder red → error state con botón "Reintentar"
- Recuperar red → botón funciona, recarga datos

---

## TAREA 99 — Pinch-to-zoom en galería de imágenes Flutter

**Por qué**: (Tarea 47 original) Los usuarios quieren examinar detalles de las imágenes de galería haciendo zoom.

**Archivos:**
- `app/lib/features/projects/presentation/` — visor de imágenes de proyecto
- Usar `photo_view` package (probablemente ya en `pubspec.yaml`)

**Implementación:**
- Al abrir una imagen en fullscreen, envolver en `PhotoView` con `minScale` y `maxScale`
- `PhotoViewGallery` para navegar entre imágenes con swipe
- Gesto de pinch → zoom suave con animación

**Verificación:**
- `flutter analyze` → 0 issues
- Pinch-to-zoom funciona en imagen de galería
- Double-tap → zoom al 100% / vuelta a fit

---

## TAREA 100 — GSAP stagger animation al cargar imágenes en galería

**Por qué**: Cuando la galería de la web carga, todas las imágenes aparecen abruptamente. Añadir un stagger de entrada con GSAP hace la experiencia más elegante.

**Archivos:**
- `web/src/components/features/gallery/GalleryGrid.tsx`

**Skill:** Leer `gsap-core` y `gsap-react` SKILL.md antes de implementar.

**Implementación:**
```tsx
useGSAP(() => {
  gsap.from('.gallery-item', {
    opacity: 0,
    y: 20,
    scale: 0.95,
    duration: 0.5,
    stagger: { each: 0.05, from: 'start' },
    ease: 'power2.out',
    clearProps: 'all'
  })
}, { dependencies: [images] })
```

**Verificación:**
- `pnpm type-check` → 0 errores
- Galería carga con animación stagger suave
- `prefers-reduced-motion` desactiva la animación

---

## Resumen de progreso (actualizado)

| Estado | Cantidad | Tareas |
|--------|----------|--------|
| ✅ Completadas | 22 | 1, 2, 3, 4, 16, 17, 18, 22, 23, 24, 26, 27, 29, 30, 31, 32, 34, 35, 37, 38, 40, 41 |
| ⏳ Pendientes | 78 | 5–15, 19–21, 25, 28, 33, 36, 39, 42–100 |

**Siguiente tarea recomendada: #36 (AppSearchBar category_gallery_page) → #82 (pull-to-refresh) → #13 (fix edit booking)**
