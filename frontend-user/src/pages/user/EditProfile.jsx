import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css";

export default function EditProfile() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    username: "",
    full_name: "",
    phone: "",
    address: "",
  });

  // ===== LOAD DATA =====
  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/userlogin");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        alert("Gagal mengambil data");
      } else {
        setForm({
          username: data.username || "",
          full_name: data.full_name || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      }

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  // ===== HANDLE INPUT =====
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ===== SAVE =====
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase
        .from("profiles")
        .update({
          username: form.username,
          full_name: form.full_name,
          phone: form.phone,
          address: form.address,
        })
        .eq("id", user.id);

      if (error) throw error;

      alert("Profile berhasil diupdate ✅");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Gagal update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="edit-loading">Loading...</p>;

  return (
    <div className="edit-profile">
      <div className="edit-card">
        <h1>Edit Profile</h1>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Nama Lengkap</label>
            <input
              type="text"
              name="full_name"
              value={form.full_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>No. Telepon</label>
            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Alamat</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={saving} className="btn-save">
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>

        <button className="btn-cancel" onClick={() => navigate("/profile")}>
          Batal
        </button>
      </div>
    </div>
  );
}