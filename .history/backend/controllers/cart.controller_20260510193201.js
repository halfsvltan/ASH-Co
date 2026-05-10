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
    console.log("GET CART ERROR:", error);

    return res.status(400).json({
      message: error.message,
      error,
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

    console.log("BODY:", req.body);

    // VALIDASI
    if (!userId || !productId) {
      return res.status(400).json({
        message: "User ID dan Product ID wajib",
      });
    }

    /* =========================
       CEK ITEM SUDAH ADA
    ========================= */
    const {
      data: existingItem,
      error: checkError,
    } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle();

    console.log("EXISTING ITEM:", existingItem);
    console.log("CHECK ERROR:", checkError);

    // JIKA SUDAH ADA
    if (existingItem) {

      const {
        data: updatedData,
        error: updateError,
      } = await supabase
        .from("cart_items")
        .update({
          qty: existingItem.qty + (qty || 1),
        })
        .eq("id", existingItem.id)
        .select();

      console.log("UPDATE DATA:", updatedData);
      console.log("UPDATE ERROR:", updateError);

      if (updateError) {
        return res.status(400).json({
          message: updateError.message,
          error: updateError,
        });
      }

      return res.json({
        message: "Quantity cart berhasil diupdate",
      });
    }

    /* =========================
       INSERT BARU
    ========================= */
    const {
      data: insertData,
      error: insertError,
    } = await supabase
      .from("cart_items")
      .insert([
        {
          user_id: userId,
          product_id: productId,
          qty: qty || 1,
        },
      ])
      .select();

    console.log("INSERT DATA:", insertData);
    console.log("INSERT ERROR:", insertError);

    if (insertError) {
      return res.status(400).json({
        message: insertError.message,
        error: insertError,
      });
    }

    res.json({
      message: "Produk berhasil ditambahkan ke cart",
      data: insertData,
    });

  } catch (err) {

    console.log("SERVER ERROR:", err);

    res.status(500).json({
      message: "Internal server error",
      error: err.message,
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

    console.log("UPDATE QTY ERROR:", error);

    return res.status(400).json({
      message: error.message,
      error,
    });
  }

  res.json({
    message: "Qty berhasil diupdate",
  });
};