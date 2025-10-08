import {
  createBanner,
  getBannerByShopId,
  updateBanner,
} from "../controllers/bannerController.js";
import { Router } from "express";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/shop/:shopId", getBannerByShopId);

// Create a banner (accept single or multiple)
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "images", maxCount: 3 },
  ]),
  createBanner
);

// Update a banner
router.put("/:id", upload.single("image"), updateBanner);

export default router;
