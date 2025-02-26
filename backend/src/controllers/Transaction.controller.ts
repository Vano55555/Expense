import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Transaction } from '../entities/Transaction.entity';
import { User } from '../entities/User.entity';
import { Expense } from '../entities/Expense.entity';
import { TransactionType } from '../entities/TransactionType.entity';

const transactionRepository = AppDataSource.getRepository(Transaction);

export const createTransaction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { montant, transactiontypeId, modePaiement, date, userId, expenseId } = req.body;

    // Vérification du userId
    if (!userId) {
      return res.status(400).json({ message: "userId is required to create a transaction" });
    }

    // Récupérer l'utilisateur avec l'ID
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Récupérer la dépense avec l'ID
    const expense = await AppDataSource.getRepository(Expense).findOneBy({ id: expenseId });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Récupérer le type de transaction avec l'ID
    const transactionType = await AppDataSource.getRepository(TransactionType).findOneBy({ id: transactiontypeId });
    if (!transactionType) {
      return res.status(404).json({ message: "Transaction Type not found" });
    }

    // Créer la transaction
    const transaction = transactionRepository.create({
      montant,
      modePaiement,
      date,
      user : user,  // Associer l'utilisateur
      expense : expense,  // Associer la dépense
      transactionType : transactionType  // Associer le type de transaction
    });

    // Sauvegarder la transaction dans la base de données
    await transactionRepository.save(transaction);

    // Retourner la transaction créée
    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Error creating transaction", error });
  }
};

export const updateTransaction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { montant, modePaiement, date, userId } = req.body;

    // Vérification de l'existence de l'utilisateur
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Récupérer la transaction à mettre à jour
    const transaction = await transactionRepository.findOneBy({ id: parseInt(id) });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Mettre à jour les champs de la transaction
    transaction.montant = montant;
    transaction.date = date;
    transaction.modePaiement = modePaiement;
    transaction.user = user;  // Relier la transaction à l'utilisateur

    // Sauvegarder la transaction mise à jour
    await transactionRepository.save(transaction);

    // Retourner la transaction mise à jour
    res.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Error updating transaction", error });
  }
};

export const getAllTransactions = async (req: Request, res: Response) => {
  try {
    const transactions = await transactionRepository.find({ relations: ["user", "expense", "transactionType"] });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

export const deleteTransaction = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const transaction = await transactionRepository.findOneBy({ id: parseInt(id) });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await transactionRepository.remove(transaction);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Error deleting transaction", error });
  }
};
