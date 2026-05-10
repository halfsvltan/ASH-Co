import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./ProductsPage.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (!error && data) {
      setProducts(data);
    }
  };

  return (
    <div className="page">
      <h1 className="title">PRODUCT PAGE</h1>

      <p className="debug">Total produk: {products.length}</p>

      <div className="grid">
        {products.map((p) => (
          <div key={p.id} className="card">
            <img
              src={p.image_url || "https://via.placeholder.com/300"}
              alt={p.name}
              className="image"
            />

            <div className="info">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <span className="price">
                Rp {p.price?.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}