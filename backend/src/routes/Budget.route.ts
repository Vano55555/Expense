import { Router } from 'express';
import * as BudgetController from '../controllers/Budget.controller';

const router = Router();

router.get('/', BudgetController.getAllBudgets);
router.post('/', BudgetController.createBudget);
router.put('/:id', BudgetController.updateBudget);
router.delete('/:id', BudgetController.deleteBudget);

export default router;
