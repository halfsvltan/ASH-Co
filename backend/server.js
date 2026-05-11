import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import cartRoutes from "./routes/cart.routes.js";

dotenv.config();

const app = express();

console.log("SUPABASE URL:", process.env.SUPABASE_URL);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend connect sukses",
  });
});

app.use("/api/cart", cartRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "ASH Backend is running",
  });
});

app.use((err, req, res, next) => {
  console.log("GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

export default app;