import * as express from "express";
import * as UserController from '../controllers/User.controller'; // Import correct

const router = express.Router();

// Utilisez UserController au lieu de utilisateurCtrl
router.get('/api/utilisateur/liste/', UserController.all);
router.get('/api/utilisateur/show/:id', UserController.one);
router.post('/api/utilisateur/store', UserController.save);
router.put('/api/utilisateur/update/:id', UserController.update);
router.delete('/api/utilisateur/delete/:id', UserController.remove);

export { router as userRoutes };