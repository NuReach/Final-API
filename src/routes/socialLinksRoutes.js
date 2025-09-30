import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  upsertSocialLinks,
  getSocialLinks,
} from "../controllers/socialLinksController.js";

const router = express.Router();

// Upsert (create or update) social links for a shop
router.post("/:shopId", authenticateUser, upsertSocialLinks);

// Get social links for a shop
router.get("/:shopId", getSocialLinks);

export default router;
