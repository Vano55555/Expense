import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Transaction } from '../entities/Transaction.entity';
import { User } from '../entities/User.entity';
import { Expense } from '../entities/Expense.entity';
import { TransactionType } from '../entities/TransactionType.entity';

export const createTransactionType = async (req: Request, res: Response): Promise<any> => {
  try {
    const { montant, modePaiement, date, userId, expenseId, transactiontypeId } = req.body;

    // Vérification du userName
    if (!userId) {
      return res.status(400).json({ message: "userName is required to create a transaction" });
    }

    // Récupérer l'utilisateur par son nom
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Récupérer l'Expense par son nom
    const expense = await AppDataSource.getRepository(Expense).findOneBy({ id: expenseId });
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    // Récupérer le type de transaction par son nom
    const transactionType = await AppDataSource.getRepository(TransactionType).findOneBy({ id: transactiontypeId });
    if (!transactionType) {
      return res.status(404).json({ message: "Transaction Type not found" });
    }

    // Créer la transaction en associant les entités
    const transaction = AppDataSource.getRepository(Transaction).create({
      montant,
      modePaiement,
      date,
      expense,          // Associer l'Expense
      transactionType,  // Associer le type de transaction
      user,             // Associer l'utilisateur
    });

    // Sauvegarder la transaction dans la base de données
    await AppDataSource.getRepository(Transaction).save(transaction);

    // Retourner la transaction créée
    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Error creating transaction", error });
  }
};

// Méthode pour récupérer toutes les transactions
export const getAllTransactionTypes = async (req: Request, res: Response): Promise<any>=> {
  try {
    const transactions = await AppDataSource.getRepository(Transaction).find({
      relations: ["user", "expense", "transactionType"], // Chargement des relations
    });
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Error fetching transactions", error });
  }
};

// Méthode pour récupérer une transaction par son ID
export const getTransactionById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const transaction = await AppDataSource.getRepository(Transaction).findOne({
      where: { id: parseInt(id) },
      relations: ["user", "expense", "transactionType"], // Chargement des relations
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ message: "Error fetching transaction", error });
  }
};

// Méthode pour mettre à jour une transaction
export const updateTransactionType = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { montant, modePaiement, date, userId, expenseId, transactiontypeId } = req.body;

    // Récupérer la transaction à mettre à jour
    const transaction = await AppDataSource.getRepository(Transaction).findOneBy({ id: parseInt(id) });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Récupérer les entités associées
    if (userId) {
      const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
      if (user) {
        transaction.user = user; // Mettre à jour l'utilisateur
      }
    }

    if (expenseId) {
      const expense = await AppDataSource.getRepository(Expense).findOneBy({ id: expenseId });
      if (expense) {
        transaction.expense = expense; // Mettre à jour l'Expense
      }
    }

    if (transactiontypeId) {
      const transactionType = await AppDataSource.getRepository(TransactionType).findOneBy({ id: transactiontypeId });
      if (transactionType) {
        transaction.transactionType = transactionType;
      }
    }

    // Mettre à jour les autres champs
    if (montant) transaction.montant = montant;
    if (modePaiement) transaction.modePaiement = modePaiement;
    if (date) transaction.date = date;

    // Sauvegarder la transaction mise à jour
    await AppDataSource.getRepository(Transaction).save(transaction);

    res.json(transaction);
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ message: "Error updating transaction", error });
  }
};

// Méthode pour supprimer une transaction
export const deleteTransactionType = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const transaction = await AppDataSource.getRepository(Transaction).findOneBy({ id: parseInt(id) });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    await AppDataSource.getRepository(Transaction).remove(transaction);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Error deleting transaction", error });
  }
};
