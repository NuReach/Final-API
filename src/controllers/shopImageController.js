import supabase from "../config/supabase.js";
import { v4 as uuidv4 } from "uuid";

// Upsert shop images (logo + cover)
export const upsertShopImages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shopId } = req.params;

    // 1️⃣ Check if shop exists and belongs to the user
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("id, owner_id")
      .eq("id", shopId)
      .single();

    if (shopError) throw shopError;
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    if (shop.owner_id !== userId)
      return res.status(403).json({ error: "Not authorized" });

    let logoUrl = null;
    let coverUrl = null;

    // 2️⃣ Upload logo if provided
    if (req.files?.logo) {
      const logoFile = req.files.logo[0]; // multer stores as array
      const logoPath = `shops/${shopId}/logo-${uuidv4()}-${
        logoFile.originalname
      }`;

      const { error: logoError } = await supabase.storage
        .from("shop-logos")
        .upload(logoPath, logoFile.buffer, {
          contentType: logoFile.mimetype,
          upsert: true,
        });

      if (logoError) throw logoError;

      const { data: logoPublic } = supabase.storage
        .from("shop-logos")
        .getPublicUrl(logoPath);

      logoUrl = logoPublic.publicUrl;
    }

    // 3️⃣ Upload cover if provided
    if (req.files?.cover) {
      const coverFile = req.files.cover[0];
      const coverPath = `shops/${shopId}/cover-${uuidv4()}-${
        coverFile.originalname
      }`;

      const { error: coverError } = await supabase.storage
        .from("shop-logos")
        .upload(coverPath, coverFile.buffer, {
          contentType: coverFile.mimetype,
          upsert: true,
        });

      if (coverError) throw coverError;

      const { data: coverPublic } = supabase.storage
        .from("shop-logos")
        .getPublicUrl(coverPath);

      coverUrl = coverPublic.publicUrl;
    }

    // 4️⃣ Upsert into shopImage table (1 record per shop)
    const { data, error } = await supabase
      .from("shopimage")
      .upsert(
        {
          shop_id: shopId,
          logolink: logoUrl,
          coverlink: coverUrl,
        },
        { onConflict: "shop_id" } // requires unique constraint on shop_id
      )
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      message: "Shop images saved successfully",
      images: data,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Get shop images
export const getShopImages = async (req, res) => {
  try {
    const { shopId } = req.params;

    const { data, error } = await supabase
      .from("shopimage")
      .select("*")
      .eq("shop_id", shopId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // ignore "no rows found"
    if (!data) return res.status(404).json({ error: "No images found" });

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
