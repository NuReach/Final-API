import supabase from "../config/supabase.js";
import { v4 as uuidv4 } from "uuid";

// Helper: upload logo to Supabase Storage
const uploadLogoToSupabase = async (file, filename) => {
  const { data, error } = await supabase.storage
    .from("shop-logos") // your bucket name
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;

  const { publicUrl, error: urlError } = supabase.storage
    .from("shop-logos")
    .getPublicUrl(filename);

  if (urlError) throw urlError;

  return publicUrl;
};

// Create a shop (authenticated user, only one shop per user)
export const createShop = async (req, res) => {
  try {
    const { name, address, description, status } = req.body;
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
    const { name, address, description, status } = req.body;
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
      const filename = `shop-${Date.now()}-${req.file.originalname}`;
      logoUrl = await uploadLogoToSupabase(req.file, filename);
    }

    const { data, error } = await supabase
      .from("shops")
      .update({
        name,
        address,
        description,
        logo: logoUrl,
        status: status || shop.status,
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
