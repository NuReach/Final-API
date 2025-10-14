import { Router } from "express";
import {
  getQrDesignByShop,
  upsertQrDesign,
} from "../controllers/qrController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();
router.post("/", upload.none(), upsertQrDesign);
router.get("/:shop_id", getQrDesignByShop);

export default router;
