import supabase from "../config/supabase.js";

// Only authenticated users can reach this
export const getTestData = async (req, res) => {
  try {
    const { data, error } = await supabase.from("Test").select("*");

    if (error) throw error;

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
