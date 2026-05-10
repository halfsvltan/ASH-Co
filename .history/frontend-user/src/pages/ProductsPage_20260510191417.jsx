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

    if (error) {
      console.log(error);
      return;
    }

    if (data) {
      setProducts(data);
    }
  };

  /* =========================
     ADD TO CART
  ========================= */
  const addToCart = async (productId) => {

    // GET USER LOGIN
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // JIKA BELUM LOGIN
    if (!user) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    console.log("USER ID:", user.id);
    console.log("PRODUCT ID:", productId);

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
            productId: productId,
            qty: 1,
          }),
        }
      );

      const data = await res.json();

      console.log("RESPONSE:", data);

      // JIKA ERROR
      if (!res.ok) {
        alert(
          data.message ||
          "Gagal menambahkan ke cart"
        );
        return;
      }

      // SUCCESS
      alert("Produk berhasil ditambahkan");

    } catch (err) {

      console.log("ERROR:", err);

      alert(
        "Backend tidak terhubung"
      );
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
                    onClick={() =>
                      addToCart(p.id)
                    }
                  >
                    Add To Cart
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