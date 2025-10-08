import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

// Custom fetch with timeout
const fetchWithTimeout = (input, init) => {
  const timeout = 10000; // 10 seconds
  return Promise.race([
    fetch(input, init),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Supabase fetch timeout")), timeout)
    ),
  ]);
};

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
    global: {
      fetch: fetchWithTimeout,
    },
  }
);

export default supabase;
