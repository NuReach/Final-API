import supabase from "../config/supabase.js";

// Create new category
export const createCategory = async (req, res) => {
  try {
    const { kh_name, en_name, zh_name, status } = req.body;

    // Get the max order_index
    const { data: lastCategory } = await supabase
      .from("categories")
      .select("order_index")
      .order("order_index", { ascending: false })
      .limit(1)
      .single();

    const nextOrderIndex = lastCategory ? lastCategory.order_index + 1 : 0;

    const { data, error } = await supabase
      .from("categories")
      .insert([
        { kh_name, en_name, zh_name, status, order_index: nextOrderIndex },
      ])
      .select();

    if (error) throw error;

    return res
      .status(201)
      .json({ message: "Category created", category: data[0] });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Get all categories ordered
export const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("order_index", { ascending: true });

    if (error) throw error;

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Update category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { kh_name, en_name, zh_name, status } = req.body;

    const { data, error } = await supabase
      .from("categories")
      .update({ kh_name, en_name, zh_name, status })
      .eq("id", id)
      .select();

    if (error) throw error;

    return res
      .status(200)
      .json({ message: "Category updated", category: data[0] });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;

    return res.status(200).json({ message: "Category deleted" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Reorder categories (drag & drop)
export const reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body; // [{ id, order_index }, ...]

    // Update each category's order_index
    for (const cat of categories) {
      const { error } = await supabase
        .from("categories")
        .update({ order_index: cat.order_index })
        .eq("id", cat.id);

      if (error) throw error;
    }

    return res.status(200).json({ message: "Categories reordered" });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
