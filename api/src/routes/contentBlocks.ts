import { Router, type IRouter } from 'express';
import { 
  getContentBlocks, 
  getContentBlock, 
  createContentBlock, 
  updateContentBlock, 
  deleteContentBlock 
} from '../controllers/contentBlockController';
import { authenticate } from '../middleware/auth';

const router: IRouter = Router();

// Rutas públicas
router.get('/', getContentBlocks);
router.get('/:id', getContentBlock);

// Rutas protegidas (admin only)
router.post('/', authenticate, createContentBlock);
router.put('/:id', authenticate, updateContentBlock);
router.delete('/:id', authenticate, deleteContentBlock);

export default router;
