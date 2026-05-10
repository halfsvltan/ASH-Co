import { supabase } from "../supabase/client.js";

/* =========================
   GET CART
========================= */
export const getCart = async (req, res) => {
  try {

    const { userId } = req.params;

    console.log("GET CART USER:", userId);

    const {
      data,
      error,
    } = await supabase
      .from("cart_items")
      .select(`
        id,
        qty,
        created_at,
        products (
          id,
          name,
          price,
          image_url
        )
      `)
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    console.log("GET CART DATA:", data);
    console.log("GET CART ERROR:", error);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        error,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (err) {

    console.log("GET CART SERVER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
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

    /* =========================
       VALIDASI
    ========================= */
    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "User ID dan Product ID wajib",
      });
    }

    /* =========================
       CEK PRODUK ADA?
    ========================= */
    const {
      data: productData,
      error: productError,
    } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();

    console.log("PRODUCT DATA:", productData);
    console.log("PRODUCT ERROR:", productError);

    if (productError || !productData) {
      return res.status(400).json({
        success: false,
        message: "Produk tidak ditemukan",
        error: productError,
      });
    }

    /* =========================
       CEK ITEM SUDAH ADA?
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

    if (checkError) {
      return res.status(400).json({
        success: false,
        message: checkError.message,
        error: checkError,
      });
    }

    /* =========================
       UPDATE QTY
    ========================= */
    if (existingItem) {

      const newQty =
        Number(existingItem.qty) +
        Number(qty || 1);

      const {
        data: updatedData,
        error: updateError,
      } = await supabase
        .from("cart_items")
        .update({
          qty: newQty,
        })
        .eq("id", existingItem.id)
        .select();

      console.log("UPDATE DATA:", updatedData);
      console.log("UPDATE ERROR:", updateError);

      if (updateError) {
        return res.status(400).json({
          success: false,
          message: updateError.message,
          error: updateError,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Quantity cart berhasil diupdate",
        data: updatedData,
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
        success: false,
        message: insertError.message,
        error: insertError,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Produk berhasil ditambahkan ke cart",
      data: insertData,
    });

  } catch (err) {

    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/* =========================
   UPDATE QTY
========================= */
export const updateQty = async (req, res) => {
  try {

    const {
      cartId,
      qty,
    } = req.body;

    console.log("UPDATE BODY:", req.body);

    if (!cartId || !qty) {
      return res.status(400).json({
        success: false,
        message: "Cart ID dan qty wajib",
      });
    }

    const {
      data,
      error,
    } = await supabase
      .from("cart_items")
      .update({
        qty,
      })
      .eq("id", cartId)
      .select();

    console.log("UPDATE DATA:", data);
    console.log("UPDATE ERROR:", error);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Qty berhasil diupdate",
      data,
    });

  } catch (err) {

    console.log("UPDATE SERVER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

/* =========================
   DELETE CART ITEM
========================= */
export const deleteCartItem = async (req, res) => {
  try {

    const { cartId } = req.params;

    console.log("DELETE CART ID:", cartId);

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartId);

    console.log("DELETE ERROR:", error);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
        error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item berhasil dihapus",
    });

  } catch (err) {

    console.log("DELETE SERVER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};