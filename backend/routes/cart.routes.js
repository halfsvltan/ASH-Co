import express from "express";
import {
  getCart,
  addToCart,
  updateQty
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/:userId", getCart);
router.post("/add", addToCart);
router.put("/update", updateQty);

export default router;
