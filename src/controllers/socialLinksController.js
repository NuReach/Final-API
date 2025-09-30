import supabase from "../config/supabase.js";

// Create or update social links for a shop
export const upsertSocialLinks = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shopId } = req.params;
    const {
      facebooklink,
      instagramlink,
      tiktoklink,
      telegramlink,
      googlemaplink,
      phonenumber,
    } = req.body;

    // Check if shop belongs to the user
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("id, owner_id")
      .eq("id", shopId)
      .single();

    if (shopError) throw shopError;
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    if (shop.owner_id !== userId)
      return res.status(403).json({ error: "Not authorized" });

    // Upsert social links (one per shop)
    const { data, error } = await supabase
      .from("sociallinks")
      .upsert(
        {
          shop_id: shopId,
          facebooklink,
          instagramlink,
          tiktoklink,
          telegramlink,
          googlemaplink,
          phonenumber,
        },
        { onConflict: "shop_id" } // ensures 1 record per shop
      )
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      message: "Social links saved successfully",
      socialLinks: data,
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

// Get social links for a shop
export const getSocialLinks = async (req, res) => {
  try {
    const { shopId } = req.params;

    const { data, error } = await supabase
      .from("sociallinks")
      .select("*")
      .eq("shop_id", shopId)
      .single();

    if (error && error.code !== "PGRST116") throw error; // ignore "no rows found"
    if (!data) return res.status(404).json({ error: "No social links found" });

    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};
