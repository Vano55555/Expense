import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userRepository = AppDataSource.getRepository(User);

// Contrôleur pour la connexion
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

    // Réponse contenant le token et les informations de l'utilisateur
    res.status(200).json({
      UtilisateurTrouver: {
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
      },
      SonToken: token,
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

// Récupérer tous les utilisateurs
export const all = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await userRepository.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error });
  }
};

// Récupérer un utilisateur par son ID
export const one = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'utilisateur', error });
  }
};

// Créer un nouvel utilisateur
export const save = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = userRepository.create(req.body);
    await userRepository.save(newUser);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur', error });
  }
};

// Mettre à jour un utilisateur existant
export const update = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
    if (user) {
      userRepository.merge(user, req.body);
      const result = await userRepository.save(user);
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error });
  }
};

// Supprimer un utilisateur
export const remove = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
    if (user) {
      await userRepository.remove(user);
      res.status(200).json({ message: 'Utilisateur supprimé' });
    } else {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
  }
};