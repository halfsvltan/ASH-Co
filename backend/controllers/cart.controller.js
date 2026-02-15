import { supabase } from "../supabase/client.js";

export const getCart = async (req, res) => {
  const { userId } = req.params;

  const { data, error } = await supabase
    .from("cart_items")
    .select("qty");

  if (error) return res.status(400).json(error);

  const totalQty = data.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  res.json({ totalQty });
};
