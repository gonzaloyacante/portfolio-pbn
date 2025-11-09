import { Router, type Router as RouterType } from 'express';
import * as socialLinkController from '../controllers/socialLinkController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router: RouterType = Router();

// Public routes
router.get('/', socialLinkController.getSocialLinks);

// Admin routes
router.post('/admin', authenticate, requireAdmin, socialLinkController.createSocialLink);
router.put('/admin/:id', authenticate, requireAdmin, socialLinkController.updateSocialLink);
router.delete('/admin/:id', authenticate, requireAdmin, socialLinkController.deleteSocialLink);

export default router;
