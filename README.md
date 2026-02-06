# 💄 Portfolio PBN

**Portfolio profesional para Paola Bolívar Nievas** - Maquilladora especializada en audiovisuales, FX, teatro y caracterización.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)

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
