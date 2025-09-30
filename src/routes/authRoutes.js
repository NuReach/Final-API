import express from "express";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  signUpUser,
} from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.get("/me", fetchCurrentUser);
router.post("/logout", logoutUser);

export default router;
