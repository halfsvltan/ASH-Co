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
      .order("id", { ascending: false });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
      alert("Gagal ambil produk: " + error.message);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  return (
    <section className="products-page">
      <div className="container">
        <h1 className="title">Semua Produk</h1>

        {loading && <p className="empty">Loading...</p>}

        {!loading && products.length === 0 && (
          <p className="empty">Belum ada produk</p>
        )}

        {!loading && products.length > 0 && (
          <div className="products-grid">
            {products.map((p) => (
              <div className="product-card" key={p.id}>
                <div className="img-wrapper">
                  <img
                    src={
                      p.image_url ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={p.name}
                  />
                </div>

                <div className="content">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <span className="price">
                    Rp {Number(p.price || 0).toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}