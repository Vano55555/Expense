import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { CategoryType } from '../entities/CategorieType.entity';

const categoryTypeRepository = AppDataSource.getRepository(CategoryType);

export const createCategoryType = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name } = req.body;

    const existingType = await categoryTypeRepository.findOneBy({ name });
    if (existingType) {
      return res.status(400).json({ message: "CategoryType already exists" });
    }

    const categoryType = categoryTypeRepository.create({ name });

    await categoryTypeRepository.save(categoryType);
    res.status(201).json(categoryType);
  } catch (error) {
    console.error("Error creating category type:", error);
    res.status(500).json({ message: "Error creating category type", error });
  }
};

export const updateCategoryType = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const categoryType = await categoryTypeRepository.findOneBy({ id: parseInt(id) });
    if (!categoryType) {
      return res.status(404).json({ message: "CategoryType not found" });
    }

    categoryType.name = name || categoryType.name;

    await categoryTypeRepository.save(categoryType);
    res.json(categoryType);
  } catch (error) {
    console.error("Error updating category type:", error);
    res.status(500).json({ message: "Error updating category type", error });
  }
};

export const getAllCategoryTypes = async (req: Request, res: Response) => {
  try {
    const categoryTypes = await categoryTypeRepository.find({
      relations: ["categories"]  // Charger les catégories liées
    });
    res.json(categoryTypes);
  } catch (error) {
    console.error("Error fetching category types:", error);
    res.status(500).json({ message: "Error fetching category types", error });
  }
};

export const deleteCategoryType = async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const categoryType = await categoryTypeRepository.findOneBy({ id: parseInt(id) });
    if (!categoryType) {
      return res.status(404).json({ message: "CategoryType not found" });
    }

    await categoryTypeRepository.remove(categoryType);
    res.json({ message: "CategoryType deleted successfully" });
  } catch (error) {
    console.error("Error deleting category type:", error);
    res.status(500).json({ message: "Error deleting category type", error });
  }
};
