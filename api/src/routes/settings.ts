import { Router } from 'express';
import * as settingsController from '../controllers/settingsController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', settingsController.getSettings);

// Admin routes
router.put('/admin', authenticate, requireAdmin, settingsController.updateSettings);

export default router;
