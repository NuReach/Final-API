import { v4 as uuidv4 } from "uuid";
import supabase from "../config/supabase.js";

export const createMenu = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const {
      name,
      price,
      discountPercentage,
      description,
      category_id,
      status,
      shop_id,
    } = req.body;

    console.log(req.body);
    console.log(req.files);

    let imageUrl = null;

    // --- MAIN IMAGE ---
    if (req.files?.image?.[0]) {
      const file = req.files.image[0];
      const fileExt = file.originalname.split(".").pop();
      const fileName = `menus/${uuidv4()}.${fileExt}`;

      // upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (uploadError) {
        console.error("Main image upload error:", uploadError);
        return res.status(400).json({ error: uploadError.message });
      }

      // ✅ FIX: correctly get public URL
      const { data } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }

    // --- INSERT MENU INTO DB ---
    const { data: menuData, error: menuError } = await supabase
      .from("menus")
      .insert([
        {
          name,
          price,
          discount: discountPercentage,
          description,
          category_id,
          status,
          image_url: imageUrl,
          shop_id,
          user_id: userId,
        },
      ])
      .select()
      .single();

    if (menuError) return res.status(400).json({ error: menuError.message });

    const menuId = menuData.id;

    // --- SUB IMAGES ---
    const subImages = req.files?.subImages || [];
    const subImageUrls = [];

    for (const file of subImages) {
      const fileExt = file.originalname.split(".").pop();
      const fileName = `menus/${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (uploadError) {
        console.error("Sub-image upload error:", uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      subImageUrls.push(publicUrl);

      await supabase.from("menu_sub_images").insert({
        menu_id: menuId,
        image_url: publicUrl,
      });
    }

    return res.json({
      message: "Menu created successfully ✅",
      menu: {
        ...menuData,
        image_url: imageUrl,
        sub_images: subImageUrls,
      },
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const updateMenu = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const menuId = req.params.id;
    if (!menuId) return res.status(400).json({ error: "Menu ID is required" });

    const {
      name,
      price,
      discountPercentage,
      description,
      category_id,
      status,
      shop_id,
    } = req.body;

    // --- GET EXISTING MENU ---
    const { data: existingMenu, error: fetchError } = await supabase
      .from("menus")
      .select("*")
      .eq("id", menuId)
      .single();

    if (fetchError) return res.status(400).json({ error: fetchError.message });
    if (!existingMenu) return res.status(404).json({ error: "Menu not found" });

    let imageUrl = existingMenu.image_url;

    // --- UPDATE MAIN IMAGE IF NEW FILE PROVIDED ---
    if (req.files?.image?.[0]) {
      const file = req.files.image[0];
      const fileExt = file.originalname.split(".").pop();
      const fileName = `menus/${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (uploadError) {
        console.error("Main image upload error:", uploadError);
        return res.status(400).json({ error: uploadError.message });
      }

      const { data } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    // --- UPDATE MENU RECORD ---
    const { data: updatedMenu, error: updateError } = await supabase
      .from("menus")
      .update({
        name,
        price,
        discount: discountPercentage,
        description,
        category_id,
        status,
        image_url: imageUrl,
        shop_id,
        user_id: userId,
      })
      .eq("id", menuId)
      .select()
      .single();

    if (updateError)
      return res.status(400).json({ error: updateError.message });

    // --- ADD NEW SUB IMAGES ---
    const subImages = req.files?.subImages || [];
    const subImageUrls = [];

    for (const file of subImages) {
      const fileExt = file.originalname.split(".").pop();
      const fileName = `menus/${uuidv4()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("menu-images")
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (uploadError) {
        console.error("Sub-image upload error:", uploadError);
        continue;
      }

      const { data } = supabase.storage
        .from("menu-images")
        .getPublicUrl(fileName);
      const publicUrl = data.publicUrl;

      subImageUrls.push(publicUrl);

      await supabase.from("menu_sub_images").insert({
        menu_id: menuId,
        image_url: publicUrl,
      });
    }

    // --- GET ALL SUB IMAGES AFTER UPDATE ---
    const { data: allSubImages } = await supabase
      .from("menu_sub_images")
      .select("image_url")
      .eq("menu_id", menuId);

    return res.json({
      message: "Menu updated successfully ✅",
      menu: {
        ...updatedMenu,
        image_url: imageUrl,
        sub_images: allSubImages.map((img) => img.image_url),
      },
    });
  } catch (err) {
    console.error("SERVER ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Menu
export const deleteMenu = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id } = req.params;
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

// ✅ Get Menus By Shop (protected)
export const getMenusByShop = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id: shopId } = req.params;

    // Get the shop
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("*")
      .eq("id", shopId)
      .single();

    if (shopError) return res.status(404).json({ error: "Shop not found" });

    // Get menus with category and sub-images
    const { data: menus, error: menuError } = await supabase
      .from("menus")
      .select(
        `
        *,
        categories:category_id(*),
        subImages:menu_sub_images(*)
      `
      )
      .eq("shop_id", shop.id)
      .order("created_at", { ascending: true });

    if (menuError) return res.status(400).json({ error: menuError.message });

    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get Menus By ShopId (public)
export const getMenusByShopIdPublic = async (req, res) => {
  try {
    const { shopId } = req.params;
    console.log(shopId);

    if (!shopId) return res.status(400).json({ error: "Shop ID is required" });

    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("id, name, logo, address")
      .eq("id", shopId)
      .single();

    if (shopError || !shop)
      return res.status(404).json({ error: "Shop not found" });

    const { data: menus, error: menuError } = await supabase
      .from("menus")
      .select("*")
      .eq("shop_id", shopId)
      .order("created_at", { ascending: true });

    if (menuError) return res.status(400).json({ error: menuError.message });

    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
