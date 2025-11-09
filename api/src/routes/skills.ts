import { Router, type Router as RouterType } from 'express';
import * as skillController from '../controllers/skillController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router: RouterType = Router();

// Public routes
router.get('/', skillController.getSkills);

// Admin routes
router.post('/admin', authenticate, requireAdmin, skillController.createSkill);
router.put('/admin/:id', authenticate, requireAdmin, skillController.updateSkill);
router.delete('/admin/:id', authenticate, requireAdmin, skillController.deleteSkill);

export default router;
