import supabase from "../config/supabase.js";

// sign up new user
export const signUpUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;

    // Insert user profile into "profiles" table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: authData.user.id, // user UUID from Supabase
          name,
          email,
          role: "user",
        },
      ])
      .select();

    if (profileError) throw profileError;

    return res.status(201).json({
      message: "User registered successfully",
      user: profileData[0],
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Check if session exists
    if (!data.session) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Optional: fetch profile from "profiles" table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) throw profileError;

    return res.status(200).json({
      message: "Login successful",
      user: profileData,
      session: data.session,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
