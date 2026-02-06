import { Router } from 'express';
import authRoutes from './features/auth/auth.routes';
import expenseRoutes from './features/expense/expense.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/expenses', expenseRoutes);

export default router;
