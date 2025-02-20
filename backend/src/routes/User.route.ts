import { Router } from 'express';
import { getAllUsers, createUser, updateUser, deleteUser } from '../controllers/User.controller'; // Assure-toi que le chemin est correct

const router = Router();

// Route pour récupérer tous les utilisateurs
router.get('/users', getAllUsers);

// Route pour créer un utilisateur
router.post('/users', createUser);

// Route pour mettre à jour un utilisateur
router.put('/users/:id', updateUser);

// Route pour supprimer un utilisateur
router.delete('/users/:id', deleteUser);

export default router;
