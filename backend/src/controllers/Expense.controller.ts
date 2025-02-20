import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Expense } from '../entities/Expense.entity';

const expenseRepository = AppDataSource.getRepository(Expense);

export const getAllExpenses = async (req: Request, res: Response) => {
  try {
    const expenses = await expenseRepository.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching expenses", error });
  }
};

export const createExpense = async (req: Request, res: Response) => {
  try {
    const { montant, categorie, date, userId } = req.body;
    const expense = expenseRepository.create({
      montant,
      categorie,
      date,
      user: { id: userId }
    });
    await expenseRepository.save(expense);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error creating expense", error });
  }
};

export const updateExpense = async (req: Request, res: Response): Promise <any> => {
  try {
    const { id } = req.params;
    const { montant, categorie, date } = req.body;
    const expense = await expenseRepository.findOneBy({ id: parseInt(id) });
    
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    
    expense.montant = montant;
    expense.categorie = categorie;
    expense.date = date;
    
    await expenseRepository.save(expense);
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: "Error updating expense", error });
  }
};

export const deleteExpense = async (req: Request, res: Response): Promise <any> => {
  try {
    const { id } = req.params;
    const result = await expenseRepository.delete(id);
    
    if (result.affected === 0) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Error deleting expense", error });
  }
};
