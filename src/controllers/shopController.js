import supabase from "../config/supabase.js";
import { v4 as uuidv4 } from "uuid";

// Helper: upload logo to Supabase Storage
const uploadLogoToSupabase = async (file, filename) => {
  // Upload file
  console.log(file, filename);

  const { error: uploadError } = await supabase.storage
    .from("shop-logos")
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (uploadError) throw uploadError;

  const { publicUrl } = supabase.storage
    .from("shop-logos")
    .getPublicUrl(filename);

  console.log(publicUrl);

  return publicUrl;
};

// Create a shop (authenticated user, only one shop per user)
export const createShop = async (req, res) => {
  try {
    const { name, address, description, status, phoneNumber } = req.body;
    const owner_id = req.user.id;

    // Check if user already has a shop
    const { data: existingShop, error: checkError } = await supabase
      .from("shops")
      .select("*")
      .eq("owner_id", owner_id)
      .single();

    if (checkError && checkError.code !== "PGRST116") throw checkError; // ignore not found
    if (existingShop) {
      return res.status(400).json({ error: "You can only create one shop" });
    }
    let logoUrl = null;
    if (req.file) {
      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("shop-logos")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("shop-logos").getPublicUrl(fileName);

      logoUrl = publicUrl;
    }

    const { data, error } = await supabase
      .from("shops")
      .insert([
        {
          name,
          address,
          description,
          logo: logoUrl,
          phoneNumber: phoneNumber,
          status: status || "active",
          owner_id,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ message: "Shop created", shop: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update a shop (only owner)
export const updateShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const { name, address, description, status, phoneNumber, cover } = req.body;
    const owner_id = req.user.id;

    // Check shop ownership
    const { data: shop, error: findError } = await supabase
      .from("shops")
      .select("*")
      .eq("id", shopId)
      .single();

    if (findError || !shop)
      return res.status(404).json({ error: "Shop not found" });
    if (shop.owner_id !== owner_id)
      return res.status(403).json({ error: "Forbidden" });

    let logoUrl = shop.logo;
    if (req.file) {
      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("shop-logos")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("shop-logos").getPublicUrl(fileName);

      logoUrl = publicUrl;
    }

    const { data, error } = await supabase
      .from("shops")
      .update({
        name,
        address,
        description,
        logo: logoUrl,
        phoneNumber: phoneNumber,
        status: status || shop.status,
        cover: cover,
        updated_at: new Date(),
      })
      .eq("id", shopId)
      .select()
      .single();

    if (error) throw error;

    res.status(200).json({ message: "Shop updated", shop: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get shops of the logged-in user
export const getUserShops = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const { data, error } = await supabase
      .from("shops")
      .select("*")
      .eq("owner_id", owner_id);

    if (error) throw error;

    res.status(200).json({ shops: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get single shop by ID (public)
export const getShopById = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { data, error } = await supabase
      .from("shops")
      .select("*")
      .eq("id", shopId)
      .single();

    if (error || !data)
      return res.status(404).json({ error: "Shop not found" });

    res.status(200).json({ shop: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update only shop cover
export const updateShopCover = async (req, res) => {
  try {
    const { shopId } = req.params;

    const owner_id = req.user.id;

    console.log(shopId, owner_id);

    // Check shop ownership
    const { data: shop, error: findError } = await supabase
      .from("shops")
      .select("*")
      .eq("id", shopId)
      .single();

    if (findError || !shop) {
      return res.status(404).json({ error: "Shop not found" });
    }
    if (shop.owner_id !== owner_id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    // If file exists, upload to Supabase storage
    let coverUrl = shop.cover;
    if (req.file) {
      const fileExt = req.file.originalname.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("shop-logos")
        .upload(fileName, req.file.buffer, {
          contentType: req.file.mimetype,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("shop-logos").getPublicUrl(fileName);

      coverUrl = publicUrl;
    } else {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Update only the cover field
    const { data, error } = await supabase
      .from("shops")
      .update({ cover: coverUrl, updated_at: new Date() })
      .eq("id", shopId)
      .select()
      .single();

    if (error) throw error;

    res
      .status(200)
      .json({ message: "Cover updated", cover: coverUrl, shop: data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const capitalizeWords = (str) =>
  str.replace(/\b\w/g, (char) => char.toLowerCase());

export const getShopDetailsByName = async (req, res) => {
  try {
    let param = req.params.shop_name;

    // Step 1: Get shop by name (case-insensitive)
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("*")
      .ilike("name", `%${param}%`)
      .single();

    if (shopError || !shop) {
      return res.status(404).json({ error: "Shop not found" });
    }

    // Step 2: Get categories by shop_id
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*")
      .eq("shop_id", shop.id)
      .order("order_index", { ascending: true });

    if (catError) throw catError;

    // Step 3: Get menus by shop_id
    const { data: menus, error: menuError } = await supabase
      .from("menus")
      .select("*")
      .eq("shop_id", shop.id);

    if (menuError) throw menuError;

    const { data: socialLinks, error: socialError } = await supabase
      .from("sociallinks")
      .select("*")
      .eq("shop_id", shop.id)
      .single(); // ← ensures you only get one row

    if (socialError && socialError.code !== "PGRST116") throw socialError;

    // ✅ Return combined response
    res.status(200).json({
      shop,
      categories,
      menus,
      socialLinks: socialLinks || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};
