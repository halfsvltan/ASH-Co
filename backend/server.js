// server.js

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import cartRoutes from "./routes/cart.routes.js";

dotenv.config();

const app = express();

/* =========================
   DEBUG ENV
========================= */
console.log("SUPABASE URL:", process.env.SUPABASE_URL);
console.log(
  "SERVICE ROLE:",
  process.env.SUPABASE_SERVICE_ROLE_KEY
    ? "ADA"
    : "TIDAK ADA"
);

/* =========================
   MIDDLEWARE
========================= */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

/* =========================
   TEST API
========================= */
app.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "Backend connect sukses",
  });
});

/* =========================
   ROUTES
========================= */
app.use("/api/cart", cartRoutes);

/* =========================
   ROOT
========================= */
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "ASH Backend is running",
  });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.log("GLOBAL ERROR:", err);

  res.status(500).json({
    success: false,
    message: err.message,
  });
});

/* =========================
   SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `✅ Backend running on http://localhost:${PORT}`
  );
});