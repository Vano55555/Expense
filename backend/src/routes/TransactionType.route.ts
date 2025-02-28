import { Router } from 'express';
import * as TransactionTypeController from '../controllers/TransactionType.controller';

const router = Router();

router.get('/', TransactionTypeController.getAllTransactionTypes); 
router.get('/:id', TransactionTypeController.getTransactionTypeById); 
router.post('/', TransactionTypeController.createTransactionType); 
router.put('/:id', TransactionTypeController.updateTransactionType); 
router.delete('/:id', TransactionTypeController.deleteTransactionType);

export default router;
