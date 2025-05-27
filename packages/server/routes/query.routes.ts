import { Router } from 'express';
import { queryController } from '@/controllers/query.controller';

const router = Router();

router.post('/', queryController.handleQuery);

export default router;
