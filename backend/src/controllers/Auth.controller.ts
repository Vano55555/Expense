import { Request, Response } from 'express';
import { AppDataSource } from '../config/database'; // Assurez-vous que la source de données est bien configurée
import { User } from '../entities/User.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Utilisation du repository pour accéder à l'entité User
const userRepository = AppDataSource.getRepository(User);

// Connexion
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    // Recherche de l'utilisateur par email
    const user = await userRepository.findOne({
      where: { email },
    });

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

    // Réponse avec le token
    res.status(200).json({
      message: 'Connexion réussie',
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error });
  }
};

// Inscription (ajoutée ici pour centraliser l'authentification)
export const inscription = async (req: Request, res: Response): Promise<any> => {
  try {
    const { nom, prenom, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const user = new User();
    user.nom = nom;
    user.prenom = prenom;
    user.email = email;
    user.password = hashedPassword;

    // Sauvegarde dans la base de données
    await userRepository.save(user);

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription', error });
  }
};
export default loginUser; 