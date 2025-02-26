import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category.entity';
import { CategoryType } from '../entities/CategorieType.entity';

const categoryRepository = AppDataSource.getRepository(Category);

export const createCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, parentId, categoryTypeId } = req.body;

    // Vérification du categoryType
    const categoryType = await AppDataSource.getRepository(CategoryType).findOneBy({ id: categoryTypeId });
    if (!categoryType) {
      return res.status(404).json({ message: "CategoryType not found" });
    }

    // Vérification du parent (si fourni)
    let parentCategory = null;
    if (parentId) {
      parentCategory = await categoryRepository.findOneBy({ id: parentId });
      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found" });
      }
    }

    // Création de la catégorie
    const category = categoryRepository.create({
      name,
      parentCategory,
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
    const { name, parentId, categoryTypeId } = req.body;

    const category = await categoryRepository.findOneBy({ id: parseInt(id) });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Vérification du categoryType
    if (categoryTypeId) {
      const categoryType = await AppDataSource.getRepository(CategoryType).findOneBy({ id: categoryTypeId });
      if (!categoryType) {
        return res.status(404).json({ message: "CategoryType not found" });
      }
      category.categoryType = categoryType;
    }

    // Vérification du parent
    if (parentId) {
      const parentCategory = await categoryRepository.findOneBy({ id: parentId });
      if (!parentCategory) {
        return res.status(404).json({ message: "Parent category not found" });
      }
      category.parentCategory = parentCategory;
    }

    category.name = name || category.name;

    await categoryRepository.save(category);
    res.json(category);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Error updating category", error });
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryRepository.find({
      relations: ["parentCategory", "categoryType", "children"]
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
