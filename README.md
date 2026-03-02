# Portfolio PBN

**Portfolio profesional + CMS de Paola Bolívar Nievas** — Maquilladora especializada en audiovisuales, FX, teatro y caracterización.

Monorepo completo: sitio público (Next.js PWA) + panel de administración web + app nativa Flutter para tablet/móvil.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Flutter](https://img.shields.io/badge/Flutter-stable-02569B?logo=flutter)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)

---

## Estructura del monorepo

```
portfolio-pbn/
├── web/          # Next.js 16 — portfolio público + CMS web
├── app/          # Flutter — app de administración nativa (Android/iOS)
├── docs/         # Documentación técnica
└── AGENTS.md     # Reglas del proyecto para agentes AI
```

---

## Web — Next.js (`web/`)

### Stack

| Herramienta | Versión/Detalle |
|---|---|
| Framework | Next.js 16 — App Router, Server Components |
| Lenguaje | TypeScript 5 en modo estricto |
| Base de datos | PostgreSQL (Neon) — branching dev/prod |
| ORM | Prisma — multi-file schema |
| Estilos | Tailwind CSS 4 — tokens CSS en `globals.css` |
| Auth | NextAuth.js v4 — JWT strategy |
| Email | Resend |
| Imágenes | Cloudinary (upload server-side) |
| Deploy | Vercel — `main` → prod, `develop` → preview |
| Error tracking | Sentry |
| Analytics | Google Analytics 4 |
| Notificaciones push | FCM HTTP v1 via `jose` |

### Comandos (`web/`)

```bash
pnpm dev            # Servidor de desarrollo
pnpm build          # Build de producción
pnpm type-check     # TypeScript estricto (obligatorio antes de commit)
pnpm lint           # ESLint
pnpm test:unit      # Vitest (unitarios)
pnpm test           # Playwright (E2E)
pnpm db:push        # Sync schema → DB
pnpm db:studio      # Prisma Studio
```

---

## App Flutter — Admin (`app/`)

App de administración nativa para Android/iOS. Replica las funciones del CMS web con soporte offline-first y notificaciones push en tiempo real.

### Stack

| Herramienta | Detalle |
|---|---|
| SDK | Flutter stable + Dart ^3.10 |
| State management | Riverpod + code-gen (`@riverpod`) |
| Navegación | `go_router` — rutas tipadas |
| HTTP | `dio` + interceptors (auth, retry) |
| DB local | `drift` (SQLite) — offline cache |
| Push | Firebase Cloud Messaging (FCM) |
| Auth storage | `flutter_secure_storage` — JWT |
| Modelos | `freezed` + `json_serializable` |
| Error tracking | Sentry Flutter |

### Funcionalidades de la app

- Dashboard con estadísticas en tiempo real
- Gestión de proyectos, categorías, servicios y testimoniales
- Bandeja de contactos con detalle y estado
- Calendario de reservas (vista mensual + detalle)
- Notificaciones push con deep links y preferencias por tipo
- Modo oscuro/claro con persistencia
- Soporte offline con cola de sincronización

### Distribución Firebase App Distribution

Los scripts de distribución se encuentran en `app/scripts/` y son obligatorios. Hay dos scripts principales:

- `distribute-dev.sh`: publica un APK debug en GitHub Releases con tag `app/vX.Y.Z-dev`, lo distribuye en Firebase App Distribution y notifica la API `/api/admin/app/latest-release`.
- `distribute-prod.sh`: produce un APK release (ofuscado), crea una release en GitHub (tag `app/vX.Y.Z`), distribuye en Firebase App Distribution y notifica la API.

Ambos scripts ejecutan los pasos completos sin opciones interactivas. Regla obligatoria: cada commit que afecte `app/` debe incluir un bump de versión en `app/pubspec.yaml` (ej.: `version: 1.2.3+4`).

Comandos de ejemplo:

```bash
# Generar keystore (solo una vez)
bash app/scripts/setup_keystore.sh

# Distribución dev (ejecuta todos los pasos obligatorios)
bash app/scripts/distribute-dev.sh

# Distribución prod (ejecuta todos los pasos obligatorios)
bash app/scripts/distribute-prod.sh
```

---

## Sistema de notificaciones push

| Tipo | Descripción |
|---|---|
| `contact` | Nuevo mensaje del formulario público |
| `booking` | Nueva reserva creada |
| `booking_reminder` | Recordatorio 24h / 1h antes de una reserva |
| `project` | Proyecto publicado o actualizado |
| `service` | Servicio añadido o modificado |
| `testimonial` | Nuevo testimonial recibido |
| `system` | Alertas de sistema (sync, actualizaciones) |

Cada tipo se puede activar/desactivar individualmente desde Preferencias → Notificaciones en la app.

---

## Seguridad

Repositorio público solo con fines de portafolio. No se aceptan contribuciones.

Los siguientes archivos están en `.gitignore` y **nunca se deben commitear**:

- `web/.env*` — variables de entorno web
- `app/android/app/google-services.json` — config Firebase Android
- `app/ios/Runner/GoogleService-Info.plist` — config Firebase iOS
- `app/lib/firebase_options.dart` — opciones Firebase con API keys
- `app/keystore/` y `app/android/key.properties` — firma APK Android
- `*firebase-adminsdk*.json` — service account Firebase

---

## Autor

**Gonzalo Yacante** — Full Stack Developer

---

<p align="center">Desarrollado por <strong>Gonzalo Yacante</strong> para Paola Bolívar Nievas</p>


---

## ✨ Características

### 🎨 **CMS Dinámico Completo**

- Panel de administración con autenticación segura
- Gestión de proyectos, categorías y contenido
- Editor de tema visual: colores, fuentes, espaciados
- Todo configurable sin tocar código

### 🌙 **Modo Claro/Oscuro**

- Toggle integrado en navbar
- Persistencia en localStorage
- Respeta preferencias del sistema

### 📱 **100% Responsive**

- Diseño mobile-first
- Menú hamburguesa en móvil
- Galería masonry adaptativa

### 🔒 **Seguridad**

- Autenticación con NextAuth.js
- Rate limiting para formularios
- Headers de seguridad (CSP, XSS Protection)
- Recuperación de contraseña por email

### 📊 **Analytics & SEO**

- Google Analytics integrado
- Meta tags dinámicos
- Open Graph / Twitter Cards
- Sitemap y robots.txt automáticos

---

## 🛠️ Stack Tecnológico

| Categoría         | Tecnología                            |
| ----------------- | ------------------------------------- |
| **Frontend**      | Next.js 16, React 19, TypeScript      |
| **Estilos**       | Tailwind CSS, CSS Variables dinámicas |
| **Base de datos** | PostgreSQL + Prisma ORM               |
| **Autenticación** | NextAuth.js                           |
| **Email**         | Resend                                |
| **Imágenes**      | Cloudinary                            |
| **Deploy**        | Vercel                                |
| **Testing**       | Playwright (E2E)                      |

---

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── (admin)/           # Rutas del panel admin
│   ├── (public)/          # Rutas públicas
│   └── auth/              # Autenticación
├── components/
│   ├── admin/             # Componentes del admin
│   ├── layout/            # Navbar, Footer, etc.
│   ├── public/            # Hero, Cards, etc.
│   └── ui/                # Botones, Inputs, etc.
├── actions/               # Server Actions
├── lib/                   # Utilidades
└── styles/                # CSS global
```

---

## 📝 Scripts Disponibles

| Script               | Descripción                 |
| -------------------- | --------------------------- |
| `pnpm dev`           | Servidor de desarrollo      |
| `pnpm build`         | Build de producción         |
| `pnpm lint`          | Verificar código con ESLint |
| `pnpm format`        | Formatear con Prettier      |
| `pnpm test`          | Ejecutar tests E2E          |
| `pnpm prisma studio` | Interfaz visual de DB       |

---

## 👨‍💻 Desarrollador

**Gonzalo Yacante** - Full Stack Developer

- 🌐 Portfolio: [gonzaloyacante.dev](https://gonzaloyacante.dev)
- 💼 LinkedIn: [/in/gonzaloyacante](https://linkedin.com/in/gonzaloyacante)
- 🐙 GitHub: [@gonzaloyacante](https://github.com/gonzaloyacante)

---

## 📄 Licencia

Este proyecto es privado y pertenece a Paola Bolívar Nievas.
Desarrollado por Gonzalo Yacante.

---

<p align="center">
  Hecho con 💄 y ☕ por <strong>Gonzalo Yacante</strong>
</p>
