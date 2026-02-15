import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";

export default function UserLogin() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) navigate("/profile");
    };
    checkUser();
  }, [navigate]);

  const loginWithIdentifier = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      let emailToLogin = identifier.trim();

      // 🔐 LOGIN VIA USERNAME → RPC
      if (!emailToLogin.includes("@")) {
        const { data, error } = await supabase.rpc(
          "get_email_by_username",
          { p_username: emailToLogin }
        );

        if (error || !data) {
          throw new Error("Username tidak ditemukan");
        }

        emailToLogin = data;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToLogin,
        password,
      });

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Silakan verifikasi email terlebih dahulu");
        }
        throw error;
      }

      if (!data?.user) {
        throw new Error("Login gagal");
      }

      navigate("/profile");
    } catch (err) {
      setErrorMsg(err.message || "Gagal login");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`,
      },
    });

    if (error) setErrorMsg(error.message);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">Login ke ASH Co.</h1>
        <p className="login-subtitle">
          Masuk menggunakan email atau username
        </p>

        {errorMsg && <div className="form-error">{errorMsg}</div>}

        <form className="login-form" onSubmit={loginWithIdentifier}>
          <div className="form-group">
            <label>Email / Username</label>
            <input
              type="text"
              placeholder="email@example.com atau username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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
          </div>

          <button
            type="submit"
            className="btn-login-main"
            disabled={loading}
          >
            {loading ? "Memeriksa..." : "Masuk"}
          </button>
        </form>

        <div className="login-divider">
          <span>atau</span>
        </div>

        <button className="btn-google" onClick={loginWithGoogle}>
          <span className="google-icon">G</span>
          Login dengan Google
        </button>

        <p className="register-text">
          Belum punya akun?{" "}
          <span onClick={() => navigate("/userregister")}>
            Daftar di sini
          </span>
        </p>

        <button className="btn-back" onClick={() => navigate("/")}>
          ← Kembali
        </button>
      </div>
    </div>
  );
}
