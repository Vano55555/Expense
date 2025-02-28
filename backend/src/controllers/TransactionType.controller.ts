import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { TransactionType } from '../entities/TransactionType.entity';

// Méthode pour créer un nouveau type de transaction
export const createTransactionType = async (req: Request, res: Response): Promise<any> => {
  try {
    const { nom } = req.body;

    // Vérifier que le nom du type de transaction est fourni
    if (!nom) {
      return res.status(400).json({ message: "Nom du type de transaction est requis" });
    }

    // Créer un nouveau type de transaction
    const transactionType = AppDataSource.getRepository(TransactionType).create({
      nom
    });

    // Sauvegarder le type de transaction
    await AppDataSource.getRepository(TransactionType).save(transactionType);

    // Retourner le type de transaction créé
    res.status(201).json(transactionType);
  } catch (error) {
    console.error("Erreur lors de la création du type de transaction:", error);
    res.status(500).json({ message: "Erreur lors de la création du type de transaction", error });
  }
};

// Méthode pour récupérer tous les types de transactions
export const getAllTransactionTypes = async (req: Request, res: Response): Promise<any> => {
  try {
    const transactionTypes = await AppDataSource.getRepository(TransactionType).find();
    res.json(transactionTypes); // Renvoie les types de transaction
  } catch (error) {
    console.error("Erreur lors de la récupération des types de transactions:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des types de transactions", error });
  }
};

// Méthode pour récupérer un type de transaction par son ID
export const getTransactionTypeById = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const transactionType = await AppDataSource.getRepository(TransactionType).findOne({
      where: { id: parseInt(id) },
    });

    if (!transactionType) {
      return res.status(404).json({ message: "Type de transaction non trouvé" });
    }

    res.json(transactionType);
  } catch (error) {
    console.error("Erreur lors de la récupération du type de transaction:", error);
    res.status(500).json({ message: "Erreur lors de la récupération du type de transaction", error });
  }
};

// Méthode pour mettre à jour un type de transaction
export const updateTransactionType = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { nom } = req.body;

    // Récupérer le type de transaction à mettre à jour
    const transactionType = await AppDataSource.getRepository(TransactionType).findOneBy({ id: parseInt(id) });

    if (!transactionType) {
      return res.status(404).json({ message: "Type de transaction non trouvé" });
    }

    // Mettre à jour les champs
    if (nom) transactionType.nom = nom;

    // Sauvegarder le type de transaction mis à jour
    await AppDataSource.getRepository(TransactionType).save(transactionType);

    res.json(transactionType);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du type de transaction:", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour du type de transaction", error });
  }
};

// Méthode pour supprimer un type de transaction
export const deleteTransactionType = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const transactionType = await AppDataSource.getRepository(TransactionType).findOneBy({ id: parseInt(id) });

    if (!transactionType) {
      return res.status(404).json({ message: "Type de transaction non trouvé" });
    }

    await AppDataSource.getRepository(TransactionType).remove(transactionType);
    res.json({ message: "Type de transaction supprimé avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression du type de transaction:", error);
    res.status(500).json({ message: "Erreur lors de la suppression du type de transaction", error });
  }
};
