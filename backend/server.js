import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cartRoutes from "./routes/cart.routes.js";

dotenv.config();

const app = express();


app.use(cors({
  origin: "*", 
}));
app.use(express.json());


app.use("/api/cart", cartRoutes);


app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "ASH Backend is running",
  });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on http://localhost:${PORT}`);
});
