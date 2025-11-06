# Paola Bolívar Nievas Portfolio - Complete Setup Guide

## Frontend Setup (Next.js)

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Environment Variables
Create `.env.local`:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000`

---

## Backend Setup (Express + Node + Prisma)

### 1. Navigate to Backend Directory
\`\`\`bash
cd backend-setup
\`\`\`

### 2. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Setup Environment Variables
Copy `.env.example` to `.env` and fill in your values:
\`\`\`bash
cp .env.example .env
\`\`\`

### 4. Setup Database

#### Option A: PostgreSQL (Recommended)
\`\`\`bash
# Install PostgreSQL locally or use Docker
docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/paola_portfolio"
\`\`\`

#### Option B: Using Supabase (Cloud)
1. Create account at https://supabase.com
2. Create new project
3. Copy connection string to DATABASE_URL in .env

### 5. Run Prisma Migrations
\`\`\`bash
npm run prisma:generate
npm run prisma:migrate
\`\`\`

### 6. Seed Database (Optional)
Create `prisma/seed.ts`:
\`\`\`typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await prisma.projectCategory.createMany({
    data: [
      { title: 'Sesiones de fotos', slug: 'sesiones', description: 'Sesiones fotográficas profesionales' },
      { title: 'FX', slug: 'fx', description: 'Efectos especiales' },
      { title: 'Teatro', slug: 'teatro', description: 'Maquillaje teatral' },
      { title: 'Maquillaje fantasía', slug: 'fantasia', description: 'Diseños creativos' },
      { title: 'Rodajes', slug: 'rodajes', description: 'Cine y televisión' },
      { title: 'Maquillaje social', slug: 'social', description: 'Eventos especiales' },
    ],
  });

  // Create skills
  await prisma.skill.createMany({
    data: [
      { name: 'Maquillaje Social' },
      { name: 'Caracterización' },
      { name: 'Efectos Especiales' },
      { name: 'Peluquería de Platô' },
      { name: 'Cine & TV' },
      { name: 'Creación de Personajes' },
    ],
  });

  console.log('Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
\`\`\`

Run seed:
\`\`\`bash
npx prisma db seed
\`\`\`

### 7. Start Backend Server
\`\`\`bash
npm run dev
\`\`\`

Server runs on `http://localhost:5000`

---

## Database Schema Overview

### Users
- Admin authentication
- Manages projects and contacts

### ProjectCategories
- Sesiones de fotos
- FX
- Teatro
- Maquillaje fantasía
- Rodajes
- Maquillaje social

### Projects
- Portfolio items
- Linked to categories
- Multiple images per project
- Featured flag for homepage

### ProjectImages
- Gallery images for each project
- Ordered display

### Contacts
- Contact form submissions
- Status tracking (NEW, READ, REPLIED, ARCHIVED)
- Email notifications

### Skills
- Specialties/skills list

### SocialLinks
- Instagram, LinkedIn, TikTok, etc.

### PortfolioSettings
- Global portfolio metadata
- SEO information
- Contact details

---

## Email Configuration

### Gmail Setup
1. Enable 2-factor authentication
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use app password in EMAIL_PASSWORD

### Other Email Services
Update `EMAIL_SERVICE` in `.env` (e.g., 'outlook', 'yahoo')

---

## Deployment

### Frontend (Vercel)
\`\`\`bash
npm run build
vercel deploy
\`\`\`

### Backend (Heroku/Railway/Render)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

---

## API Integration in Frontend

The `lib/api-client.ts` handles all API calls. Use it like:

\`\`\`typescript
import { apiClient } from '@/lib/api-client';

// Get projects
const { data: projects } = await apiClient.getProjects();

// Submit contact form
const { data, error } = await apiClient.submitContact({
  name: 'John',
  email: 'john@example.com',
  subject: 'Inquiry',
  message: 'Hello...'
});
\`\`\`

---

## Troubleshooting

### Database Connection Error
- Check DATABASE_URL format
- Ensure PostgreSQL is running
- Verify credentials

### Email Not Sending
- Check EMAIL_USER and EMAIL_PASSWORD
- Enable "Less secure app access" for Gmail
- Check ADMIN_EMAIL is correct

### CORS Errors
- Verify FRONTEND_URL in backend .env
- Check CORS middleware in server.ts

---

## Next Steps

1. Customize portfolio content in database
2. Add more project categories as needed
3. Setup email notifications
4. Configure social media links
5. Deploy to production
