import { Router } from "express";
import { createCategoryType, getAllCategoryTypes, updateCategoryType, deleteCategoryType } from "../controllers/CategoryType.controller";

const router = Router();

router.post("/", createCategoryType);
router.get("/", getAllCategoryTypes);
router.put("/:id", updateCategoryType);
router.delete("/:id", deleteCategoryType);

export default router;
