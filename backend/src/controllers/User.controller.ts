import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User.entity';

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
