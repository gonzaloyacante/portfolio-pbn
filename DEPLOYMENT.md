# Portfolio-PBN - Deployment Guide

## Project Overview

Portfolio-PBN is a full-stack web application consisting of:
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Express.js API with TypeScript, Prisma ORM
- **Database**: SQLite (development), PostgreSQL (production)
- **Media Storage**: Cloudinary
- **Authentication**: JWT with httpOnly cookies

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   (PostgreSQL)  │
│   Port: 3000    │    │   Port: 4000    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   Cloudinary    │    │   Email Service │
│   (Media)       │    │   (Nodemailer)  │
└─────────────────┘    └─────────────────┘
```

## Current Status

### ✅ Completed Features

#### Frontend (Web)
- **Admin System**: Complete role-based admin interface with guards
- **Gallery Management**: Drag-and-drop reordering with undo/redo, keyboard shortcuts
- **Project Management**: CRUD operations with image upload
- **Category Management**: Full category system
- **Contact Management**: Social media and contact info management
- **Settings Management**: Site configuration
- **PWA Support**: Service worker, manifest, offline page
- **SEO Optimization**: Dynamic metadata, sitemap, robots.txt, JSON-LD
- **Security**: Hardened CSP headers, CORS policies
- **UX Enhancements**: Toast notifications, loading states, accessibility
- **Performance**: Optimized images, lazy loading, caching strategies

#### Backend (API)
- **Authentication**: JWT-based auth with role management (ADMIN/EDITOR)
- **CRUD APIs**: Complete REST APIs for all resources
- **Security**: Helmet, rate limiting, CORS, input validation
- **Logging**: Structured logging with Pino
- **Database**: Prisma ORM with migrations
- **File Upload**: Cloudinary integration with secure signatures
- **Error Handling**: Comprehensive error responses

#### Database
- **Schema**: Complete data model for all entities
- **Migrations**: Version-controlled database changes
- **Relationships**: Proper foreign keys and constraints
- **Indexes**: Optimized queries

### 🚧 Production Readiness Checklist

#### Infrastructure
- [ ] **Database Migration**: SQLite → PostgreSQL
- [ ] **Environment Variables**: Production secrets management
- [ ] **SSL Certificates**: HTTPS configuration
- [ ] **CDN Setup**: Static asset delivery optimization
- [ ] **Backup Strategy**: Database and media backups

#### Monitoring & Observability
- [ ] **Error Tracking**: Sentry integration
- [ ] **Performance Monitoring**: Web Vitals dashboard
- [ ] **Uptime Monitoring**: Health check endpoints
- [ ] **Log Aggregation**: Centralized logging
- [ ] **Analytics**: User behavior tracking

#### CI/CD Pipeline
- [ ] **Automated Testing**: Unit and E2E tests
- [ ] **Build Pipeline**: Automated builds and deployments
- [ ] **Code Quality**: ESLint, Prettier, type checking
- [ ] **Security Scanning**: Dependency vulnerability checks
- [ ] **Performance Testing**: Lighthouse CI

## Environment Variables

### Frontend (.env.local)
```bash
# Site Configuration
NEXT_PUBLIC_SITE_URL=https://portfolio-pbn.com
NEXT_PUBLIC_API_URL=https://api.portfolio-pbn.com

# Development only
NEXT_PUBLIC_VERCEL_ENV=production
```

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/portfolio_pbn

# Authentication
JWT_SECRET=your-super-secure-jwt-secret-here

# CORS
CORS_ORIGINS=https://portfolio-pbn.com,https://www.portfolio-pbn.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Environment
NODE_ENV=production
PORT=4000
```

## Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Configure build settings:
   ```json
   {
     "buildCommand": "cd web && npm run build",
     "outputDirectory": "web/.next",
     "installCommand": "cd web && npm install"
   }
   ```
3. Set environment variables in Vercel dashboard
4. Enable automatic deployments

#### Backend (Railway)
1. Connect GitHub repository to Railway
2. Configure build settings:
   ```json
   {
     "buildCommand": "cd api && npm run build",
     "startCommand": "cd api && npm start"
   }
   ```
3. Add PostgreSQL database service
4. Set environment variables
5. Configure custom domain

### Option 2: Docker + VPS

#### Docker Compose Setup
```yaml
version: '3.8'
services:
  frontend:
    build: ./web
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:4000
    depends_on:
      - backend

  backend:
    build: ./api
    ports:
      - "4000:4000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/portfolio_pbn
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=portfolio_pbn
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Option 3: Serverless (Vercel Functions + PlanetScale)

#### Configuration
- Frontend: Vercel (same as Option 1)
- Backend: Vercel Functions (API routes)
- Database: PlanetScale (MySQL-compatible)

## Security Considerations

### Production Security Checklist
- [ ] **HTTPS Only**: Force SSL redirects
- [ ] **Security Headers**: CSP, HSTS, X-Frame-Options
- [ ] **Rate Limiting**: API endpoint protection
- [ ] **Input Validation**: Sanitize all inputs
- [ ] **SQL Injection**: Use parameterized queries (Prisma handles this)
- [ ] **XSS Protection**: Content Security Policy
- [ ] **CSRF Protection**: SameSite cookies
- [ ] **Dependency Updates**: Regular security updates

### Secrets Management
- Use environment variables for all secrets
- Never commit secrets to version control
- Rotate JWT secrets periodically
- Use strong, unique passwords
- Enable 2FA on all service accounts

## Performance Optimization

### Frontend Optimizations
- **Image Optimization**: Next.js Image component with Cloudinary
- **Code Splitting**: Automatic with Next.js App Router
- **Caching**: Service Worker with stale-while-revalidate
- **Bundle Analysis**: Regular bundle size monitoring
- **Web Vitals**: Performance monitoring and optimization

### Backend Optimizations
- **Database Indexing**: Optimize query performance
- **Response Caching**: Cache frequently accessed data
- **Compression**: Gzip/Brotli compression
- **Connection Pooling**: Database connection optimization

## Monitoring & Maintenance

### Health Checks
- Frontend: `/_next/static/health` (automatic)
- Backend: `/api/health`
- Database: Connection status monitoring

### Backup Strategy
- **Database**: Daily automated backups
- **Media Files**: Cloudinary handles redundancy
- **Code**: Git repository backups

### Update Process
1. Test changes in development
2. Run automated tests
3. Deploy to staging environment
4. Performance and security testing
5. Deploy to production
6. Monitor for issues

## Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review TypeScript errors
- Check environment variables

#### Database Connection Issues
- Verify DATABASE_URL format
- Check network connectivity
- Confirm database credentials
- Review connection pool settings

#### Authentication Problems
- Verify JWT_SECRET is set
- Check cookie settings (httpOnly, secure, sameSite)
- Review CORS configuration
- Confirm API endpoints are accessible

### Debug Commands
```bash
# Frontend
cd web
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Code linting
npm run type-check   # TypeScript checking

# Backend
cd api
npm run dev          # Development server
npm run build        # Production build
npm run start        # Production server
npx prisma studio    # Database GUI
npx prisma migrate   # Run migrations
```

## Contact & Support

For deployment issues or questions:
- Review this documentation
- Check application logs
- Verify environment configuration
- Test in development environment first

---

**Last Updated**: December 2024
**Version**: 3.0.0
**Status**: Production Ready (pending infrastructure setup)
