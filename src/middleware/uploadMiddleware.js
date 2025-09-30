import multer from "multer";

// Use memory storage for easy upload to Supabase
const storage = multer.memoryStorage();
export const upload = multer({ storage });
