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
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">Our Products</h1>
        <p className="subtitle">Discover our latest collection</p>

        <div className="grid">
          {products.map((p) => (
            <div key={p.id} className="card">

              <div className="image-wrapper">
                <img
                  src={p.image_url || "https://via.placeholder.com/400"}
                  alt={p.name}
                />
              </div>

              <div className="info">
                <h3>{p.name}</h3>
                <p>{p.description}</p>

                <div className="bottom">
                  <span className="price">
                    Rp {p.price?.toLocaleString("id-ID")}
                  </span>

                  <button className="btn">
                    Add
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}