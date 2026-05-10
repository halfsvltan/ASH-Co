// controllers/cart.controller.js

import { supabase } from "../supabase/client.js";

/* =========================
   GET CART
========================= */
export const getCart = async (req, res) => {
  const { userId } = req.params;

  // USER HARUS LOGIN
  if (!userId) {
    return res.status(401).json({
      message: "Silakan login terlebih dahulu",
    });
  }

  // AMBIL CART BERDASARKAN USER
  const { data, error } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    return res.status(400).json(error);
  }

  // TOTAL QTY
  const totalQty = data.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  res.json({
    items: data,
    totalQty,
  });
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

  // USER HARUS LOGIN
  if (!userId) {
    return res.status(401).json({
      message: "User harus login terlebih dahulu",
    });
  }

  // VALIDASI
  if (!productId) {
    return res.status(400).json({
      message: "Product ID wajib diisi",
    });
  }

  // CEK APAKAH PRODUK SUDAH ADA
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("*")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .single();

  // JIKA PRODUK SUDAH ADA
  if (existingItem) {
    const newQty =
      existingItem.qty + (qty || 1);

    const { data, error } = await supabase
      .from("cart_items")
      .update({
        qty: newQty,
      })
      .eq("id", existingItem.id)
      .select();

    if (error) {
      return res.status(400).json(error);
    }

    return res.json({
      message: "Qty produk berhasil diupdate",
      data,
    });
  }

  // JIKA PRODUK BELUM ADA
  const { data, error } = await supabase
    .from("cart_items")
    .insert([
      {
        user_id: userId,
        product_id: productId,
        qty: qty || 1,
      },
    ])
    .select();

  if (error) {
    return res.status(400).json(error);
  }

  res.json({
    message: "Produk berhasil ditambahkan ke cart",
    data,
  });
};

/* =========================
   UPDATE QTY
========================= */
export const updateQty = async (req, res) => {
  const {
    cartId,
    qty,
    userId,
  } = req.body;

  // USER HARUS LOGIN
  if (!userId) {
    return res.status(401).json({
      message: "User harus login terlebih dahulu",
    });
  }

  const { data, error } = await supabase
    .from("cart_items")
    .update({ qty })
    .eq("id", cartId)
    .eq("user_id", userId)
    .select();

  if (error) {
    return res.status(400).json(error);
  }

  res.json({
    message: "Qty berhasil diupdate",
    data,
  });
};