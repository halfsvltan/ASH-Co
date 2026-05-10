import { supabase } from "../../lib/supabaseClient";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserRegister.css";

export default function UserRegister() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 🔁 redirect kalau sudah login
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) navigate("/profile");
    });
  }, [navigate]);

  // 🔐 PASSWORD RULES (sinkron Supabase)
  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[@$!%*?&#^()\-_=+{}[\]|\\:;"'<>,./]/.test(password),
  };

  const isPasswordValid = Object.values(rules).every(Boolean);

  const handleRegister = async (e) => {
  e.preventDefault();
  setErrorMsg("");
  setSuccessMsg("");

  if (!isPasswordValid) {
    setErrorMsg("Password belum memenuhi semua kriteria keamanan.");
    return;
  }

  setLoading(true);

  try {
    // 🔐 STEP 1: SIGN UP
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: `${window.location.origin}/userlogin`,
      },
    });

    if (error) throw error;

    const user = data.user;

    // ❗ Kalau email confirmation aktif, user bisa null
    if (!user) {
      setSuccessMsg(
        "Registrasi berhasil! Silakan cek email untuk aktivasi akun."
      );
      return;
    }

    // 🔥 STEP 2: INSERT ke profiles
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: user.id,
        username: username,
        email: email,
        avatar_url: "/images/default-avatar.jpg",
      });

    if (profileError) throw profileError;

    setSuccessMsg("Registrasi berhasil!");
    setUsername("");
    setEmail("");
    setPassword("");

    navigate("/profile");

  } catch (err) {
    console.error(err);
    setErrorMsg(err.message || "Registrasi gagal");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Daftar Akun ASH Co.</h1>
        <p className="register-subtitle">
          Buat akun baru untuk menjelajahi produk ASH CO
        </p>

        {errorMsg && <div className="form-error">{errorMsg}</div>}
        {successMsg && <div className="form-success">{successMsg}</div>}

        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="username unik"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password aman"
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

            {/* 🔒 LIVE PASSWORD CHECKLIST */}
            <ul className="password-checklist">
              <li className={rules.length ? "ok" : ""}>
                Minimal 8 karakter
              </li>
              <li className={rules.upper ? "ok" : ""}>
                1 huruf besar
              </li>
              <li className={rules.number ? "ok" : ""}>
                1 angka
              </li>
              <li className={rules.symbol ? "ok" : ""}>
                1 simbol
              </li>
            </ul>
          </div>

          <button
            type="submit"
            className="btn-register-main"
            disabled={loading}
          >
            {loading ? "Mendaftarkan..." : "Daftar"}
          </button>
        </form>

        <p className="login-text">
          Sudah punya akun?{" "}
          <span onClick={() => navigate("/userlogin")}>
            Login di sini
          </span>
        </p>
      </div>
    </div>
  );
}