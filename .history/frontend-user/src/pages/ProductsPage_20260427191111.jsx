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
      console.error("ERROR FETCH:", error);
    } else {
      setProducts(data || []);
    }
  };

  return (
    <section className="products-page">
      <div className="container"> {/* 🔥 TAMBAH INI */}

        <h1 className="title">Semua Produk</h1>

        {products.length === 0 ? (
          <p className="empty">Belum ada produk</p>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <div className="product-card" key={p.id}>
                <div className="img-wrapper">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                </div>

                <div className="content">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <span className="price">
                    Rp {Number(p.price).toLocaleString("id-ID")}
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