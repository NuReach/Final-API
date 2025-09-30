import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  createShop,
  updateShop,
  getUserShops,
  getShopById,
  updateShopCover,
} from "../controllers/shopController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, upload.single("logo"), createShop);
router.put("/:shopId", authenticateUser, upload.single("logo"), updateShop);
router.get("/me", authenticateUser, getUserShops);
router.get("/:shopId", getShopById);
router.put(
  "/:shopId/cover",
  authenticateUser,
  upload.single("cover"),
  updateShopCover
);

export default router;
