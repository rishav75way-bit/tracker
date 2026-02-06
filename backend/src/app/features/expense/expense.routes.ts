import { Router } from 'express';
import { expenseController } from './expense.controller';
import { authMiddleware } from '../../common/middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', expenseController.create);
router.get('/', expenseController.getAll);
router.get('/summary', expenseController.getSummary);
router.get('/stats/categories', expenseController.getCategoryStats);
router.get('/stats/monthly', expenseController.getMonthlyStats);
router.get('/budget', expenseController.getBudget);
router.post('/budget', expenseController.setBudget);
router.get('/:id', expenseController.getById);
router.put('/:id', expenseController.update);
router.delete('/:id', expenseController.delete);

export default router;
