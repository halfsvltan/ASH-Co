import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./ProductsPage.css";

export default function ProductsPage() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH PRODUCTS
  ========================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {

    try {

      const {
        data,
        error,
      } = await supabase
        .from("products")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

      console.log("PRODUCTS:", data);
      console.log("PRODUCT ERROR:", error);

      if (error) {
        alert(error.message);
        return;
      }

      setProducts(data || []);

    } catch (err) {

      console.log("FETCH PRODUCTS ERROR:", err);

      alert("Gagal mengambil produk");
    }
  };

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = async (productId) => {

    try {

      setLoading(true);

      /* =========================
         GET USER LOGIN
      ========================= */
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      console.log("USER:", user);
      console.log("USER ERROR:", userError);

      // BELUM LOGIN
      if (!user) {
        alert("Silakan login terlebih dahulu");
        return;
      }

      console.log("USER ID:", user.id);
      console.log("PRODUCT ID:", productId);

      /* =========================
         FETCH API
      ========================= */
      const response = await fetch(
        "http://127.0.0.1:5000/api/cart/add",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: user.id,
            productId: productId,
            qty: 1,
          }),
        }
      );

      console.log("RAW RESPONSE:", response);

      // CEK RESPONSE
      const result = await response.json();

      console.log("RESULT:", result);

      // ERROR RESPONSE
      if (!response.ok) {

        alert(
          result.message ||
          "Gagal menambahkan produk"
        );

        return;
      }

      // SUCCESS
      alert("Produk berhasil ditambahkan ke cart");

    } catch (err) {

      console.log("ADD TO CART ERROR:", err);

      alert(
        "Backend tidak terhubung / fetch gagal"
      );

    } finally {

      setLoading(false);
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

          {products.length > 0 ? (

            products.map((p) => (

              <div
                key={p.id}
                className="card"
              >

                {/* IMAGE */}
                <div className="image-wrapper">

                  <img
                    src={
                      p.image_url ||
                      "https://via.placeholder.com/400"
                    }
                    alt={p.name}
                  />

                </div>

                {/* INFO */}
                <div className="info">

                  <h3>{p.name}</h3>

                  <p>
                    {p.description}
                  </p>

                  <div className="bottom">

                    <span className="price">
                      Rp{" "}
                      {p.price?.toLocaleString(
                        "id-ID"
                      )}
                    </span>

                    <button
                      className="btn"
                      disabled={loading}
                      onClick={() =>
                        addToCart(p.id)
                      }
                    >
                      {
                        loading
                          ? "Loading..."
                          : "Add To Cart"
                      }
                    </button>

                  </div>
                </div>
              </div>

            ))

          ) : (

            <p>
              Produk tidak tersedia
            </p>

          )}

        </div>
      </div>
    </div>
  );
}