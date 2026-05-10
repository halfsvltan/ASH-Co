import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const { data, error } = await supabase.from("products").select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (!error) {
      setProducts(data);
    }
  };

  return (
    <div style={{ paddingTop: "120px", color: "white" }}>
      <h1>PRODUCT PAGE</h1>

      {/* DEBUG */}
      <pre>{JSON.stringify(products, null, 2)}</pre>

      {/* RENDER */}
      {products.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid white",
            margin: "20px",
            padding: "20px",
          }}
        >
          <h2>{p.name}</h2>
          <p>{p.description}</p>
          <p>Rp {p.price}</p>

          <img
            src={p.image_url}
            alt=""
            style={{ width: "200px" }}
          />
        </div>
      ))}
    </div>
  );
}