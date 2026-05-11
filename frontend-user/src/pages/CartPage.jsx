// src/pages/CartPage.jsx

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import "./CartPage.css";

const API_URL = import.meta.env.VITE_API_URL;

export default function CartPage() {

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  /* =========================
     FETCH CART
  ========================= */
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {

    try {

      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Silakan login");
        return;
      }

      const response = await fetch(
        `${API_URL}/api/cart/${user.id}`
      );

      const result = await response.json();

      console.log("CART RESULT:", result);

      if (!response.ok) {
        alert(result.message);
        return;
      }

      const formattedData =
        result.data.map((item) => ({
          ...item,
          checked: true,
        })) || [];

      setCartItems(formattedData);

    } catch (err) {

      console.log(err);

      alert("Gagal mengambil cart");

    } finally {

      setLoading(false);
    }
  };

  /* =========================
     UPDATE QTY
  ========================= */
  const updateQty = async (
    cartId,
    qty
  ) => {

    if (qty < 1) return;

    try {

      const response = await fetch(
        `${API_URL}/api/cart/update`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            cartId,
            qty,
          }),
        }
      );

      const result = await response.json();

      console.log(result);

      if (!response.ok) {
        alert(result.message);
        return;
      }

      setCartItems((prev) =>
        prev.map((item) =>
          item.id === cartId
            ? {
                ...item,
                qty,
              }
            : item
        )
      );

    } catch (err) {

      console.log(err);

      alert("Gagal update qty");
    }
  };

  /* =========================
     DELETE ITEM
  ========================= */
  const deleteItem = async (
    cartId
  ) => {

    const confirmDelete =
      confirm(
        "Hapus produk dari cart?"
      );

    if (!confirmDelete) return;

    try {

      const response = await fetch(
        `${API_URL}/api/cart/delete/${cartId}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      console.log(result);

      if (!response.ok) {
        alert(result.message);
        return;
      }

      setCartItems((prev) =>
        prev.filter(
          (item) =>
            item.id !== cartId
        )
      );

    } catch (err) {

      console.log(err);

      alert("Gagal hapus item");
    }
  };

  /* =========================
     CHECKBOX
  ========================= */
  const toggleCheck = (
    cartId
  ) => {

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartId
          ? {
              ...item,
              checked:
                !item.checked,
            }
          : item
      )
    );
  };

  /* =========================
     TOTAL HARGA
  ========================= */
  const totalPrice =
    cartItems
      .filter((item) => item.checked)
      .reduce((total, item) => {

        return (
          total +
          item.products.price *
            item.qty
        );

      }, 0);

  return (
    <div className="cart-page">

      <div className="cart-container">

        <h1 className="cart-title">
          Shopping Cart
        </h1>

        {loading ? (

          <p>Loading...</p>

        ) : cartItems.length === 0 ? (

          <p>Cart kosong</p>

        ) : (

          <>
            {/* CART ITEMS */}
            <div className="cart-list">

              {cartItems.map((item) => (

                <div
                  className="cart-card"
                  key={item.id}
                >

                  {/* CHECKBOX */}
                  <input
                    type="checkbox"
                    checked={
                      item.checked
                    }
                    onChange={() =>
                      toggleCheck(
                        item.id
                      )
                    }
                  />

                  {/* IMAGE */}
                  <img
                    src={
                      item.products
                        .image_url
                    }
                    alt={
                      item.products.name
                    }
                    className="cart-image"
                  />

                  {/* INFO */}
                  <div className="cart-info">

                    <h3>
                      {
                        item.products
                          .name
                      }
                    </h3>

                    <p>
                      Rp{" "}
                      {item.products.price.toLocaleString(
                        "id-ID"
                      )}
                    </p>

                    {/* QTY */}
                    <div className="qty-box">

                      <button
                        onClick={() =>
                          updateQty(
                            item.id,
                            item.qty - 1
                          )
                        }
                      >
                        -
                      </button>

                      <span>
                        {item.qty}
                      </span>

                      <button
                        onClick={() =>
                          updateQty(
                            item.id,
                            item.qty + 1
                          )
                        }
                      >
                        +
                      </button>

                    </div>
                  </div>

                  {/* SUBTOTAL */}
                  <div className="subtotal">

                    <p>
                      Rp{" "}
                      {(
                        item.products
                          .price *
                        item.qty
                      ).toLocaleString(
                        "id-ID"
                      )}
                    </p>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteItem(
                          item.id
                        )
                      }
                    >
                      Hapus
                    </button>

                  </div>
                </div>

              ))}

            </div>

            {/* TOTAL */}
            <div className="checkout-box">

              <h2>
                Total:
              </h2>

              <h1>
                Rp{" "}
                {totalPrice.toLocaleString(
                  "id-ID"
                )}
              </h1>

              <button
                className="checkout-btn"
              >
                Checkout
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
}