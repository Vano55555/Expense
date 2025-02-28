import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User.entity';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Crée une interface 
interface LoginRequestBody {
  email: string;
  password: string;
}

const userRepository = AppDataSource.getRepository(User);

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userRepository.find({ relations: ['expenses'] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { nom, prenom, dateNaissance, sexe, email, password } = req.body;
    const user = userRepository.create({ nom, prenom, dateNaissance, sexe, email, password });
    await userRepository.save(user);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const updateUser = async (req: Request, res: Response): Promise <any> => {
  try {
    const { id } = req.params;
    const { nom, prenom, dateNaissance, sexe, email, password } = req.body;
    const user = await userRepository.findOneBy({ id: parseInt(id) });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.nom = nom;
    user.prenom = prenom;
    user.dateNaissance = dateNaissance;
    user.sexe = sexe;
    user.email = email;
    user.password = password;

    await userRepository.save(user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise <any> => {
  try {
    const { id } = req.params;
    const result = await userRepository.delete(id);

    if (result.affected === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};

interface LoginRequestBody {
  email: string;
  password: string;
}

export const loginUser = async (req: Request<{}, {}, LoginRequestBody>, res: Response): Promise <any> => {
  try {
    const { email, password } = req.body;

    // Recherche de l'utilisateur par email
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Comparaison des mots de passe
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Création du token JWT
    const token = jwt.sign({ id: user.id }, 'your_secret_key', { expiresIn: '1h' });

    res.status(200).json({ token });

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error logging in user', error: error.message });
    } else {
      res.status(500).json({ message: 'Unknown error', error });
    }
  }
};