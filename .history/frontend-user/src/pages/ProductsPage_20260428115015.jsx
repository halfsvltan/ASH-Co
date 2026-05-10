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
      .order("id", { ascending: false });

    if (error) {
      alert("ERROR: " + error.message);
    } else {
      setProducts(data || []);
    }
  };

  return (
    <section className="products-page">
      <div className="container">

        <h1 className="title">Semua Produk</h1>

        {products.length === 0 && (
          <p className="empty">Belum ada produk</p>
        )}

        <div className="products-grid">
          {products.map((p, index) => (
            <div className="product-card" key={index}>
              <div className="img-wrapper">
                <img
                  src={
                    p.image_url ||
                    p.image ||
                    p.imageUrl ||
                    "https://via.placeholder.com/300x200?text=No+Image"
                  }
                  alt={p.name}
                />
              </div>

              <div className="content">
                <h3>{p.name || "No Name"}</h3>
                <p>{p.description || "-"}</p>
                <span className="price">
                  Rp {Number(p.price || 0).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}