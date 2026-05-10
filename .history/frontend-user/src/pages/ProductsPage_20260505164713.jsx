import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./ProductsPage.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (!error && data) {
      setProducts(data);
    }
  };

  return (
    <div className="products-page">
      <div className="container">
        <h1 className="title">PRODUCT PAGE</h1>

        <p className="debug">Total produk: {products.length}</p>

        {products.length === 0 ? (
          <p className="empty">No products available</p>
        ) : (
          <div className="products-grid">
            {products.map((p) => (
              <div key={p.id} className="product-card">

                <div className="img-wrapper">
                  <img 
  src="https://via.placeholder.com/300" 
  style={{ border: "3px solid red" }} 
/>
                </div>

                <div className="content">
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className="price">
                    Rp {p.price?.toLocaleString("id-ID")}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}