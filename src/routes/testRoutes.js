import express from "express";
import { getTestData } from "../controllers/testController.js";
import {
  authenticateUser,
  authorizeAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

// GET /api/test - protected route
router.get("/", authenticateUser, authorizeAdmin, getTestData);

export default router;
