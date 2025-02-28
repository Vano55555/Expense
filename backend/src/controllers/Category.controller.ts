import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category.entity';
import { CategoryType } from '../entities/CategoryType.entity';

const categoryRepository = AppDataSource.getRepository(Category);

export const createCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, libelle, description, categoryTypeId } = req.body;

    const categoryType = await AppDataSource.getRepository(CategoryType).findOneBy({ id: categoryTypeId });
    if (!categoryType) {
      return res.status(404).json({ message: "CategoryType not found" });
    }

    // Création de la catégorie avec les nouvelles colonnes
    const category = categoryRepository.create({
      name,
      libelle,
      description,
      categoryType
    });

    await categoryRepository.save(category);
    res.status(201).json(category);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Error creating category", error });
  }
};

export const updateCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name, libelle, description, categoryTypeId } = req.body;

    const category = await categoryRepository.findOneBy({ id: parseInt(id) });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (categoryTypeId) {
      const categoryType = await AppDataSource.getRepository(CategoryType).findOneBy({ id: categoryTypeId });
      if (!categoryType) {
        return res.status(404).json({ message: "CategoryType not found" });
      }
      category.categoryType = categoryType;
    }

    // Mise à jour des champs, avec valeur par défaut si non fourni
    category.name = name || category.name;
    category.libelle = libelle || category.libelle;
    category.description = description || category.description;

    await categoryRepository.save(category);
    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating category", error });
  }
};

export const getAllCategories = async (req: Request, res: Response): Promise<any> => {
  try {
    const categories = await categoryRepository.find({
      relations: ["categoryType"]
    });
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories", error });
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const category = await categoryRepository.findOneBy({ id: parseInt(id) });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await categoryRepository.remove(category);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Error deleting category", error });
  }
};