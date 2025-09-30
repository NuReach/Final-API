import express from "express";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import socialLinksRoutes from "./routes/socialLinksRoutes.js";
import shopImageRoutes from "./routes/shopImageRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // your frontend
    credentials: true, // if you need cookies / auth headers
  })
);

// Routes
app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/social-links", socialLinksRoutes);
app.use("/api/shop-images", shopImageRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menus", menuRoutes);

export default app;
