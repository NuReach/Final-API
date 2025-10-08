import supabase from "../config/supabase.js";

// ----------- GET BY SHOP -----------
export const getBannerByShopId = async (req, res) => {
  try {
    const { shopId } = req.params;

    const { data, error } = await supabase
      .from("banners")
      .select("*")
      .eq("shop_id", shopId)
      .single(); // ← ensures only one record is returned

    if (error) {
      if (error.code === "PGRST116") {
        // not found
        return res.status(404).json({ banner: null });
      }
      throw error;
    }

    return res.status(200).json({ banner: data });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// ----------- CREATE (Single or Multiple) -----------
export const createBanner = async (req, res) => {
  try {
    const { shop_id, banner_type } = req.body;

    if (!shop_id || !banner_type) {
      return res
        .status(400)
        .json({ error: "shop_id and banner_type are required" });
    }

    // ✅ Check for existing banner
    const { data: existingBanner, error: checkError } = await supabase
      .from("banners")
      .select("*")
      .eq("shop_id", shop_id)
      .maybeSingle();

    if (checkError) throw checkError;

    let single_image = null;
    let images = [];

    // --- UPLOAD NEW IMAGES ---
    if (req.files?.image?.[0]) {
      const file = req.files.image[0];
      const { data, error } = await supabase.storage
        .from("menu-images")
        .upload(
          `banners/shop-${shop_id}/${Date.now()}-${file.originalname}`,
          file.buffer,
          { contentType: file.mimetype }
        );
      if (error) throw error;
      const { data: publicUrl } = supabase.storage
        .from("menu-images")
        .getPublicUrl(data.path);
      single_image = publicUrl.publicUrl;
    }

    if (req.files?.images?.length > 0) {
      for (const file of req.files.images) {
        const { data, error } = await supabase.storage
          .from("menu-images")
          .upload(
            `banners/shop-${shop_id}/${Date.now()}-${file.originalname}`,
            file.buffer,
            { contentType: file.mimetype }
          );
        if (error) throw error;
        const { data: publicUrl } = supabase.storage
          .from("menu-images")
          .getPublicUrl(data.path);
        images.push(publicUrl.publicUrl);
      }
    }

    // ✅ If banner exists → Update it
    if (existingBanner) {
      const { data: updated, error: updateError } = await supabase
        .from("banners")
        .update({
          banner_type,
          single_image: single_image || existingBanner.single_image,
          images: images.length > 0 ? images : existingBanner.images,
        })
        .eq("shop_id", shop_id)
        .select();

      if (updateError) throw updateError;
      return res.status(200).json({ banner: updated[0], updated: true });
    }

    // ✅ Otherwise → Create new banner
    const { data: inserted, error: insertError } = await supabase
      .from("banners")
      .insert([{ shop_id, banner_type, single_image, images }])
      .select();

    if (insertError) throw insertError;
    return res.status(201).json({ banner: inserted[0], created: true });
  } catch (err) {
    console.error("Create banner error:", err);
    return res.status(400).json({ error: err.message });
  }
};

// ----------- UPDATE (Supports changing type or replacing image(s)) -----------
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { banner_type } = req.body;

    let updateFields = {};
    if (banner_type) updateFields.banner_type = banner_type;

    let single_image = null;
    let images = [];

    // --- Handle multiple files ---
    if (req.files && req.files.length > 0) {
      if (req.files.length === 1) {
        const file = req.files[0];
        const { data, error } = await supabase.storage
          .from("banner-images")
          .upload(`updated-${Date.now()}-${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
          });
        if (error) throw error;

        const { data: publicUrl } = supabase.storage
          .from("banner-images")
          .getPublicUrl(data.path);
        single_image = publicUrl.publicUrl;
        updateFields.single_image = single_image;
        updateFields.images = [];
      } else {
        for (const file of req.files) {
          const { data, error } = await supabase.storage
            .from("banner-images")
            .upload(`updated-${Date.now()}-${file.originalname}`, file.buffer, {
              contentType: file.mimetype,
            });
          if (error) throw error;

          const { data: publicUrl } = supabase.storage
            .from("banner-images")
            .getPublicUrl(data.path);
          images.push(publicUrl.publicUrl);
        }
        updateFields.images = images;
        updateFields.single_image = null;
      }
    }

    // --- Handle single file ---
    if (req.file) {
      const { data, error } = await supabase.storage
        .from("banner-images")
        .upload(
          `updated-${Date.now()}-${req.file.originalname}`,
          req.file.buffer,
          {
            contentType: req.file.mimetype,
          }
        );
      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from("banner-images")
        .getPublicUrl(data.path);
      updateFields.single_image = publicUrl.publicUrl;
      updateFields.images = [];
    }

    const { data, error } = await supabase
      .from("banners")
      .update(updateFields)
      .eq("id", id)
      .select();

    if (error) throw error;
    return res.status(200).json({ banner: data[0] });
  } catch (err) {
    console.error("Update banner error:", err);
    return res.status(400).json({ error: err.message });
  }
};
