import { Request, Response } from 'express';
import { AppDataSource } from '../config/database'; // Assurez-vous que la source de données est bien configurée
import { User } from '../entities/User.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { hashPasswords } from './hashPasswordscontroller';

// Utilisation du repository pour accéder à l'entité User
const userRepository = AppDataSource.getRepository(User);

// Connexion
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;
    console.log("ZZZZ ", req.body)
    // Recherche de l'utilisateur par email
    const user = await userRepository.findOne({
      where: { email },
    });

    console.log(user)

    console.log("Mot de passe hashé ==> ", await hashPasswords("Vano@1000"))

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Comparaison des mots de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }


    // Création du token JWT
    const token = jwt.sign({ id: user.id }, 'votre_secret_key', { expiresIn: '1h' });

    console.log(token)
    // Réponse avec le token et les informations de l'utilisateur
    res.status(200).json({
      message: 'Connexion réussie',
      token: token,
      user: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error });
  }
};