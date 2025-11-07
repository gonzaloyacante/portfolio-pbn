import { Router } from 'express';
import * as projectController from '../controllers/projectController';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', projectController.getProjects);
router.get('/:slug', projectController.getProjectBySlug);
router.get('/category/:categorySlug', projectController.getProjectsByCategory);

// Admin routes
router.get('/admin/all', authenticate, requireAdmin, projectController.getAllProjects);
router.post('/admin', authenticate, requireAdmin, projectController.createProject);
router.put('/admin/:id', authenticate, requireAdmin, projectController.updateProject);
router.delete('/admin/:id', authenticate, requireAdmin, projectController.deleteProject);
router.post('/admin/:id/images', authenticate, requireAdmin, projectController.addProjectImage);
router.delete('/admin/:projectId/images/:imageId', authenticate, requireAdmin, projectController.deleteProjectImage);

export default router;
