import { Router } from 'express';
import * as ExpenseUserController from '../controllers/Expense_User.controller';

const router = Router();

router.get('/', ExpenseUserController.getAllExpenseUsers);
router.post('/', ExpenseUserController.createExpenseUser);
//router.put('/:id', ExpenseUserController.updateExpenseUser);
router.delete('/:id', ExpenseUserController.deleteExpenseUser);

export default router;
