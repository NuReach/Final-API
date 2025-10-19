import supabase from "../config/supabase.js";

export const createOrUpdateMenuDesign = async (req, res) => {
  try {
    const { shop_name, menu_design } = req.body;

    // Validate required fields
    if (!shop_name || !menu_design) {
      return res.status(400).json({
        error: "shop_name and menu_design are required",
      });
    }

    // Validate that menu_design is a valid JSON object
    if (typeof menu_design !== "object" || Array.isArray(menu_design)) {
      return res.status(400).json({
        error: "menu_design must be a valid JSON object",
      });
    }

    // Find shop by name (case-insensitive)
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("*")
      .ilike("name", `%${shop_name}%`)
      .single();

    if (shopError || !shop) {
      return res.status(404).json({
        error: "Shop not found",
      });
    }

    // Try to insert or update the menu design using the found shop_id
    const { data, error } = await supabase
      .from("menu_designs")
      .upsert(
        {
          shop_id: shop.id,
          menu_design,
        },
        {
          onConflict: "shop_id",
        }
      )
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        error: "Failed to create/update menu design",
        details: error.message,
      });
    }

    res.status(200).json({
      message: "Menu design created/updated successfully",
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const getMenuDesign = async (req, res) => {
  try {
    const { shop_name } = req.params;

    if (!shop_name) {
      return res.status(400).json({
        error: "shop_name parameter is required",
      });
    }

    // Find shop by name (case-insensitive)
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("*")
      .ilike("name", `%${shop_name}%`)
      .single();

    if (shopError || !shop) {
      return res.status(404).json({
        error: "Shop not found",
      });
    }

    // Get menu design using the found shop_id
    const { data, error } = await supabase
      .from("menu_designs")
      .select("*")
      .eq("shop_id", shop.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return res.status(404).json({
          error: "Menu design not found for this shop",
        });
      }
      console.error("Database error:", error);
      return res.status(500).json({
        error: "Failed to fetch menu design",
        details: error.message,
      });
    }

    res.status(200).json({
      message: "Menu design retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const deleteMenuDesign = async (req, res) => {
  try {
    const { shop_id } = req.params;

    if (!shop_id) {
      return res.status(400).json({
        error: "shop_id parameter is required",
      });
    }

    const { error } = await supabase
      .from("menu_designs")
      .delete()
      .eq("shop_id", shop_id);

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        error: "Failed to delete menu design",
        details: error.message,
      });
    }

    res.status(200).json({
      message: "Menu design deleted successfully",
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};

export const getAllMenuDesigns = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("menu_designs")
      .select(
        `
        *,
        shops:shop_id (
          id,
          name,
          description
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        error: "Failed to fetch menu designs",
        details: error.message,
      });
    }

    res.status(200).json({
      message: "Menu designs retrieved successfully",
      data,
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message,
    });
  }
};
