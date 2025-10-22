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

    // Step 2: Get categories by shop_id (only available)
    const { data: categories, error: catError } = await supabase
      .from("categories")
      .select("*")
      .eq("shop_id", shop.id)
      .eq("status", "available")
      .order("order_index", { ascending: true });

    if (catError) throw catError;

    // Step 3: Get menus by shop_id (only available)
    const { data: menus, error: menuError } = await supabase
      .from("menus")
      .select("*")
      .eq("shop_id", shop.id)
      .eq("status", "available");

    if (menuError) throw menuError;

    // Step 4: Get social links by shop_id
    const { data: socialLinks, error: socialError } = await supabase
      .from("sociallinks")
      .select("*")
      .eq("shop_id", shop.id)
      .single(); // ← ensures you only get one row

    if (socialError && socialError.code !== "PGRST116") throw socialError;

    // Step 5: Get banners by shop_id
    const { data: banners, error: bannersError } = await supabase
      .from("banners")
      .select("*")
      .eq("shop_id", shop.id)
      .single(); // ← ensures you only get one row

    if (bannersError && bannersError.code !== "PGRST116") throw bannersError;

    // ✅ Return combined response
    res.status(200).json({
      shop,
      categories,
      menus,
      socialLinks: socialLinks || null,
      banners: banners || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Server error" });
  }
};

// Track shop visit (public)
export const trackShopVisit = async (req, res) => {
  try {
    const { shop_name } = req.body;
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    console.log(shop_name, ip);

    if (!shop_name) {
      return res.status(400).json({ error: "Missing shop_name" });
    }

    // Find shop by name (case-insensitive)
    const { data: shop, error: shopError } = await supabase
      .from("shops")
      .select("id, name")
      .ilike("name", `%${shop_name}%`)
      .single();

    if (shopError || !shop)
      return res.status(404).json({ error: "Shop not found" });

    // Insert visit record
    const { error } = await supabase.from("shop_visits").insert([
      {
        shop_id: shop.id,
        shop_name: shop.name,
        ip_address: ip,
        user_agent: userAgent,
      },
    ]);

    if (error) throw error;

    res.status(201).json({ message: "Visit recorded successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getShopVisitsLast6Months = async (req, res) => {
  try {
    const { shop_name } = req.params;

    // ⏰ Date range: last 6 months including current month
    const currentDate = new Date();
    const startDate = new Date();
    startDate.setMonth(currentDate.getMonth() - 5);

    // 🧭 Fetch all visit records for this shop in the time range
    const { data, error } = await supabase
      .from("shop_visits")
      .select("visited_at")
      .eq("shop_name", shop_name)
      .gte("visited_at", startDate.toISOString());

    if (error) throw error;

    // 🗓️ Group visits by month-year
    const monthlyCounts = {};

    data.forEach((visit) => {
      const date = new Date(visit.visited_at);
      const monthKey = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      }); // e.g., "Oct 2025"

      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    });

    // 🔢 Ensure every month (last 6 months) is represented
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = d.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });

      result.push({
        month: monthKey,
        visits: monthlyCounts[monthKey] || 0,
      });
    }

    res.json({
      shop_name,
      last_6_months: result,
    });
  } catch (err) {
    console.error("❌ Error fetching shop visits:", err.message);
    res.status(500).json({ error: "Failed to fetch shop visits" });
  }
};

export const getShopAnalytics = async (req, res) => {
  try {
    const { shopId } = req.params;

    // 1️⃣ Get menu count
    const { count: menuCount, error: menuError } = await supabase
      .from("menus")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shopId);

    if (menuError) throw menuError;

    // 2️⃣ Get category count
    const { count: categoryCount, error: catError } = await supabase
      .from("categories")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shopId);

    if (catError) throw catError;

    // 3️⃣ Get total visits
    const { count: visitCount, error: visitError } = await supabase
      .from("shop_visits")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shopId);

    if (visitError) throw visitError;

    // 4️⃣ Get total clickers (sum of clickCount from menus)
    const { data: clickData, error: clickError } = await supabase
      .from("menus")
      .select("clickCount")
      .eq("shop_id", shopId);

    if (clickError) throw clickError;

    const totalClickers = clickData?.reduce(
      (sum, item) => sum + (item.clickCount || 0),
      0
    );

    // ✅ Combine results
    res.status(200).json({
      shopId,
      analytics: {
        totalMenus: menuCount || 0,
        totalCategories: categoryCount || 0,
        totalVisits: visitCount || 0,
        totalClickers: totalClickers || 0,
      },
    });
  } catch (err) {
    console.error("Error fetching shop analytics:", err);
    res.status(500).json({ error: err.message || "Failed to fetch analytics" });
  }
};
