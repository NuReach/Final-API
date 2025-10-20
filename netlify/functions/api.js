import serverless from "serverless-http";
import dotenv from "dotenv";
import app from "../../src/app.js";

dotenv.config();

// Export the serverless handler
export const handler = serverless(app);
