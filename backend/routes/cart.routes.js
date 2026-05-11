// routes/cart.routes.js

import express from "express";

import {
  getCart,
  addToCart,
  updateQty,
  deleteCartItem,
} from "../controllers/cart.controller.js";

const router = express.Router();

/* =========================
   TEST ROUTE
========================= */
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Cart routes aktif",
  });
});

/* =========================
   GET CART
========================= */
router.get("/user/:userId", getCart);

/* =========================
   ADD TO CART
========================= */
router.post("/add", addToCart);

/* =========================
   UPDATE QTY
========================= */
router.put("/update", updateQty);

/* =========================
   DELETE CART ITEM
========================= */
router.delete("/delete/:cartId", deleteCartItem);

export default router;