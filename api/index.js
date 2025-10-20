import dotenv from "dotenv";
import app from "./src/app.js";

dotenv.config();

// Export the Express app for Vercel serverless functions
export default app;
