import multer from "multer";

// Use memory storage for easy upload to Supabase
const storage = multer.memoryStorage();
export const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB max
});
