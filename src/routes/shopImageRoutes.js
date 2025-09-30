import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js"; // your multer setup
import {
  upsertShopImages,
  getShopImages,
} from "../controllers/shopImageController.js";

const router = express.Router();

// Upsert (create/update) shop images
// upload.fields([{ name: "logo" }, { name: "cover" }]) handles multiple files
router.post(
  "/:shopId",
  authenticateUser,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  upsertShopImages
);

// Get shop images
router.get("/:shopId", getShopImages);

export default router;
