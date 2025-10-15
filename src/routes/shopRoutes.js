import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  createShop,
  updateShop,
  getUserShops,
  getShopById,
  updateShopCover,
  getShopDetailsByName,
  trackShopVisit,
  getShopVisitsLast6Months,
  getShopAnalytics,
} from "../controllers/shopController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/menu/:shop_name", getShopDetailsByName);

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

router.post("/track-visit", trackShopVisit);

router.get("/:shop_name/visits", getShopVisitsLast6Months);
router.get("/:shopId/analytics", getShopAnalytics);
export default router;
