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

  if (password !== confirmPassword) {
    alert("Password tidak sama!");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: "https://ash-co.vercel.app/auth/callback",
      data: {
        username: username,
      },
    },
  });

  if (error) {
    alert(error.message);
    return;
  }

  const user = data.user;

  // 🔥 FIX: bukan insert, tapi update
  if (user) {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        username: username,
        role: "admin",
      })
      .eq("id", user.id);

    if (updateError) {
      console.error(updateError);
      alert("Gagal set role admin");
      return;
    }
  }

  alert("Registrasi admin berhasil!");
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