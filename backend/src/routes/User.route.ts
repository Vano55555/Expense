import * as express from "express";
import * as UserController from '../controllers/User.controller'; // Import correct

const router = express.Router();

// Route pour la connexion
router.post('/api/utilisateur/login', UserController.loginUser);

export { router as userRoutes };