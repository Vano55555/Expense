import { Router } from 'express';
import * as ExpenseController from '../controllers/Expense.controller';

const router = Router();

router.get('/', ExpenseController.getAllExpenses);
router.post('/', ExpenseController.createExpense);
router.put('/:id', ExpenseController.updateExpense);
router.delete('/:id', ExpenseController.deleteExpense);

export default router;
