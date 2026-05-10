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

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) navigate("/profile");
    });
  }, [navigate]);

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
      // 🔥 STEP 1: SIGN UP
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

      // 🔥 STEP 2: INSERT KE PROFILES (WAJIB)
      if (user) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: email,
            username: username,
            role: "user",
          });

        if (insertError) {
          console.error("INSERT ERROR:", insertError);
          throw new Error("Gagal menyimpan user ke database");
        }
      }

      setSuccessMsg("Registrasi berhasil! Silakan cek email.");

      setUsername("");
      setEmail("");
      setPassword("");

    } catch (err) {
      console.error("REGISTER ERROR:", err);
      setErrorMsg(err.message || "Registrasi gagal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Daftar Akun ASH Co.</h1>

        {errorMsg && <div className="form-error">{errorMsg}</div>}

        {successMsg && (
          <div className="form-success">
            <p>{successMsg}</p>
            <button
              className="btn-back-login"
              onClick={() => navigate("/userlogin")}
            >
              Login
            </button>
          </div>
        )}

        <form className="register-form" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <button disabled={loading}>
            {loading ? "Loading..." : "Daftar"}
          </button>
        </form>
      </div>
    </div>
  );
}