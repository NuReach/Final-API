import supabase from "../config/supabase.js";

// Middleware to verify user session via Supabase access token
export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    // Bearer <access_token>
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Access token missing" });
    }

    // Verify token using Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // Attach user to request object
    req.user = data.user;

    next();
  } catch (err) {
    return res.status(401).json({ error: err.message });
  }
};

export const authorizeAdmin = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Fetch user role from profiles table
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error || !profile)
      return res.status(403).json({ error: "Profile not found" });

    if (profile.role !== "admin")
      return res.status(403).json({ error: "Access denied: admin only" });

    next();
  } catch (err) {
    return res.status(403).json({ error: err.message });
  }
};
