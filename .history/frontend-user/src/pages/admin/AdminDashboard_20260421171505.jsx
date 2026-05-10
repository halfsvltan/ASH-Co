import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
    fetchUsers();
  }, []);

  // 🔐 CEK ROLE ADMIN
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

  // 📊 AMBIL SEMUA USER
  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    setUsers(data);
  };

  // ❌ DELETE USER
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin hapus user?");
    if (!confirmDelete) return;

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Gagal hapus user");
      return;
    }

    fetchUsers();
  };

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <div className="table-container">
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(user.id)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}