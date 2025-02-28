import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { ExpenseUser } from '../entities/Expense_User.entity';
import { Expense } from '../entities/Expense.entity';
import { User } from '../entities/User.entity';

const expenseUserRepository = AppDataSource.getRepository(ExpenseUser);

export const createExpenseUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { expenseId, userId } = req.body;

    if (!expenseId || !userId) {
      return res.status(400).json({ message: "expenseId and userId are required" });
    }

    // Vérifier si la dépense existe
    const expense = await AppDataSource.getRepository(Expense).findOneBy({ id: expenseId });
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });

    if (!expense || !user) {
      return res.status(404).json({ message: "Expense or User not found" });
    }

    const expenseUser = expenseUserRepository.create({
      expense,
      user
    });

    await expenseUserRepository.save(expenseUser);

    res.status(201).json(expenseUser);
  } catch (error) {
    console.error("Error creating expense user association:", error);
    res.status(500).json({ message: "Error creating expense user association", error });
  }
};

export const getAllExpenseUsers = async (req: Request, res: Response) => {
  try {
    const expenseUsers = await expenseUserRepository.find({ relations: ["expense", "user"] });
    res.json(expenseUsers);
  } catch (error) {
    console.error("Error fetching expense users:", error);
    res.status(500).json({ message: "Error fetching expense users", error });
  }
};

export const deleteExpenseUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const expenseUser = await expenseUserRepository.findOneBy({ id: parseInt(id) });

    if (!expenseUser) {
      return res.status(404).json({ message: "ExpenseUser association not found" });
    }

    await expenseUserRepository.remove(expenseUser);
    res.json({ message: "ExpenseUser association deleted successfully" });
  } catch (error) {
    console.error("Error deleting expense user association:", error);
    res.status(500).json({ message: "Error deleting expense user association", error });
  }
};
