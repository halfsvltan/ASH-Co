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

  // ✅ CEK USER SUDAH LOGIN
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        navigate("/profile");
      }
    };
    checkUser();
  }, [navigate]);

  // ✅ LOGIN EMAIL / USERNAME
  const loginWithIdentifier = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      let emailToLogin = identifier.trim();

      // 🔐 JIKA INPUT = USERNAME → CONVERT KE EMAIL VIA RPC
      if (!emailToLogin.includes("@")) {
        const { data, error } = await supabase.rpc(
          "get_email_by_username",
          { p_username: emailToLogin }
        );

        console.log("RPC result:", data, error);

        if (error) {
          throw new Error("Terjadi kesalahan pada server (RPC)");
        }

        if (!data) {
          throw new Error("Username tidak ditemukan");
        }

        // handle jika return string / object
        emailToLogin =
          typeof data === "string" ? data : data.email;
      }

      // 🔑 LOGIN KE SUPABASE
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToLogin,
        password,
      });

      console.log("Login result:", data, error);

      if (error) {
        if (error.message.includes("Email not confirmed")) {
          throw new Error("Silakan verifikasi email terlebih dahulu");
        }
        throw new Error("Email atau password salah");
      }

      if (!data?.user) {
        throw new Error("Login gagal");
      }

      navigate("/profile");
    } catch (err) {
      console.error("Login error:", err);
      setErrorMsg(err.message || "Gagal login");
    } finally {
      setLoading(false);
    }
  };

  // ✅ LOGIN GOOGLE (FIX REDIRECT)
  const loginWithGoogle = async () => {
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/profile`,
      },
    });

    if (error) {
      console.error("Google login error:", error);
      setErrorMsg("Login Google gagal");
    }
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
                style={{ cursor: "pointer" }}
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
      </div>
    </div>
  );
}