import express from "express";
import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import shopRoutes from "./routes/shopRoutes.js";
import socialLinksRoutes from "./routes/socialLinksRoutes.js";
import shopImageRoutes from "./routes/shopImageRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import menuRoutes from "./routes/menuRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import qrRoutes from "./routes/qrRoutes.js";
import menuDesignRoutes from "./routes/menuDesignRoutes.js";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());

// CORS configuration - allow multiple origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://www.emenukh.vip",
  "https://www.emenukh.vip",
  "http://emenukh.vip",
  "https://emenukh.vip",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      // Check if the origin is in the allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        // For development, allow all origins
        callback(null, true);
      }
    },
    credentials: true, // if you need cookies / auth headers
  })
);

// Routes
app.get("/api/", (req, res) => {
  res.status(200).json({ message: "hello emenu" });
});

app.use("/api/test", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/shops", shopRoutes);
app.use("/api/social-links", socialLinksRoutes);
app.use("/api/shop-images", shopImageRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/menus", menuRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/menu-designs", menuDesignRoutes);

export default app;
