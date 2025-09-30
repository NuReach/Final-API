import express from "express";
import { loginUser, signUpUser } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", signUpUser);
router.post("/login", loginUser);

export default router;
