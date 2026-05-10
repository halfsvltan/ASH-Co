import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    description: "",
  });

  const [editingProduct, setEditingProduct] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
    fetchUsers();
    fetchProducts();
  }, []);

  /* ================= ADMIN CHECK ================= */
  const checkAdmin = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      navigate("/adminlogin");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    if (profile?.role !== "admin") {
      alert("Akses ditolak!");
      navigate("/");
    }
  };

  /* ================= USERS ================= */
  const fetchUsers = async () => {
    const { data } = await supabase.from("profiles").select("*");
    setUsers(data || []);
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Hapus user ini?")) return;

    await supabase.from("profiles").delete().eq("id", id);
    fetchUsers();
  };

  /* ================= PRODUCTS ================= */
  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      alert("Isi semua field!");
      return;
    }

    await supabase.from("products").insert(newProduct);

    setNewProduct({ name: "", price: "", description: "" });
    fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Hapus produk?")) return;

    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const handleUpdateProduct = async () => {
    await supabase
      .from("products")
      .update(editingProduct)
      .eq("id", editingProduct.id);

    setEditingProduct(null);
    fetchProducts();
  };
  const handleLogout = async () => {
  await supabase.auth.signOut();
  navigate("/adminlogin");
};

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      {/* ================= USER TABLE ================= */}
      <h3>Daftar User</h3>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleDeleteUser(u.id)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= ADD PRODUCT ================= */}
      <h3>Tambah Produk</h3>
      <div className="form">
        <input
          placeholder="Nama produk"
          value={newProduct.name}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value })
          }
        />
        <input
          placeholder="Harga"
          type="number"
          value={newProduct.price}
          onChange={(e) =>
            setNewProduct({ ...newProduct, price: e.target.value })
          }
        />
        <input
          placeholder="Deskripsi"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
        />

        <button onClick={handleAddProduct}>Tambah</button>
      </div>

      {/* ================= PRODUCT TABLE ================= */}
      <h3>Daftar Produk</h3>
      <table>
        <thead>
          <tr>
            <th>Nama</th>
            <th>Harga</th>
            <th>Deskripsi</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.description}</td>
              <td>
                <button onClick={() => setEditingProduct(p)}>
                  Edit
                </button>
                <button onClick={() => handleDeleteProduct(p.id)}>
                  Hapus
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ================= EDIT MODAL ================= */}
      {editingProduct && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Produk</h3>

            <input
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  name: e.target.value,
                })
              }
            />

            <input
              value={editingProduct.price}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  price: e.target.value,
                })
              }
            />

            <input
              value={editingProduct.description}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  description: e.target.value,
                })
              }
            />

            <button onClick={handleUpdateProduct}>Update</button>
            <button onClick={() => setEditingProduct(null)}>
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
    <div className="admin-header">
  <h2>Admin Dashboard</h2>
  <button className="btn-logout" onClick={handleLogout}>
    Logout
  </button>
</div>
  );
}