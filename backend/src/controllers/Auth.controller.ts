import { Request, Response } from 'express';
import { User } from '../entities/User.entity';
import bcrypt from 'bcrypt';
import { getRepository } from 'typeorm';
import jwt from 'jsonwebtoken';

const JWT_SECRET = 'tonsecretkey';

// Route pour la connexion
export const login = async (req: Request, res: Response):Promise<any>=> {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email et mot de passe sont requis' });
  }

  try {
    // Recherche l'utilisateur par email
    const user = await getRepository(User).findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Utilisateur non trouvé' });
    }

    // Vérifie le mot de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' } 
    );

    // Répondre avec un succès et le token
    return res.status(200).json({
      success: true,
      message: 'Connexion réussie',
      token, // Renvoie le token pour les requêtes suivantes
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
};


export const logout = (req: Request, res: Response) => {
  try {

    res.clearCookie('token'); 


    return res.status(200).json({ success: true, message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Erreur lors de la déconnexion :', error);
    return res.status(500).json({ success: false, message: 'Erreur interne du serveur' });
  }
};