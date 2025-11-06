# Estructura de Backend - Paola Bolívar Nievas Portfolio

## Descripción General
Este documento describe la estructura completa que debe tener el backend (Express + Node + Prisma) para el portfolio de Paola Bolívar Nievas. El frontend está completamente separado y se comunica con el backend a través de una API REST.

---

## 1. Base de Datos - Prisma Schema

### Modelos Principales

#### 1.1 User (Administrador)
\`\`\`
id: String (UUID) - Primary Key
email: String (unique)
password: String (hashed con bcrypt)
name: String
role: String (enum: "ADMIN", "VIEWER")
createdAt: DateTime
updatedAt: DateTime
\`\`\`

**Relaciones:**
- Puede crear/editar Projects
- Puede ver/responder Contacts

---

#### 1.2 ProjectCategory
\`\`\`
id: String (UUID) - Primary Key
slug: String (unique) - "sesiones-de-fotos", "fx", "teatro", etc.
name: String - "Sesiones de fotos", "FX", "Teatro", etc.
description: String (opcional)
order: Int - Para ordenar en el frontend
createdAt: DateTime
updatedAt: DateTime
\`\`\`

**Relaciones:**
- Tiene muchos Projects

---

#### 1.3 Project
\`\`\`
id: String (UUID) - Primary Key
slug: String (unique) - "proyecto-1", "proyecto-2", etc.
title: String - "Sesiones de fotos"
description: String - Descripción larga del proyecto
shortDescription: String - Descripción corta para la tarjeta
category: ProjectCategory (relación)
categoryId: String (FK)
images: ProjectImage[] (relación)
thumbnailUrl: String - URL de la imagen principal
featured: Boolean - Si aparece en la página principal
order: Int - Para ordenar en el grid
status: String (enum: "DRAFT", "PUBLISHED", "ARCHIVED")
createdAt: DateTime
updatedAt: DateTime
\`\`\`

**Relaciones:**
- Pertenece a ProjectCategory
- Tiene muchas ProjectImages

---

#### 1.4 ProjectImage
\`\`\`
id: String (UUID) - Primary Key
projectId: String (FK)
project: Project (relación)
url: String - URL de la imagen en CDN/Storage
alt: String - Texto alternativo
order: Int - Orden en la galería
createdAt: DateTime
\`\`\`

**Relaciones:**
- Pertenece a Project

---

#### 1.5 Contact
\`\`\`
id: String (UUID) - Primary Key
name: String
email: String
phone: String (opcional)
subject: String
message: String
status: String (enum: "NEW", "READ", "RESPONDED", "ARCHIVED")
response: String (opcional) - Respuesta del admin
respondedAt: DateTime (opcional)
createdAt: DateTime
updatedAt: DateTime
\`\`\`

**Relaciones:**
- Standalone (sin relaciones)

---

#### 1.6 Skill
\`\`\`
id: String (UUID) - Primary Key
name: String - "Maquillaje social", "FX", "Caracterización", etc.
description: String (opcional)
icon: String (opcional) - Nombre del ícono o emoji
order: Int
createdAt: DateTime
\`\`\`

**Relaciones:**
- Standalone

---

#### 1.7 SocialLink
\`\`\`
id: String (UUID) - Primary Key
platform: String (enum: "INSTAGRAM", "TIKTOK", "YOUTUBE", "LINKEDIN", "WHATSAPP")
url: String
icon: String - Nombre del ícono
order: Int
createdAt: DateTime
\`\`\`

**Relaciones:**
- Standalone

---

#### 1.8 PortfolioSettings
\`\`\`
id: String (UUID) - Primary Key (singleton)
title: String - "Paola Bolívar Nievas"
description: String - Descripción del portfolio
email: String - Email de contacto
phone: String - Teléfono de contacto
location: String - Ubicación
bio: String - Biografía corta
profileImage: String - URL de foto de perfil
bannerImage: String - URL de imagen de banner
seoTitle: String
seoDescription: String
seoKeywords: String[]
maintenanceMode: Boolean
createdAt: DateTime
updatedAt: DateTime
\`\`\`

**Relaciones:**
- Singleton (solo un registro)

---

## 2. Estructura de Carpetas Backend

\`\`\`
backend/
├── src/
│   ├── config/
│   │   ├── database.ts - Conexión a PostgreSQL
│   │   ├── env.ts - Variables de entorno
│   │   └── cors.ts - Configuración CORS
│   ├── middleware/
│   │   ├── auth.ts - Verificación JWT
│   │   ├── errorHandler.ts - Manejo de errores
│   │   ├── validation.ts - Validación de datos
│   │   └── logger.ts - Logging
│   ├── routes/
│   │   ├── auth.ts - Login, registro
│   │   ├── projects.ts - CRUD de proyectos
│   │   ├── categories.ts - CRUD de categorías
│   │   ├── contacts.ts - Crear contacto, listar (admin)
│   │   ├── skills.ts - CRUD de skills
│   │   ├── social-links.ts - CRUD de redes sociales
│   │   └── settings.ts - Configuración del portfolio
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── projectController.ts
│   │   ├── contactController.ts
│   │   └── ...
│   ├── services/
│   │   ├── emailService.ts - Envío de emails
│   │   ├── uploadService.ts - Manejo de uploads
│   │   └── authService.ts
│   ├── utils/
│   │   ├── validators.ts - Funciones de validación
│   │   ├── jwt.ts - Manejo de JWT
│   │   └── errors.ts - Clases de error personalizadas
│   ├── types/
│   │   └── index.ts - Tipos TypeScript compartidos
│   └── server.ts - Punto de entrada
├── prisma/
│   ├── schema.prisma - Definición de modelos
│   └── migrations/ - Migraciones de BD
├── .env - Variables de entorno
├── .env.example - Ejemplo de variables
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

---

## 3. Endpoints de la API

### 3.1 Autenticación

#### POST /api/auth/register
**Público**
\`\`\`
Body:
{
  "email": "admin@example.com",
  "password": "SecurePassword123!",
  "name": "Admin Name"
}

Response (201):
{
  "id": "uuid",
  "email": "admin@example.com",
  "name": "Admin Name",
  "token": "jwt_token"
}

Errores:
- 400: Email ya existe
- 400: Contraseña débil
\`\`\`

#### POST /api/auth/login
**Público**
\`\`\`
Body:
{
  "email": "admin@example.com",
  "password": "SecurePassword123!"
}

Response (200):
{
  "id": "uuid",
  "email": "admin@example.com",
  "name": "Admin Name",
  "token": "jwt_token"
}

Errores:
- 401: Credenciales inválidas
\`\`\`

#### POST /api/auth/logout
**Autenticado**
\`\`\`
Response (200):
{
  "message": "Logout exitoso"
}
\`\`\`

---

### 3.2 Proyectos

#### GET /api/projects
**Público**
\`\`\`
Query params:
- category?: string (slug)
- featured?: boolean
- limit?: number (default: 10)
- offset?: number (default: 0)

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "slug": "sesiones-de-fotos",
      "title": "Sesiones de fotos",
      "shortDescription": "Descripción corta",
      "thumbnailUrl": "https://...",
      "category": {
        "id": "uuid",
        "slug": "sesiones-de-fotos",
        "name": "Sesiones de fotos"
      },
      "featured": true,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 12,
  "limit": 10,
  "offset": 0
}
\`\`\`

#### GET /api/projects/:slug
**Público**
\`\`\`
Response (200):
{
  "id": "uuid",
  "slug": "sesiones-de-fotos",
  "title": "Sesiones de fotos",
  "description": "Descripción larga...",
  "shortDescription": "Descripción corta",
  "category": {
    "id": "uuid",
    "slug": "sesiones-de-fotos",
    "name": "Sesiones de fotos"
  },
  "images": [
    {
      "id": "uuid",
      "url": "https://...",
      "alt": "Foto 1",
      "order": 1
    }
  ],
  "thumbnailUrl": "https://...",
  "featured": true,
  "createdAt": "2024-01-15T10:30:00Z"
}

Errores:
- 404: Proyecto no encontrado
\`\`\`

#### GET /api/projects/category/:categorySlug
**Público**
\`\`\`
Query params:
- limit?: number
- offset?: number

Response (200):
{
  "data": [...],
  "total": 5,
  "category": {
    "id": "uuid",
    "slug": "sesiones-de-fotos",
    "name": "Sesiones de fotos"
  }
}
\`\`\`

#### POST /api/projects
**Admin Only**
\`\`\`
Headers:
Authorization: Bearer jwt_token

Body:
{
  "title": "Nuevo Proyecto",
  "slug": "nuevo-proyecto",
  "description": "Descripción larga...",
  "shortDescription": "Descripción corta",
  "categoryId": "uuid",
  "thumbnailUrl": "https://...",
  "featured": false,
  "status": "DRAFT"
}

Response (201):
{
  "id": "uuid",
  "title": "Nuevo Proyecto",
  ...
}

Errores:
- 401: No autenticado
- 403: No es admin
- 400: Slug ya existe
\`\`\`

#### PUT /api/projects/:id
**Admin Only**
\`\`\`
Headers:
Authorization: Bearer jwt_token

Body:
{
  "title": "Proyecto Actualizado",
  "description": "Nueva descripción...",
  ...
}

Response (200):
{
  "id": "uuid",
  "title": "Proyecto Actualizado",
  ...
}

Errores:
- 401: No autenticado
- 403: No es admin
- 404: Proyecto no encontrado
\`\`\`

#### DELETE /api/projects/:id
**Admin Only**
\`\`\`
Headers:
Authorization: Bearer jwt_token

Response (200):
{
  "message": "Proyecto eliminado"
}

Errores:
- 401: No autenticado
- 403: No es admin
- 404: Proyecto no encontrado
\`\`\`

---

### 3.3 Categorías

#### GET /api/categories
**Público**
\`\`\`
Response (200):
{
  "data": [
    {
      "id": "uuid",
      "slug": "sesiones-de-fotos",
      "name": "Sesiones de fotos",
      "description": "Descripción...",
      "order": 1
    }
  ]
}
\`\`\`

#### POST /api/categories
**Admin Only**
\`\`\`
Headers:
Authorization: Bearer jwt_token

Body:
{
  "name": "Nueva Categoría",
  "slug": "nueva-categoria",
  "description": "Descripción...",
  "order": 5
}

Response (201):
{
  "id": "uuid",
  ...
}
\`\`\`

#### PUT /api/categories/:id
**Admin Only**
\`\`\`
Headers:
Authorization: Bearer jwt_token

Body:
{
  "name": "Categoría Actualizada",
  ...
}

Response (200):
{
  "id": "uuid",
  ...
}
\`\`\`

#### DELETE /api/categories/:id
**Admin Only**
\`\`\`
Headers:
Authorization: Bearer jwt_token

Response (200):
{
  "message": "Categoría eliminada"
}
\`\`\`

---

### 3.4 Contactos

#### POST /api/contacts
**Público**
\`\`\`
Body:
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "phone": "+34 123 456 789",
  "subject": "Consulta sobre servicios",
  "message": "Me gustaría conocer más sobre..."
}

Response (201):
{
  "id": "uuid",
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "status": "NEW",
  "createdAt": "2024-01-15T10:30:00Z"
}

Errores:
- 400: Campos requeridos faltantes
- 400: Email inválido
- 429: Demasiadas solicitudes (rate limiting)
\`\`\`

#### GET /api/contacts
**Admin Only**
\`\`\`
Headers:
Authorization: Bearer jwt_token

Query params:
- status?: "NEW" | "READ" | "RESPONDED" | "ARCHIVED"
- limit?: number
- offset?: number
- sortBy?: "createdAt" | "name"
- order?: "asc" | "desc"

Response (200):
{
  "data": [
    {
      "id": "uuid",
      "name": "Juan Pérez",
      "email": "juan@example.com",
      "phone": "+34 123 456 789",
      "subject": "Consulta sobre servicios",
      "message": "Me gustaría conocer más sobre...",
      "status": "NEW",
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 25,
  "limit": 10,
  "offset": 0
}
\`\`\`

#### PUT /api/contacts/:id
**Admin Only**
\`\`\`
Headers:
Authorization: Bearer jwt_token

Body:
{
  "status": "READ",
  "response": "Gracias por tu mensaje. Te responderé pronto."
}

Response (200):
{
  "id": "uuid",
  "status": "RESPONDED",
  "response": "Gracias por tu mensaje...",
  "respondedAt": "2024-01-15T11:00:00Z"
}
\`\`\`

#### DELETE /api/contacts/:id
**Admin Only**
\`\`\`
Headers:
Authorization: Bearer jwt_token

Response (200):
{
  "message": "Contacto eliminado"
}
\`\`\`

---

### 3.5 Skills

#### GET /api/skills
**Público**
\`\`\`
Response (200):
{
  "data": [
    {
      "id": "uuid",
      "name": "Maquillaje social",
      "description": "Descripción...",
      "icon": "makeup",
      "order": 1
    }
  ]
}
\`\`\`

#### POST /api/skills
**Admin Only**
\`\`\`
Headers:
Authorization: Bearer jwt_token

Body:
{
  "name": "Nueva Habilidad",
  "description": "Descripción...",
  "icon": "icon-name",
  "order": 5
}

Response (201):
{
  "id": "uuid",
  ...
}
\`\`\`

---

### 3.6 Redes Sociales

#### GET /api/social-links
**Público**
\`\`\`
Response (200):
{
  "data": [
    {
      "id": "uuid",
      "platform": "INSTAGRAM",
      "url": "https://instagram.com/paola",
      "icon": "instagram",
      "order": 1
    }
  ]
}
\`\`\`

#### POST /api/social-links
**Admin Only**
\`\`\`
Headers:
Authorization: Bearer jwt_token

Body:
{
  "platform": "INSTAGRAM",
  "url": "https://instagram.com/paola",
  "icon": "instagram",
  "order": 1
}

Response (201):
{
  "id": "uuid",
  ...
}
\`\`\`

---

### 3.7 Configuración del Portfolio

#### GET /api/settings
**Público**
\`\`\`
Response (200):
{
  "id": "uuid",
  "title": "Paola Bolívar Nievas",
  "description": "Maquilladora especializada en audiovisuales",
  "email": "paola@example.com",
  "phone": "+34 123 456 789",
  "location": "Madrid, España",
  "bio": "Biografía...",
  "profileImage": "https://...",
  "bannerImage": "https://...",
  "seoTitle": "Paola Bolívar Nievas - Maquilladora Profesional",
  "seoDescription": "Portfolio de Paola Bolívar Nievas...",
  "seoKeywords": ["maquillaje", "audiovisuales", "caracterización"],
  "maintenanceMode": false
}
\`\`\`

#### PUT /api/settings
**Admin Only**
\`\`\`
Headers:
Authorization: Bearer jwt_token

Body:
{
  "title": "Paola Bolívar Nievas",
  "description": "Nueva descripción...",
  ...
}

Response (200):
{
  "id": "uuid",
  ...
}
\`\`\`

---

## 4. Tipos de Datos TypeScript

\`\`\`typescript
// Auth
interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest extends LoginRequest {
  name: string;
}

interface AuthResponse {
  id: string;
  email: string;
  name: string;
  token: string;
}

// Projects
interface ProjectCategory {
  id: string;
  slug: string;
  name: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  alt: string;
  order: number;
  createdAt: Date;
}

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  category: ProjectCategory;
  images: ProjectImage[];
  thumbnailUrl: string;
  featured: boolean;
  order: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
}

interface CreateProjectRequest {
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  categoryId: string;
  thumbnailUrl: string;
  featured?: boolean;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
}

// Contacts
interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: "NEW" | "READ" | "RESPONDED" | "ARCHIVED";
  response?: string;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateContactRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

interface UpdateContactRequest {
  status?: "NEW" | "READ" | "RESPONDED" | "ARCHIVED";
  response?: string;
}

// Skills
interface Skill {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  order: number;
  createdAt: Date;
}

// Social Links
interface SocialLink {
  id: string;
  platform: "INSTAGRAM" | "TIKTOK" | "YOUTUBE" | "LINKEDIN" | "WHATSAPP";
  url: string;
  icon: string;
  order: number;
  createdAt: Date;
}

// Settings
interface PortfolioSettings {
  id: string;
  title: string;
  description: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage: string;
  bannerImage: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// API Responses
interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}
\`\`\`

---

## 5. Validaciones

### 5.1 Email
- Formato válido de email
- Máximo 255 caracteres
- Único en la BD

### 5.2 Contraseña
- Mínimo 8 caracteres
- Al menos 1 mayúscula
- Al menos 1 minúscula
- Al menos 1 número
- Al menos 1 carácter especial (!@#$%^&*)

### 5.3 Slug
- Solo letras minúsculas, números y guiones
- Máximo 100 caracteres
- Único en la BD

### 5.4 URL
- Formato válido de URL
- Máximo 500 caracteres

### 5.5 Contacto
- Nombre: 2-100 caracteres
- Email: válido y único por sesión
- Teléfono: formato internacional (opcional)
- Asunto: 5-200 caracteres
- Mensaje: 10-5000 caracteres

---

## 6. Autenticación y Autorización

### 6.1 JWT Token
\`\`\`
Header: Authorization: Bearer <token>

Token contiene:
{
  "id": "uuid",
  "email": "admin@example.com",
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1234571490 (1 hora)
}
\`\`\`

### 6.2 Refresh Token
- Se envía en cookie httpOnly
- Válido por 7 días
- Se usa para obtener nuevo JWT

### 6.3 Roles
- **ADMIN**: Acceso completo a todas las rutas
- **VIEWER**: Solo lectura de proyectos y contactos

---

## 7. Manejo de Errores

### 7.1 Códigos HTTP
- **200**: OK
- **201**: Created
- **400**: Bad Request (validación fallida)
- **401**: Unauthorized (no autenticado)
- **403**: Forbidden (no autorizado)
- **404**: Not Found
- **409**: Conflict (recurso duplicado)
- **429**: Too Many Requests (rate limiting)
- **500**: Internal Server Error

### 7.2 Formato de Error
\`\`\`json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validación fallida",
    "details": {
      "email": "Email inválido",
      "password": "Contraseña muy débil"
    }
  }
}
\`\`\`

---

## 8. Rate Limiting

- **Contactos**: 5 solicitudes por IP por hora
- **Login**: 5 intentos por email por 15 minutos
- **API General**: 100 solicitudes por IP por minuto

---

## 9. Email Notifications

### 9.1 Confirmación de Contacto
\`\`\`
Para: usuario@example.com
Asunto: Hemos recibido tu mensaje

Contenido:
Hola [nombre],

Gracias por contactarme. He recibido tu mensaje y te responderé lo antes posible.

Referencia: [contact_id]

Saludos,
Paola Bolívar Nievas
\`\`\`

### 9.2 Notificación al Admin
\`\`\`
Para: admin@example.com
Asunto: Nuevo contacto: [subject]

Contenido:
Nuevo mensaje de contacto:

Nombre: [name]
Email: [email]
Teléfono: [phone]
Asunto: [subject]
Mensaje: [message]

Responder: [admin_link]
\`\`\`

---

## 10. Seguridad

### 10.1 CORS
\`\`\`
Orígenes permitidos:
- https://paolabolivarnievas.com
- https://www.paolabolivarnievas.com
- http://localhost:3000 (desarrollo)
\`\`\`

### 10.2 HTTPS
- Obligatorio en producción
- Certificado SSL válido

### 10.3 Contraseñas
- Hasheadas con bcrypt (salt rounds: 10)
- Nunca se devuelven en respuestas

### 10.4 Datos Sensibles
- Emails de contacto no se exponen públicamente
- Teléfonos solo visibles para admin

### 10.5 SQL Injection
- Usar Prisma ORM (previene automáticamente)
- Validar y sanitizar todas las entradas

### 10.6 XSS
- Escapar HTML en respuestas
- Usar Content Security Policy headers

---

## 11. Deployment

### 11.1 Variables de Entorno
\`\`\`
DATABASE_URL=postgresql://user:password@host:5432/paola_portfolio
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-key-min-32-chars
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://paolabolivarnievas.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@paolabolivarnievas.com
\`\`\`

### 11.2 Base de Datos
- PostgreSQL 12+
- Backups automáticos diarios
- Índices en campos frecuentemente consultados

### 11.3 Hosting
- Node.js 18+
- PM2 para gestión de procesos
- Nginx como reverse proxy

---

## 12. Testing

### 12.1 Unit Tests
- Validadores
- Servicios
- Utilidades

### 12.2 Integration Tests
- Endpoints de API
- Autenticación
- Manejo de errores

### 12.3 E2E Tests
- Flujo completo de contacto
- Flujo de login y CRUD de proyectos

---

## 13. Documentación API

### 13.1 Swagger/OpenAPI
- Documentación interactiva en `/api/docs`
- Especificación en `/api/docs.json`

### 13.2 Postman Collection
- Incluir en repositorio
- Actualizar con cada cambio de API

---

## 14. Monitoreo y Logging

### 14.1 Logs
- Winston para logging
- Niveles: error, warn, info, debug
- Rotación diaria de logs

### 14.2 Monitoreo
- Sentry para error tracking
- New Relic para performance
- Uptime monitoring

---

## 15. Roadmap Futuro

- [ ] Autenticación OAuth (Google, GitHub)
- [ ] Galería de proyectos con lightbox
- [ ] Sistema de comentarios en proyectos
- [ ] Newsletter subscription
- [ ] Analytics integrado
- [ ] Admin dashboard
- [ ] Caché con Redis
- [ ] CDN para imágenes
- [ ] Webhooks para eventos
- [ ] API GraphQL alternativa

---

## Resumen

Este backend debe ser:
- **Seguro**: Autenticación JWT, validación de datos, CORS
- **Escalable**: Prisma ORM, índices de BD, caché
- **Mantenible**: Código limpio, tipos TypeScript, documentación
- **Confiable**: Manejo de errores, logging, monitoreo
- **Performante**: Paginación, índices, optimizaciones

El frontend se comunica con este backend a través de la API REST, enviando y recibiendo datos en JSON.
