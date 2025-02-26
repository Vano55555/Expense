import { Router } from 'express';
import { getAllUsers, createUser, updateUser, deleteUser, loginUser } from '../controllers/User.controller';

const router = Router();

router.post('/login', loginUser); 
router.get('/', getAllUsers);
router.post('/', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
