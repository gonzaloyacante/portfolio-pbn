import { Router, type Router as RouterType } from 'express';
import * as categoryController from '../controllers/categoryController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router: RouterType = Router();

// Public routes
router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);

// Admin routes
router.post('/admin', authenticate, requireAdmin, categoryController.createCategory);
router.put('/admin/:id', authenticate, requireAdmin, categoryController.updateCategory);
router.delete('/admin/:id', authenticate, requireAdmin, categoryController.deleteCategory);

export default router;
