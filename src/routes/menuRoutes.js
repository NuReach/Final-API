import { Router } from "express";
import {
  createMenu,
  getMenus,
  updateMenu,
  deleteMenu,
} from "../controllers/menuController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/", getMenus); // public
router.post("/", authenticateUser, upload.single("image"), createMenu);
router.put("/:id", authenticateUser, upload.single("image"), updateMenu);
router.delete("/:id", authenticateUser, deleteMenu); // protected

export default router;
