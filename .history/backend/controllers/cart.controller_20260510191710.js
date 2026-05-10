import { supabase } from "../supabase/client.js";

/* =========================
   GET CART TOTAL
========================= */
export const getCart = async (req, res) => {

  const { userId } = req.params;

  try {

    const { data, error } = await supabase
      .from("cart_items")
      .select("qty")
      .eq("user_id", userId);

    if (error) {
      return res.status(400).json({
        message: error.message,
      });
    }

    const totalQty = data.reduce(
      (sum, item) => sum + item.qty,
      0
    );

    res.json({
      totalQty,
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};

/* =========================
   ADD TO CART
========================= */
export const addToCart = async (req, res) => {

  const {
    userId,
    productId,
    qty,
  } = req.body;

  try {

    // CEK APAKAH PRODUCT SUDAH ADA
    const { data: existingItem } =
      await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", userId)
        .eq("product_id", productId)
        .single();

    // JIKA SUDAH ADA
    if (existingItem) {

      const { error: updateError } =
        await supabase
          .from("cart_items")
          .update({
            qty:
              existingItem.qty + qty,
          })
          .eq("id", existingItem.id);

      if (updateError) {
        return res.status(400).json({
          message:
            updateError.message,
        });
      }

      return res.json({
        message:
          "Cart berhasil diupdate",
      });
    }

    // JIKA BELUM ADA
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
      message:
        "Produk berhasil ditambahkan ke cart",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
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

  try {

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
      message:
        "Qty berhasil diupdate",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });
  }
};