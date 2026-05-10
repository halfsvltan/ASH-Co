import { supabase } from "../supabase/client.js";

/* =========================
   GET CART
========================= */
export const getCart = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  res.json(data);
};

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req, res) => {
  try {

    const {
      userId,
      productId,
      qty,
    } = req.body;

    // VALIDASI
    if (!userId || !productId) {
      return res.status(400).json({
        message: "User ID dan Product ID wajib",
      });
    }

    // CEK PRODUK SUDAH ADA?
    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .single();

    // JIKA SUDAH ADA -> UPDATE QTY
    if (existingItem) {

      const { error: updateError } = await supabase
        .from("cart_items")
        .update({
          qty: existingItem.qty + qty,
        })
        .eq("id", existingItem.id);

      if (updateError) {
        return res.status(400).json({
          message: updateError.message,
        });
      }

      return res.json({
        message: "Quantity cart berhasil diupdate",
      });
    }

    // INSERT BARU
    const { error } = await supabase
      .from("cart_items")
      .insert([
        {
          user_id: userId,
          product_id: productId,
          qty,
        },
      ]);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    res.json({
      message: "Produk berhasil ditambahkan ke cart",
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

/* =========================
   UPDATE QTY
========================= */
export const updateQty = async (req, res) => {

  const {
    cartId,
    qty,
  } = req.body;

  const { error } = await supabase
    .from("cart_items")
    .update({ qty })
    .eq("id", cartId);

  if (error) {
    return res.status(400).json({
      message: error.message,
    });
  }

  res.json({
    message: "Qty berhasil diupdate",
  });
};