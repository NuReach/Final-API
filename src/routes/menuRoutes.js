import { Router } from "express";
import {
  createMenu,
  updateMenu,
  deleteMenu,
  getMenusByShop,
  getMenusByShopIdPublic,
  incrementMenuClick,
  getMenusByShopMostClicked,
} from "../controllers/menuController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = Router();

router.get("/public/:shopId", getMenusByShopIdPublic);
router.post(
  "/",
  authenticateUser,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  createMenu
);

router.put(
  "/:id",
  authenticateUser,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "subImages", maxCount: 3 },
  ]),
  updateMenu
);

router.delete("/:id", authenticateUser, deleteMenu); // protected
router.get("/shop/:id", authenticateUser, getMenusByShop); // protected
router.post("/:id/click", incrementMenuClick);
router.get(
  "/shop/:id/most-clicked",
  authenticateUser,
  getMenusByShopMostClicked
);

export default router;
