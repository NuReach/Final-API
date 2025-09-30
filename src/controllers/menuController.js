import { v4 as uuidv4 } from "uuid";
import supabase from "../config/supabase.js";

// ✅ Create Menu
export const createMenu = async (req, res) => {
  try {
    const {
      name,
      price,
      discount = 0,
      description,
      category_id,
      status,
    } = req.body;
    const userId = req.user.id;

    // Calculate final price
    const final_price = price - discount;

    let imageUrl = null;

    // Handle file upload if image exists
    if (req.file) {
      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `menus/${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError)
        return res.status(400).json({ error: uploadError.message });

      const { data: publicUrl } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);
      imageUrl = publicUrl.publicUrl;
    }

    const { data, error } = await supabase
      .from("menus")
      .insert([
        {
          name,
          price,
          discount,
          description,
          category_id,
          status,
          image_url: imageUrl,
          user_id: userId,
        },
      ])
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Menu created successfully", menu: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Menus
export const getMenus = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("menus")
      .select("*, categories(name)");
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Menu
export const updateMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      discount = 0,
      description,
      category_id,
      status,
    } = req.body;
    const userId = req.user.id;

    let imageUrl = null;

    if (req.file) {
      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `menus/${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError)
        return res.status(400).json({ error: uploadError.message });

      const { data: publicUrl } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);
      imageUrl = publicUrl.publicUrl;
    }

    const { data, error } = await supabase
      .from("menus")
      .update({
        name,
        price,
        discount,
        description,
        category_id,
        status,
        ...(imageUrl && { image_url: imageUrl }),
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Menu updated successfully", menu: data[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Menu
export const deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { error } = await supabase
      .from("menus")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Menu deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
