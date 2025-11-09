import { Router, type Router as RouterType } from 'express';
import * as contactController from '../controllers/contactController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router: RouterType = Router();

// Public routes
router.post('/', contactController.createContact);

// Admin routes
router.get('/admin', authenticate, requireAdmin, contactController.getContacts);
router.get('/admin/:id', authenticate, requireAdmin, contactController.getContact);
router.put('/admin/:id', authenticate, requireAdmin, contactController.updateContact);
router.delete('/admin/:id', authenticate, requireAdmin, contactController.deleteContact);

export default router;
