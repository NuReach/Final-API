import supabase from "../config/supabase.js";

// sign up new user
export const signUpUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) throw authError;

    const userId = authData.user.id;

    // Step 2: Insert user profile into "profiles" table
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          id: userId, // user UUID from Supabase
          name,
          email,
          role: "user",
        },
      ])
      .select();

    if (profileError) throw profileError;

    const profile = profileData[0];

    // Step 3: Create default shop for the user
    const { data: shopData, error: shopError } = await supabase
      .from("shops")
      .insert([
        {
          owner_id: userId,
          name: `${email}'s Shop`,
          address: "No Address",
          description: "No Discrition",
          phoneNumber: "0987654321",
          status: "active",
          logo: null,
          cover: null,
        },
      ])
      .select()
      .single();

    if (shopError) throw shopError;

    return res.status(201).json({
      message: "User registered successfully and shop created",
      user: profile,
      shop: shopData,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (!data.session) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // fetch profile
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

// get current user from access token
export const fetchCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1]; // "Bearer <token>"

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) throw error;

    if (!user) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    // fetch profile
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) throw profileError;

    return res.status(200).json({
      user: profileData,
      session: { access_token: token },
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// logout user
export const logoutUser = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
