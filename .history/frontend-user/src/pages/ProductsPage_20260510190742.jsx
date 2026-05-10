import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./ProductsPage.css";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =========================
     GET PRODUCTS
  ========================= */
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (!error && data) {
      setProducts(data);
    }
  };

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = async (productId) => {

    // AMBIL USER LOGIN
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // JIKA BELUM LOGIN
    if (!user) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    try {

      const res = await fetch(
        "http://localhost:5000/api/cart/add",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            userId: user.id,
            productId,
            qty: 1,
          }),
        }
      );

      const data = await res.json();

      alert(data.message);

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="page">
      <div className="container">

        <h1 className="title">
          Our Products
        </h1>

        <p className="subtitle">
          Discover our latest collection
        </p>

        <div className="grid">
          {products.map((p) => (

            <div key={p.id} className="card">

              <div className="image-wrapper">
                <img
                  src={
                    p.image_url ||
                    "https://via.placeholder.com/400"
                  }
                  alt={p.name}
                />
              </div>

              <div className="info">

                <h3>{p.name}</h3>

                <p>{p.description}</p>

                <div className="bottom">

                  <span className="price">
                    Rp{" "}
                    {p.price?.toLocaleString(
                      "id-ID"
                    )}
                  </span>

                  <button
                    className="btn"
                    onClick={() =>
                      addToCart(p.id)
                    }
                  >
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