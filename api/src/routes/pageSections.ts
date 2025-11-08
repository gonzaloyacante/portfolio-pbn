import { Router, type IRouter } from 'express';
import { 
  getPageSections, 
  getPageSection, 
  createPageSection, 
  updatePageSection, 
  deletePageSection,
  reorderPageSections
} from '../controllers/pageSectionController';
import { authenticate } from '../middleware/auth';

const router: IRouter = Router();

// Rutas públicas
router.get('/', getPageSections);
router.get('/:id', getPageSection);

// Rutas protegidas (admin only)
router.post('/', authenticate, createPageSection);
router.put('/reorder', authenticate, reorderPageSections);
router.put('/:id', authenticate, updatePageSection);
router.delete('/:id', authenticate, deletePageSection);

export default router;
