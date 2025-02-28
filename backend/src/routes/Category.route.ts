import { Router } from "express";
import { createCategory, getAllCategories, updateCategory, deleteCategory } from "../controllers/Category.controller";

const router = Router();

router.post("/", createCategory);
router.get("/categories", getAllCategories);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

export default router;
