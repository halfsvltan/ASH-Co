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

    if (error) {
      console.error(error);
    } else {
      setProducts(data);
    }
  };

  return (
    <section className="products-page">
      <h1>Semua Produk</h1>

      <div className="products-grid">
        {products.map((p) => (
          <div className="product-card" key={p.id}>
            <img src={p.image_url} alt={p.name} />

            <div className="content">
              <h3>{p.name}</h3>
              <p>{p.description}</p>
              <strong>Rp {p.price}</strong>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}