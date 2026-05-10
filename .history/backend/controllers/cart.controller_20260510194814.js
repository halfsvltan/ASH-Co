import { supabase } from "../supabase/client.js";

/* =========================
   GET CART
========================= */
export const getCart = async (req, res) => {
  try {

    const { userId } = req.params;

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
      .eq("user_id", userId);

    if (error) {
      console.log("GET CART ERROR:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
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
      message: err.message,
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
    console.log("PRODUCT ID TYPE:", typeof productId);

    /* =========================
       VALIDASI
    ========================= */
    if (!userId || !productId) {

      return res.status(400).json({
        success: false,
        message: "User ID / Product ID kosong",
      });
    }

    /* =========================
       GET PRODUCT
    ========================= */
    const {
      data: product,
      error: productError,
    } = await supabase
      .from("products")
      .select("*")
      .eq("id", String(productId))
      .maybeSingle();

    console.log("PRODUCT:", product);
    console.log("PRODUCT ERROR:", productError);

    if (productError) {

      return res.status(400).json({
        success: false,
        message: productError.message,
      });
    }

    if (!product) {

      return res.status(404).json({
        success: false,
        message: "Produk tidak ditemukan",
      });
    }

    /* =========================
       CHECK EXISTING CART
    ========================= */
    const {
      data: existingItem,
      error: existingError,
    } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId)
      .eq("product_id", productId)
      .maybeSingle();

    console.log("EXISTING:", existingItem);
    console.log("EXISTING ERROR:", existingError);

    if (existingError) {

      return res.status(400).json({
        success: false,
        message: existingError.message,
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

      console.log("UPDATE:", updatedData);
      console.log("UPDATE ERROR:", updateError);

      if (updateError) {

        return res.status(400).json({
          success: false,
          message: updateError.message,
        });
      }

      return res.status(200).json({
        success: true,
        message: "Quantity berhasil diupdate",
        data: updatedData,
      });
    }

    /* =========================
       INSERT CART
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

    console.log("INSERT:", insertData);
    console.log("INSERT ERROR:", insertError);

    if (insertError) {

      return res.status(400).json({
        success: false,
        message: insertError.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Produk berhasil ditambahkan",
      data: insertData,
    });

  } catch (err) {

    console.log("SERVER ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
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

    if (error) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Qty berhasil diupdate",
      data,
    });

  } catch (err) {

    console.log("UPDATE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

/* =========================
   DELETE CART
========================= */
export const deleteCartItem = async (req, res) => {

  try {

    const { cartId } = req.params;

    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartId);

    if (error) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item berhasil dihapus",
    });

  } catch (err) {

    console.log("DELETE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};