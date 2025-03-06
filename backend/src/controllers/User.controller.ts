import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRepository = AppDataSource.getRepository(User);

// Contrôleur pour la connexion
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    console.log(req.body)
    const { email, password } = req.body;

    // Recherche de l'utilisateur par email
    const user = await userRepository.findOne({
      where: { email },
    });
    console.log(user)

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Comparaison des mots de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    // Création du token JWT
    const token = jwt.sign({ id: user.id }, 'TokTok', { expiresIn: '1h' });
    console.log(token)
    // Réponse contenant le token et les informations de l'utilisateur
    res.status(200).json({
      UtilisateurTrouver: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
      },
      token,
      Message: "Connexion réussie"
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Erreur lors de la connexion', error: error.message });
    } else {
      res.status(500).json({ message: 'Erreur inconnue', error });
    }
  }
};