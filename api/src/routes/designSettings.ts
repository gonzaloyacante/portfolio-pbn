import { Router, type IRouter } from 'express';
import { 
  getDesignSettings, 
  updateDesignSettings 
} from '../controllers/designSettingsController';
import { authenticate } from '../middleware/auth';

const router: IRouter = Router();

// Rutas públicas
router.get('/', getDesignSettings);

// Rutas protegidas (admin only)
router.put('/', authenticate, updateDesignSettings);

export default router;
