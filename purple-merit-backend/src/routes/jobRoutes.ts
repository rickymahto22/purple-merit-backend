import { Router } from 'express';
import { runCode } from '../controllers/jobController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Only logged-in users can run code
router.post('/execute', authenticate, runCode);

export default router;