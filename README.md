# 🎨 Portfolio Paola Bolívar Nievas - CMS Completo v2

Sistema CMS completo para portfolio profesional de maquilladora. Incluye backend API REST con Express + Prisma y frontend Next.js 16 con panel de administración.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Next](https://img.shields.io/badge/next-16.0.0-black.svg)

---

## ✨ Características

### 🎯 Frontend Público
- ✅ Portfolio interactivo con categorías de proyectos
- ✅ Galería de imágenes con lightbox
- ✅ Formulario de contacto
- ✅ Sección de habilidades
- ✅ Redes sociales
- ✅ SEO optimizado
- ✅ Responsive design

### 🔐 Panel de Administración (CMS)
- ✅ Autenticación JWT con refresh tokens
- ✅ CRUD completo de proyectos y categorías
- ✅ Gestión de imágenes por proyecto
- ✅ Sistema de contactos con estados
- ✅ Gestión de skills y redes sociales
- ✅ Configuración global del portfolio (SEO, bio, etc.)
- ✅ Todo editable sin tocar código

### 🚀 Backend API
- ✅ Express.js + TypeScript
- ✅ Prisma ORM con PostgreSQL
- ✅ Validación con Zod
- ✅ Seguridad: Helmet, CORS, Rate Limiting
- ✅ Logs estructurados con Pino
- ✅ Manejo de errores centralizado
- ✅ Seeds para datos iniciales

---

## 📁 Estructura del Proyecto

```
portfolio-pbn/
├── api/                    # Backend API (Express + Prisma)
│   ├── src/
│   │   ├── config/         # Configuración (DB, env, etc.)
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── middleware/     # Auth, errors, validation
│   │   ├── routes/         # Rutas de la API
│   │   ├── utils/          # Utilidades (JWT, validators)
│   │   ├── app.ts          # Configuración Express
│   │   └── server.ts       # Entry point
│   ├── prisma/
│   │   ├── schema.prisma   # Modelos de base de datos
│   │   └── seed.ts         # Datos iniciales
│   └── package.json
│
├── web/                    # Frontend (Next.js 16)
│   ├── app/                # App Router
│   │   ├── page.tsx        # Home
│   │   ├── admin/          # Panel de administración
│   │   └── ...
│   ├── components/         # Componentes React
│   ├── lib/                # Utilidades y API client
│   │   ├── api-client.ts   # Cliente para consumir API
│   │   └── utils.ts
│   └── package.json
│
├── SETUP.md                # Guía completa de instalación
└── README.md               # Este archivo
```

---

## 🚀 Quick Start

### 1. Clonar el repositorio

```bash
git clone https://github.com/gonzaloyacante/portfolio-pbn.git
cd portfolio-pbn
```

### 2. Configurar Backend

```bash
cd api
npm install
cp .env.example .env
# Edita .env con tus valores (DATABASE_URL, JWT_SECRET, etc.)
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

### 3. Configurar Frontend

```bash
cd ../web
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local
npm run dev
```

### 4. Acceder

- **Frontend Público:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Panel Admin:** http://localhost:3000/admin (próximamente)

---

## 📖 Documentación Completa

Ver [SETUP.md](./SETUP.md) para:
- Instalación detallada paso a paso
- Configuración de base de datos (local y nube)
- Variables de entorno
- Deployment
- Troubleshooting
- Comandos útiles

---

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT (jsonwebtoken)
- **Validation:** Zod
- **Security:** Helmet, CORS, Rate Limiting
- **Logging:** Pino
- **Language:** TypeScript

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI:** React 19
- **Styling:** Tailwind CSS 4
- **Components:** shadcn/ui (Radix UI)
- **Forms:** React Hook Form + Zod
- **State:** React Context / Zustand (próximamente)
- **Language:** TypeScript

---

## 📋 Requisitos

- Node.js 18+
- PostgreSQL 12+
- npm o pnpm

---

## 🗄️ Modelos de Base de Datos

- **User** - Usuarios administradores
- **ProjectCategory** - Categorías de proyectos
- **Project** - Proyectos del portfolio
- **ProjectImage** - Imágenes de proyectos
- **Contact** - Mensajes de contacto
- **Skill** - Habilidades/especialidades
- **SocialLink** - Redes sociales
- **PortfolioSettings** - Configuración global (singleton)

Ver `api/prisma/schema.prisma` para detalles completos.

---

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt (10 rounds)
- ✅ JWT con expiración configurable
- ✅ Refresh tokens en httpOnly cookies
- ✅ Rate limiting por IP
- ✅ CORS configurado
- ✅ Helmet para headers de seguridad
- ✅ Validación de inputs con Zod
- ✅ SQL injection prevenido por Prisma

---

## 🚧 Roadmap

- [x] Backend API completo
- [x] Frontend público conectado
- [x] Autenticación JWT
- [x] CRUD de proyectos y categorías
- [x] Sistema de contactos
- [x] Skills y redes sociales
- [ ] Panel de administración UI
- [ ] Upload de imágenes (Vercel Blob / Cloudinary)
- [ ] Email notifications con templates
- [ ] Analytics dashboard
- [ ] Tests unitarios e integración
- [ ] CI/CD con GitHub Actions

---

## 📦 Scripts Disponibles

### Backend (api/)
```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Build para producción
npm start            # Iniciar producción
npm run prisma:studio # GUI para ver/editar DB
npm run seed         # Poblar DB con datos iniciales
```

### Frontend (web/)
```bash
npm run dev          # Desarrollo
npm run build        # Build para producción
npm start            # Iniciar producción
npm run lint         # Linter
```

---

## 🤝 Contribuir

Este es un proyecto privado, pero si tienes sugerencias:

1. Fork el proyecto
2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al Branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es propiedad privada de Gonzalo Yacante & Paola Bolívar Nievas.

---

## 👤 Autor

**Gonzalo Yacante**
- GitHub: [@gonzaloyacante](https://github.com/gonzaloyacante)

**Cliente:**
- Paola Bolívar Nievas - Maquilladora Profesional

---

## 🙏 Agradecimientos

- Next.js team por el increíble framework
- Prisma team por el mejor ORM
- shadcn/ui por los componentes hermosos
- Vercel por el hosting

---

## 📞 Soporte

Para problemas o preguntas:
1. Revisa [SETUP.md](./SETUP.md)
2. Abre un Issue en GitHub
3. Contacta al desarrollador

---

**Hecho con ❤️ y ☕ por Gonzalo Yacante**
