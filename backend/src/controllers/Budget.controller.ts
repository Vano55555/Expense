import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Budget } from '../entities/Budget.entity';
import { User } from '../entities/User.entity';
import { Category } from '../entities/Category.entity';
const budgetRepository = AppDataSource.getRepository(Budget);

export const createBudget = async (req: Request, res: Response): Promise<any> => {
  try {
    const { montantBudget, montantDepense, categorieId, userId } = req.body;

    // Vérification des IDs
    if (!userId || !categorieId) {
      return res.status(400).json({ message: "userId and categorieId are required to create a budget" });
    }

    // Récupérer l'utilisateur et la catégorie
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const categorie = await AppDataSource.getRepository(Category).findOneBy({ id: categorieId });
    if (!categorie) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Créer le budget
    const budget = budgetRepository.create({
      montantBudget,
      montantDepense,
      categories: categorie, 
      user: user,  
    });

    // Sauvegarder le budget 
    await budgetRepository.save(budget);

    res.status(201).json(budget);
  } catch (error) {
    console.error("Error creating budget:", error);
    res.status(500).json({ message: "Error creating budget", error });
  }
};

export const updateBudget = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { montantBudget, montantDepense, categorieId, userId } = req.body;

    if (!userId || !categorieId) {
      return res.status(400).json({ message: "userId and categorieId are required to update a budget" });
    }

    // Récupérer le budget à modifier
    const budget = await budgetRepository.findOneBy({ id: parseInt(id) });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    // Récupérer l'utilisateur et la catégorie
    const user = await AppDataSource.getRepository(User).findOneBy({ id: userId });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const categorie = await AppDataSource.getRepository(Category).findOneBy({ id: categorieId });
    if (!categorie) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Mettre à jour les champs du budget
    budget.montantBudget = montantBudget;
    budget.montantDepense = montantDepense;
    budget.categories = categorie;  
    budget.user = user; 

    // Sauvegarder le budget mis à jour
    await budgetRepository.save(budget);

    res.json(budget);
  } catch (error) {
    console.error("Error updating budget:", error);
    res.status(500).json({ message: "Error updating budget", error });
  }
};

export const getAllBudgets = async (req: Request, res: Response) => {
  try {
    const budgets = await budgetRepository.find({ relations: ["users", "categories"] });  // Charger les relations
    res.json(budgets);
  } catch (error) {
    console.error("Error fetching budgets:", error);
    res.status(500).json({ message: "Error fetching budgets", error });
  }
};

export const deleteBudget = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const budget = await budgetRepository.findOneBy({ id: parseInt(id) });

    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }

    await budgetRepository.remove(budget);
    res.json({ message: "Budget deleted successfully" });
  } catch (error) {
    console.error("Error deleting budget:", error);
    res.status(500).json({ message: "Error deleting budget", error });
  }
};
