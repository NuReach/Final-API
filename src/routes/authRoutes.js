import express from "express";
import {
  fetchCurrentUser,
  loginUser,
  logoutUser,
  signUpUser,
  requestPasswordReset,
  resetPassword,
  changePassword,
  updateUserName,
} from "../controllers/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.get("/me", fetchCurrentUser);
router.post("/logout", logoutUser);

// Password reset routes
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/change-password", changePassword);

// User profile update
router.put("/update-name", updateUserName);

export default router;
