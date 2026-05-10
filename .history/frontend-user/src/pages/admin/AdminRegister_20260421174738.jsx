import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabaseClient";
import "./AdminRegister.css";

export default function AdminRegister() {
  const [username, setUsername] = useState(""); // tetap dipakai (opsional nanti update profile)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // VALIDASI PASSWORD
    if (password !== confirmPassword) {
      alert("Password tidak sama!");
      return;
    }

    // SIGN UP
    const { error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    emailRedirectTo: "http://localhost:5173/auth/callback",
    data: {
      username: username,
    },
  },
});

    if (error) {
      alert(error.message);
      return;
    }

    //  TANPA INSERT KE PROFILES (BIAR TRIGGER YANG HANDLE)
    alert("Registrasi berhasil! Silakan cek email untuk verifikasi.");
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