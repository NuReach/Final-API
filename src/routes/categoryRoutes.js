import { Router } from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from "../controllers/categoryController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = Router();

// Public route (optional)
router.get("/", getCategories);

// Protected routes
router.post("/", authenticateUser, createCategory);
router.put("/:id", authenticateUser, updateCategory);
router.delete("/:id", authenticateUser, deleteCategory);
router.patch("/reorder", authenticateUser, reorderCategories);
router.get("/:shopId", authenticateUser, getCategories);

export default router;
