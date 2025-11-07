# 🚀 Portfolio PBN v2 - Guía Completa de Setup

Esta es la guía completa para levantar el sistema CMS del portfolio. Incluye backend API y frontend con panel de administración.

---

## 📋 Requisitos Previos

- **Node.js** 18+ 
- **PostgreSQL** 12+ (local o en la nube - Supabase/Railway/Neon recomendado)
- **npm** o **pnpm**

---

## 🔧 PARTE 1: Backend API

### 1.1. Instalar Dependencias

```bash
cd api
npm install
```

### 1.2. Configurar Variables de Entorno

Copia el archivo de ejemplo y edita con tus valores:

```bash
cp .env.example .env
```

**Edita `.env` con tus valores:**

```env
# Database - Obtén esto de tu proveedor PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/portfolio_pbn_v2"

# JWT Secrets - Genera strings aleatorios seguros
JWT_SECRET="tu-clave-secreta-super-segura-minimo-32-caracteres"
JWT_REFRESH_SECRET="otra-clave-diferente-tambien-minimo-32-caracteres"

# Frontend URL
FRONTEND_URL="http://localhost:3000"
CORS_ORIGINS="http://localhost:3000"

# SMTP (opcional - para emails de contacto)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password-de-gmail"

# Admin inicial
ADMIN_EMAIL="admin@paolabolivar.com"
ADMIN_NAME="Paola Bolívar Nievas"
ADMIN_PASSWORD="CambiaEstaPassword123!"
```

**🔐 Importante:** 
- Para JWT secrets, usa: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Para Gmail SMTP, genera App Password en: https://myaccount.google.com/apppasswords

### 1.3. Configurar Base de Datos

#### Opción A: PostgreSQL Local con Docker

```bash
# Levantar PostgreSQL en Docker
docker run --name portfolio-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=portfolio_pbn_v2 \
  -p 5432:5432 \
  -d postgres:15

# Tu DATABASE_URL sería:
# DATABASE_URL="postgresql://postgres:password@localhost:5432/portfolio_pbn_v2"
```

#### Opción B: PostgreSQL en la Nube (Recomendado)

**Supabase** (gratis):
1. Crea cuenta en https://supabase.com
2. Crea nuevo proyecto
3. Copia el "Connection String" desde Settings > Database
4. Pega en `.env` como `DATABASE_URL`

**Railway** (gratis):
1. Crea cuenta en https://railway.app
2. New Project > Add PostgreSQL
3. Copia la connection string
4. Pega en `.env`

**Neon** (gratis):
1. Crea cuenta en https://neon.tech
2. Crea proyecto
3. Copia connection string
4. Pega en `.env`

### 1.4. Generar Prisma Client y Ejecutar Migraciones

```bash
# Generar cliente de Prisma
npm run prisma:generate

# Crear y aplicar migraciones
npm run prisma:migrate

# Poblar base de datos con datos iniciales
npm run seed
```

**Nota:** El seed creará:
- Usuario admin con las credenciales de `.env`
- 6 categorías de proyectos
- 6 skills de ejemplo
- 4 redes sociales
- Configuración inicial del portfolio
- 1 proyecto de ejemplo

### 1.5. Levantar Servidor de Desarrollo

```bash
npm run dev
```

✅ El servidor debería estar corriendo en: **http://localhost:5000**

Verifica con: http://localhost:5000/health

---

## 🎨 PARTE 2: Frontend (Next.js)

### 2.1. Instalar Dependencias

```bash
cd ../web
npm install
```

### 2.2. Configurar Variables de Entorno

Crea `.env.local`:

```bash
# En Windows PowerShell:
New-Item -Path ".env.local" -ItemType File

# O manualmente crea el archivo .env.local con:
```

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 2.3. Levantar Servidor de Desarrollo

```bash
npm run dev
```

✅ El frontend debería estar corriendo en: **http://localhost:3000**

---

## 🔑 PARTE 3: Acceder al Sistema

### Frontend Público
- **URL:** http://localhost:3000
- Navega por proyectos, about, contacto
- Todos los datos vienen de la API

### Panel de Administración
- **URL:** http://localhost:3000/admin (próximamente)
- **Email:** El que pusiste en `ADMIN_EMAIL` (.env)
- **Password:** El que pusiste en `ADMIN_PASSWORD` (.env)

Desde el admin podrás:
- ✅ Crear/editar/eliminar proyectos
- ✅ Gestionar categorías
- ✅ Ver y responder contactos
- ✅ Editar skills y redes sociales
- ✅ Configurar portfolio (SEO, bio, imágenes, etc.)

---

## 🛠️ Comandos Útiles

### Backend (en carpeta `api/`)

```bash
# Desarrollo con hot-reload
npm run dev

# Build para producción
npm run build

# Iniciar producción
npm start

# Prisma Studio (GUI para ver/editar DB)
npm run prisma:studio

# Generar nuevo cliente Prisma
npm run prisma:generate

# Crear migración
npm run prisma:migrate

# Poblar DB con datos iniciales
npm run seed
```

### Frontend (en carpeta `web/`)

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar producción
npm start

# Linter
npm run lint
```

---

## 📦 Deployment

### Backend (Railway / Render / Fly.io)

1. Push código a GitHub
2. Conecta repo en Railway/Render
3. Configura variables de entorno (las mismas de `.env`)
4. Deploy automático

**Variables críticas en producción:**
```env
NODE_ENV=production
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
FRONTEND_URL=https://tu-dominio.com
CORS_ORIGINS=https://tu-dominio.com
```

### Frontend (Vercel)

```bash
# Desde carpeta web/
npm run build
vercel deploy
```

O conecta GitHub repo directamente en Vercel dashboard.

**Variables en Vercel:**
```env
NEXT_PUBLIC_API_URL=https://tu-api.railway.app/api
```

---

## 🐛 Troubleshooting

### Error: "DATABASE_URL" no definida
- Verifica que `.env` existe en carpeta `api/`
- Verifica que DATABASE_URL está correctamente formateada

### Error: Prisma Client no generado
```bash
cd api
npm run prisma:generate
```

### Error: CORS en el frontend
- Verifica que `FRONTEND_URL` en backend `.env` coincida con la URL del frontend
- Verifica que `NEXT_PUBLIC_API_URL` apunte correctamente al backend

### Frontend no conecta con backend
- Asegúrate de que ambos servidores estén corriendo
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

### Error al hacer seed
- Borra datos: `npx prisma migrate reset` (⚠️ borra todo)
- Vuelve a ejecutar: `npm run seed`

---

## 📚 Próximos Pasos

1. ✅ Backend API completo funcionando
2. ✅ Frontend público conectado a API
3. 🔄 Panel de administración (en desarrollo)
4. 🔄 Upload de imágenes (Vercel Blob / Cloudinary)
5. 🔄 Email notifications con templates
6. 🔄 Analytics y SEO avanzado

---

## 💡 Consejos

- **Desarrollo:** Usa Prisma Studio para ver/editar datos rápido: `npm run prisma:studio`
- **Testing:** Usa Postman o Thunder Client para probar endpoints
- **Logs:** El backend muestra logs detallados en desarrollo
- **DB Backup:** Exporta regularmente: `pg_dump > backup.sql`

---

## 📞 Soporte

Si algo no funciona:
1. Revisa los logs en terminal
2. Verifica las variables de entorno
3. Asegúrate de que todas las dependencias están instaladas
4. Revisa este README paso a paso

---

**¡Listo! Tu CMS del portfolio está funcionando.** 🎉

Ahora tu novia puede editar TODO desde el panel de admin sin tocar código.
