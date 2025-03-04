import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { login } from '../controllers/Auth.controller';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      nom: string;
      prenom: string;
      dateNaissance: Date;
      sexe: string;
      email: string;
    };
  }
}

const router = Router();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Accès non autorisé' });
  }

  try {
    const decoded = jwt.verify(token, 'votre_secret_key') as Request['user'];
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalide' });
  }
};

router.post('/login', login);

export default router;