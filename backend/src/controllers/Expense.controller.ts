import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Expense } from '../entities/Expense.entity';
import { User } from '../entities/User.entity';  // Importer l'entité User

const expenseRepository = AppDataSource.getRepository(Expense);

export const createExpense = async (req: Request, res: Response): Promise<any> => {
  try {
    const { montant, categorie, date, userId } = req.body;

    // Vérification du userId
    if (!userId) {
      return res.status(400).json({ message: "userId is required to create an expense" });
    }

    // Récupérer l'utilisateur avec l'ID
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });

    // Si l'utilisateur n'existe pas
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Créer la dépense et associer l'utilisateur
    const expense = expenseRepository.create({
      montant,
      categorie,
      date,
      user: user  // Lier l'utilisateur à la dépense
    });

    // Sauvegarder la dépense dans la base de données
    await expenseRepository.save(expense);

    // Retourner la dépense créée
    res.status(201).json(expense);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ message: "Error creating expense", error });
  }
};

export const updateExpense = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { montant, categorie, date, userId } = req.body;

    // Vérification de l'existence de l'utilisateur
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Récupérer la dépense à mettre à jour
    const expense = await expenseRepository.findOneBy({ id: parseInt(id) });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Mettre à jour les champs de la dépense
    expense.montant = montant;
    expense.categorie = categorie;
    expense.date = date;
    expense.user = user;  // Relier la dépense à l'utilisateur

    // Sauvegarder la dépense mise à jour
    await expenseRepository.save(expense);

    // Retourner la dépense mise à jour
    res.json(expense);
  } catch (error) {
    console.error("Error updating expense:", error);
    res.status(500).json({ message: "Error updating expense", error });
  }
};

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await expenseRepository.find({ relations: ["user"] });
    res.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const expense = await expenseRepository.findOneBy({ id: parseInt(id) });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await expenseRepository.remove(expense);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ message: "Error deleting expense", error });
  }
};
