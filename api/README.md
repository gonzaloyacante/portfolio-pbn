# Portfolio PBN API v2

Backend API completo para el portfolio de Paola Bolívar Nievas con panel CMS de administración.

## Tecnologías

- **Express.js** - Framework web
- **Prisma** - ORM para PostgreSQL
- **TypeScript** - Lenguaje tipado
- **JWT** - Autenticación
- **Nodemailer** - Envío de emails
- **Pino** - Logging estructurado

## Características

- ✅ Autenticación JWT con refresh tokens
- ✅ Panel de administración completo (CRUD)
- ✅ Gestión de proyectos y categorías
- ✅ Sistema de contacto con notificaciones
- ✅ Gestión de skills y redes sociales
- ✅ Configuración global del portfolio
- ✅ Validación de datos con Zod
- ✅ Rate limiting y seguridad (Helmet, CORS)
- ✅ Logs estructurados con request ID

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Generar Prisma Client
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Poblar base de datos inicial
npm run seed

# Iniciar servidor de desarrollo
npm run dev
```

## Scripts disponibles

- `npm run dev` - Servidor en modo desarrollo con hot-reload
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Ejecutar servidor en producción
- `npm run prisma:generate` - Generar Prisma Client
- `npm run prisma:migrate` - Crear y aplicar migraciones
- `npm run prisma:studio` - Abrir Prisma Studio (GUI)
- `npm run seed` - Poblar base de datos con datos iniciales
- `npm test` - Ejecutar tests

## Estructura

```
api/
├── src/
│   ├── config/          # Configuración (DB, env, CORS)
│   ├── middleware/      # Middleware (auth, errors, validation)
│   ├── routes/          # Rutas de la API
│   ├── controllers/     # Lógica de negocio
│   ├── services/        # Servicios (email, upload)
│   ├── utils/           # Utilidades (JWT, validators)
│   ├── types/           # Tipos TypeScript
│   ├── app.ts           # Configuración Express
│   └── server.ts        # Punto de entrada
├── prisma/
│   ├── schema.prisma    # Modelos de base de datos
│   ├── seed.ts          # Datos iniciales
│   └── migrations/      # Migraciones de BD
└── package.json
```

## Endpoints principales

### Públicos
- `GET /api/projects` - Listar proyectos publicados
- `GET /api/projects/:slug` - Obtener proyecto por slug
- `GET /api/categories` - Listar categorías
- `GET /api/skills` - Listar habilidades
- `GET /api/social-links` - Listar redes sociales
- `GET /api/settings` - Obtener configuración del portfolio
- `POST /api/contacts` - Enviar mensaje de contacto

### Admin (requieren autenticación)
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/register` - Registrar admin
- `POST /api/auth/refresh` - Renovar token
- `GET/POST/PUT/DELETE /api/projects` - CRUD proyectos
- `GET/POST/PUT/DELETE /api/categories` - CRUD categorías
- `GET/POST/PUT/DELETE /api/skills` - CRUD habilidades
- `GET/POST/PUT/DELETE /api/social-links` - CRUD redes
- `GET/PUT/DELETE /api/contacts` - Gestionar contactos
- `GET/PUT /api/settings` - Gestionar configuración

## Base de datos

PostgreSQL recomendado. Modelos principales:

- **User** - Usuarios administradores
- **ProjectCategory** - Categorías de proyectos
- **Project** - Proyectos del portfolio
- **ProjectImage** - Imágenes de proyectos
- **Contact** - Mensajes de contacto
- **Skill** - Habilidades/especialidades
- **SocialLink** - Redes sociales
- **PortfolioSettings** - Configuración global (singleton)

## Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- JWT con expiración configurable
- Rate limiting (100 req/min general, 5 req/15min login)
- CORS configurado
- Helmet para headers de seguridad
- Validación de inputs con Zod
- SQL injection prevenido por Prisma ORM

## Deployment

Ver `.env.example` para variables requeridas en producción.

Asegurar:
- `NODE_ENV=production`
- `DATABASE_URL` apuntando a base de datos de producción
- `JWT_SECRET` y `JWT_REFRESH_SECRET` únicos y seguros
- SMTP configurado para emails
- CORS con dominio de producción

## Licencia

MIT
