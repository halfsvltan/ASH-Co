import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./ProductsPage.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("ERROR:", error);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  return (
    <section className="products-page">
      <h1 className="title">Semua Produk</h1>

      {/* LOADING */}
      {loading && <p className="status">Loading produk...</p>}

      {/* EMPTY */}
      {!loading && products.length === 0 && (
        <p className="status">Belum ada produk tersedia</p>
      )}

      {/* GRID */}
      <div className="products-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <div className="image-wrapper">
              <img
                src={p.image_url || "/fallback.jpg"}
                alt={p.name}
                onError={(e) => (e.target.src = "/fallback.jpg")}
              />
            </div>

            <div className="content">
              <h3>{p.name}</h3>
              <p>{p.description || "Tidak ada deskripsi"}</p>

              <div className="price">
                Rp {Number(p.price).toLocaleString("id-ID")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}