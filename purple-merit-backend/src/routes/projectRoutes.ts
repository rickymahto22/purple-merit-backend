import { Router } from 'express';
import { createProject, getMyProjects } from '../controllers/projectController';
import { authenticate } from '../middleware/auth';

const router = Router();
router.post('/', authenticate, createProject);
router.get('/', authenticate, getMyProjects);
export default router;