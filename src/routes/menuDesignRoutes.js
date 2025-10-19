import express from "express";
import {
  createOrUpdateMenuDesign,
  getMenuDesign,
  deleteMenuDesign,
  getAllMenuDesigns,
} from "../controllers/menuDesignController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// POST /api/menu-designs - Create or update menu design
router.post("/", upload.single(), createOrUpdateMenuDesign);

// GET /api/menu-designs/shop/:shop_name - Get menu design by shop name
router.get("/shop/:shop_name", getMenuDesign);

// DELETE /api/menu-designs/shop/:shop_id - Delete menu design by shop ID
router.delete("/shop/:shop_id", deleteMenuDesign);

// GET /api/menu-designs - Get all menu designs
router.get("/", getAllMenuDesigns);

export default router;
