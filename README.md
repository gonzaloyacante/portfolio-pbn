<div align="center"># 🎨 Portfolio Paola Bolívar Nievas - CMS Completo v2



# 💄✨ Portfolio Paola Bolívar NievasSistema CMS completo para portfolio profesional de maquilladora. Incluye backend API REST con Express + Prisma y frontend Next.js 16 con panel de administración.



### *Tu visión, mi arte*![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)

![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

**Plataforma CMS Profesional para Maquilladores**  ![Next](https://img.shields.io/badge/next-16.0.0-black.svg)

Portfolio Dinámico + Panel de Administración Completo

---

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)## ✨ Características

[![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748?logo=prisma)](https://www.prisma.io/)

[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-316192?logo=postgresql)](https://www.postgresql.org/)### 🎯 Frontend Público

[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)- ✅ Portfolio interactivo con categorías de proyectos

- ✅ Galería de imágenes con lightbox

[✨ Ver Demo](https://portfolio-pbn.vercel.app) • [🚀 Quick Start](#-quick-start) • [📖 Docs](#-stack-tecnológico)- ✅ Formulario de contacto

- ✅ Sección de habilidades

</div>- ✅ Redes sociales

- ✅ SEO optimizado

---- ✅ Responsive design



## 🌟 Lo Que Hace Especial Este Portfolio### 🔐 Panel de Administración (CMS)

- ✅ Autenticación JWT con refresh tokens

**No es solo un portfolio más.** Es una plataforma completa que permite a profesionales del maquillaje gestionar todo su contenido de forma visual, sin tocar una línea de código.- ✅ CRUD completo de proyectos y categorías

- ✅ Gestión de imágenes por proyecto

### ✨ Para el Cliente Final- ✅ Sistema de contactos con estados

- ✅ Gestión de skills y redes sociales

🎨 **Portfolio Impactante** - Galería visual profesional que convierte visitantes en clientes  - ✅ Configuración global del portfolio (SEO, bio, etc.)

📱 **100% Responsive** - Perfecto en móvil, tablet y desktop  - ✅ Todo editable sin tocar código

⚡ **Carga Ultra-Rápida** - Optimizado para SEO y experiencia de usuario  

💼 **Gestión Total** - Actualiza proyectos, precios, servicios desde un panel intuitivo  ### 🚀 Backend API

📧 **Contacto Directo** - Formulario integrado que llega directo a tu bandeja  - ✅ Express.js + TypeScript

- ✅ Prisma ORM con PostgreSQL

### 🛠️ Para Desarrolladores- ✅ Validación con Zod

- ✅ Seguridad: Helmet, CORS, Rate Limiting

⚡ **Stack Moderno** - Next.js 16, React 19, TypeScript, Prisma  - ✅ Logs estructurados con Pino

🔒 **Seguro por Diseño** - JWT, bcrypt, validación con Zod  - ✅ Manejo de errores centralizado

🎯 **API Integrada** - Backend en Next.js API Routes (sin servidor separado)  - ✅ Seeds para datos iniciales

📦 **Deploy en 1-Click** - Listo para Vercel con PostgreSQL  

🔧 **CMS Completo** - Sistema de gestión de contenido profesional  ---



---## 📁 Estructura del Proyecto



## 🎯 Características Destacadas```

portfolio-pbn/

<table>├── api/                    # Backend API (Express + Prisma)

<tr>│   ├── src/

<td width="50%">│   │   ├── config/         # Configuración (DB, env, etc.)

│   │   ├── controllers/    # Lógica de negocio

### 🎨 **Frontend Espectacular**│   │   ├── middleware/     # Auth, errors, validation

│   │   ├── routes/         # Rutas de la API

✅ Diseño elegante y profesional  │   │   ├── utils/          # Utilidades (JWT, validators)

✅ Animaciones suaves y fluidas  │   │   ├── app.ts          # Configuración Express

✅ Lightbox para galería de imágenes  │   │   └── server.ts       # Entry point

✅ Categorías de proyectos organizadas  │   ├── prisma/

✅ Formulario de contacto funcional  │   │   ├── schema.prisma   # Modelos de base de datos

✅ Integración con redes sociales  │   │   └── seed.ts         # Datos iniciales

✅ SEO optimizado (meta tags, sitemap, robots)  │   └── package.json

✅ Performance 95+ en Lighthouse  │

├── web/                    # Frontend (Next.js 16)

</td>│   ├── app/                # App Router

<td width="50%">│   │   ├── page.tsx        # Home

│   │   ├── admin/          # Panel de administración

### 🔐 **Panel CMS Potente**│   │   └── ...

│   ├── components/         # Componentes React

✅ Login seguro con JWT  │   ├── lib/                # Utilidades y API client

✅ Dashboard con métricas  │   │   ├── api-client.ts   # Cliente para consumir API

✅ CRUD de proyectos con drag & drop  │   │   └── utils.ts

✅ Upload de imágenes a Cloudinary  │   └── package.json

✅ Gestión de categorías  │

✅ Bandeja de mensajes de contacto  ├── SETUP.md                # Guía completa de instalación

✅ Edición de Skills y Bio  └── README.md               # Este archivo

✅ Configuración global del sitio  ```



</td>---

</tr>

</table>## 🚀 Quick Start



---### 1. Clonar el repositorio



## 🏗️ Arquitectura del Sistema```bash

git clone https://github.com/gonzaloyacante/portfolio-pbn.git

**Todo en un solo proyecto Next.js:**cd portfolio-pbn

``````

┌─────────────────────────────────────────┐

│         Next.js Application             │### 2. Configurar Backend

├─────────────────────────────────────────┤

│  Frontend     │  Admin Panel │  API     │```bash

│  (Public)     │  (Protected) │  Routes  │cd api

├─────────────────────────────────────────┤npm install

│          Prisma ORM Layer               │cp .env.example .env

├─────────────────────────────────────────┤# Edita .env con tus valores (DATABASE_URL, JWT_SECRET, etc.)

│      PostgreSQL (NeonDB) + Cloudinary   │npm run prisma:generate

└─────────────────────────────────────────┘npm run prisma:migrate

          ↓ Deploy ↓npm run seed

      Vercel (Serverless)npm run dev

``````



✅ Frontend público  ### 3. Configurar Frontend

✅ Panel de administración  

✅ API Backend integrada  ```bash

✅ Base de datos PostgreSQL  cd ../web

✅ Deploy unificado en Vercel  npm install

echo "NEXT_PUBLIC_API_URL=http://localhost:5000/api" > .env.local

---npm run dev

```

## 🚀 Quick Start

### 4. Acceder

### Prerequisitos

- **Frontend Público:** http://localhost:3000

- Node.js 18+- **Backend API:** http://localhost:5000/api

- PostgreSQL database (o cuenta en [Neon](https://neon.tech))- **Panel Admin:** http://localhost:3000/admin (próximamente)

- Cuenta en [Cloudinary](https://cloudinary.com) (para imágenes)

---

### Instalación en 3 Pasos

## 📖 Documentación Completa

```bash

# 1️⃣ Clonar e instalarVer [SETUP.md](./SETUP.md) para:

git clone https://github.com/gonzaloyacante/portfolio-pbn.git- Instalación detallada paso a paso

cd portfolio-pbn/web- Configuración de base de datos (local y nube)

pnpm install- Variables de entorno

- Deployment

# 2️⃣ Configurar variables de entorno- Troubleshooting

# Edita .env con tus credenciales (DATABASE_URL, JWT_SECRET, etc.)- Comandos útiles



# 3️⃣ Inicializar base de datos y arrancar---

pnpm prisma:migrate

pnpm seed## 🛠️ Stack Tecnológico

pnpm dev

```### Backend

- **Runtime:** Node.js 18+

**¡Listo!** Abre http://localhost:3000- **Framework:** Express.js

- **ORM:** Prisma

### Acceso al Panel Admin- **Database:** PostgreSQL

- **Auth:** JWT (jsonwebtoken)

```- **Validation:** Zod

URL: http://localhost:3000/admin/login- **Security:** Helmet, CORS, Rate Limiting

Email: admin@paolabolivar.com- **Logging:** Pino

Password: Admin123!- **Language:** TypeScript

```

### Frontend

---- **Framework:** Next.js 16 (App Router)

- **UI:** React 19

## 🛠️ Stack Tecnológico- **Styling:** Tailwind CSS 4

- **Components:** shadcn/ui (Radix UI)

### Core- **Forms:** React Hook Form + Zod

- **Framework:** Next.js 16 (App Router + Server Actions)- **State:** React Context / Zustand (próximamente)

- **Language:** TypeScript 5- **Language:** TypeScript

- **React:** 19

- **Database:** PostgreSQL (NeonDB)---

- **ORM:** Prisma 6

## 📋 Requisitos

### Backend & API

- **API:** Next.js API Routes (sin backend separado)- Node.js 18+

- **Auth:** JWT (jsonwebtoken + bcryptjs)- PostgreSQL 12+

- **Validation:** Zod- npm o pnpm

- **Images:** Cloudinary

---

### Frontend & UI

- **Styling:** Tailwind CSS 4## 🗄️ Modelos de Base de Datos

- **Components:** shadcn/ui (Radix UI)

- **Forms:** React Hook Form + Zod- **User** - Usuarios administradores

- **Icons:** Lucide React- **ProjectCategory** - Categorías de proyectos

- **Project** - Proyectos del portfolio

### DevOps & Deployment- **ProjectImage** - Imágenes de proyectos

- **Hosting:** Vercel (Serverless)- **Contact** - Mensajes de contacto

- **Database:** Neon (Serverless Postgres)- **Skill** - Habilidades/especialidades

- **CDN:** Vercel Edge Network- **SocialLink** - Redes sociales

- **CI/CD:** Vercel Git Integration- **PortfolioSettings** - Configuración global (singleton)



---Ver `api/prisma/schema.prisma` para detalles completos.



## 📦 Scripts Disponibles---



```bash## 🔐 Seguridad

pnpm dev                 # Desarrollo con hot-reload

pnpm build               # Build para producción- ✅ Contraseñas hasheadas con bcrypt (10 rounds)

pnpm start               # Servidor producción- ✅ JWT con expiración configurable

pnpm lint                # Linter- ✅ Refresh tokens en httpOnly cookies

pnpm type-check          # Verificar tipos TypeScript- ✅ Rate limiting por IP

pnpm prisma:generate     # Generar cliente Prisma- ✅ CORS configurado

pnpm prisma:migrate      # Crear nueva migración- ✅ Helmet para headers de seguridad

pnpm prisma:deploy       # Aplicar migraciones (prod)- ✅ Validación de inputs con Zod

pnpm prisma:studio       # GUI para explorar DB- ✅ SQL injection prevenido por Prisma

pnpm seed                # Poblar DB con datos iniciales

```---



---## 🚧 Roadmap



## 🔐 Seguridad- [x] Backend API completo

- [x] Frontend público conectado

El sistema implementa las mejores prácticas de seguridad:- [x] Autenticación JWT

- [x] CRUD de proyectos y categorías

✅ **Autenticación JWT** - Tokens seguros con expiración  - [x] Sistema de contactos

✅ **Refresh Tokens** - En cookies httpOnly para mayor seguridad  - [x] Skills y redes sociales

✅ **Passwords Hasheados** - bcryptjs con 10 rounds  - [ ] Panel de administración UI

✅ **Validación Estricta** - Todos los inputs validados con Zod  - [ ] Upload de imágenes (Vercel Blob / Cloudinary)

✅ **SQL Injection** - Prevenido por Prisma ORM  - [ ] Email notifications con templates

✅ **XSS Protection** - React escapa automáticamente  - [ ] Analytics dashboard

✅ **CORS Configurado** - Solo orígenes permitidos  - [ ] Tests unitarios e integración

✅ **Environment Variables** - Secrets nunca en el código  - [ ] CI/CD con GitHub Actions



------



## 🚀 Deployment## 📦 Scripts Disponibles



### Deploy Automático en Vercel (Recomendado)### Backend (api/)

```bash

1. **Conecta tu repositorio GitHub a Vercel**npm run dev          # Desarrollo con hot-reload

2. **Configura las variables de entorno** en Vercel Dashboardnpm run build        # Build para producción

3. **¡Deploy automático en cada push!**npm start            # Iniciar producción

npm run prisma:studio # GUI para ver/editar DB

Variables de entorno requeridas:npm run seed         # Poblar DB con datos iniciales

```env```

DATABASE_URL=postgresql://...          # Tu base de datos Neon

JWT_SECRET=...                         # Genera con: openssl rand -base64 32### Frontend (web/)

JWT_REFRESH_SECRET=...                 # Otro secret diferente```bash

CLOUDINARY_CLOUD_NAME=...             # Tu cuenta Cloudinarynpm run dev          # Desarrollo

CLOUDINARY_API_KEY=...npm run build        # Build para producción

CLOUDINARY_API_SECRET=...npm start            # Iniciar producción

```npm run lint         # Linter

```

---

---

## 👥 Equipo

## 🤝 Contribuir

<table>

  <tr>Este es un proyecto privado, pero si tienes sugerencias:

    <td align="center">

      <img src="https://github.com/gonzaloyacante.png" width="100px;" alt=""/>1. Fork el proyecto

      <br />2. Crea tu Feature Branch (`git checkout -b feature/AmazingFeature`)

      <sub><b>Gonzalo Yacante</b></sub>3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)

      <br />4. Push al Branch (`git push origin feature/AmazingFeature`)

      <sub>Full Stack Developer</sub>5. Abre un Pull Request

      <br />

      <a href="https://github.com/gonzaloyacante">GitHub</a>---

    </td>

    <td align="center">## 📄 Licencia

      <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Proyecto%20%2820250922053728%29-G0TPYQ1DpNcU4y9B5b8BwSdn7WALr3.webp" width="100px;" alt=""/>

      <br />Este proyecto es propiedad privada de Gonzalo Yacante & Paola Bolívar Nievas.

      <sub><b>Paola Bolívar Nievas</b></sub>

      <br />---

      <sub>Maquilladora Profesional</sub>

      <br />## 👤 Autor

      <a href="https://instagram.com/paolabolivarnievas">Instagram</a>

    </td>**Gonzalo Yacante**

  </tr>- GitHub: [@gonzaloyacante](https://github.com/gonzaloyacante)

</table>

**Cliente:**

---- Paola Bolívar Nievas - Maquilladora Profesional



## 💬 Soporte---



¿Necesitas ayuda?## 🙏 Agradecimientos



- 📧 Email: gonzalo.yacante@gmail.com- Next.js team por el increíble framework

- 🐛 Issues: [GitHub Issues](https://github.com/gonzaloyacante/portfolio-pbn/issues)- Prisma team por el mejor ORM

- shadcn/ui por los componentes hermosos

---- Vercel por el hosting



<div align="center">---



**Hecho con ❤️, ☕ y mucho 💄 por [Gonzalo Yacante](https://github.com/gonzaloyacante)**## 📞 Soporte



[⬆ Volver arriba](#-portfolio-paola-bolívar-nievas)Para problemas o preguntas:

1. Revisa [SETUP.md](./SETUP.md)

</div>2. Abre un Issue en GitHub

3. Contacta al desarrollador

---

**Hecho con ❤️ y ☕ por Gonzalo Yacante**
