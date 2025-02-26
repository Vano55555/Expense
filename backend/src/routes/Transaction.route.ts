import { Router } from 'express';
import * as TransactionController from '../controllers/Transaction.controller';

const router = Router();

router.get('/', TransactionController.getAllTransactions);
router.post('/', TransactionController.createTransaction);
router.put('/:id', TransactionController.updateTransaction);
router.delete('/:id', TransactionController.deleteTransaction);

export default router;
