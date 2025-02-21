import { Router } from 'express';
import { getAllUsers, createUser, updateUser, deleteUser } from '../controllers/User.controller';

const router = Router();

// Route pour récupérer tous les utilisateurs
router.get('/', getAllUsers); // Pas besoin de '/users' ici

// Route pour créer un utilisateur
router.post('/', createUser); // Pas besoin de '/users' ici

// Route pour mettre à jour un utilisateur
router.put('/:id', updateUser); // Pas besoin de '/users' ici

// Route pour supprimer un utilisateur
router.delete('/:id', deleteUser); // Pas besoin de '/users' ici

export default router;
