import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./AdminRegister.css";

export default function AdminRegister() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ VALIDASI PASSWORD
    if (password !== confirmPassword) {
      alert("Password tidak sama!");
      return;
    }

    // ✅ SIGN UP
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // ❗ HANDLE EMAIL CONFIRMATION (user bisa null)
    if (!data.user) {
      alert("Silakan cek email untuk verifikasi akun terlebih dahulu.");
      return;
    }

    // ✅ INSERT KE PROFILES
    const { error: insertError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        username: username,
        email: data.user.email,
        role: "admin",
      },
    ]);

    if (insertError) {
      alert("Gagal menyimpan data: " + insertError.message);
      return;
    }

    alert("Admin berhasil dibuat!");
    navigate("/adminlogin");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Admin Register</h2>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {/* PASSWORD */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Konfirmasi Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Register Admin</button>

          <p className="auth-footer">
            Sudah memiliki akun?{" "}
            <Link to="/adminlogin">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}