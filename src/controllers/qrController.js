import supabase from "../config/supabase.js";

export const upsertQrDesign = async (req, res) => {
  try {
    const { shop_id, qrData } = req.body;

    if (!shop_id || !qrData) {
      return res.status(400).json({ error: "shop_id and qrData are required" });
    }

    const qr_data = typeof qrData === "string" ? JSON.parse(qrData) : qrData;

    // Try to update first
    const { data: updated, error: updateError } = await supabase
      .from("qr_designs")
      .upsert({ shop_id, qr_data }, { onConflict: "shop_id" })
      .select();

    if (updateError) throw updateError;

    return res.status(200).json({ qrDesign: updated[0] });
  } catch (err) {
    console.error("Upsert QR Design error:", err);
    return res.status(400).json({ error: err.message });
  }
};

export const getQrDesignByShop = async (req, res) => {
  try {
    const { shop_id } = req.params;

    const { data, error } = await supabase
      .from("qr_designs")
      .select("*")
      .eq("shop_id", shop_id)
      .single(); // only one design per shop

    if (error) throw error;

    return res.status(200).json({ data });
  } catch (error) {
    console.error("❌ Error fetching QR design:", error);
    return res.status(500).json({ error: error.message });
  }
};
