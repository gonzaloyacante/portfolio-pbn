import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';

// Import routes
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import categoryRoutes from './routes/categories';
import contactRoutes from './routes/contacts';
import skillRoutes from './routes/skills';
import socialLinkRoutes from './routes/socialLinks';
import settingsRoutes from './routes/settings';
import designSettingsRoutes from './routes/designSettings';
import pageSectionsRoutes from './routes/pageSections';
import contentBlocksRoutes from './routes/contentBlocks';

const app: Express = express();

// Security middleware
app.use(helmet());
app.disable('x-powered-by');

// CORS
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (config.cors.origins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS: Origen no permitido'));
      }
    },
    credentials: true,
  })
);

// Compression
app.use(compression());

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Demasiadas solicitudes desde esta IP, intenta de nuevo más tarde',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/social-links', socialLinkRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/design-settings', designSettingsRoutes);
app.use('/api/page-sections', pageSectionsRoutes);
app.use('/api/content-blocks', contentBlocksRoutes);

// 404 handler
app.use(notFound);

// Error handler (must be last)
app.use(errorHandler);

export default app;
