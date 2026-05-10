import { supabase } from "../../lib/supabaseClient";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserLogin.css";

export default function UserLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  //  HANDLE INPUT GENERIC (lebih scalable)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  //  CEK USER SUDAH LOGIN
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) navigate("/profile");
    };
    checkUser();
  }, [navigate]);

  //  HELPER: GET EMAIL DARI USERNAME
  const getEmailFromUsername = async (username) => {
    const { data, error } = await supabase.rpc(
      "get_email_by_username",
      { p_username: username }
    );

    console.log("RPC result:", data, error);

    if (error) throw new Error("Server error (RPC)");
    if (!data) throw new Error("Username tidak ditemukan");

    return typeof data === "string" ? data : data.email;
  };

  //  LOGIN HANDLER

const loginWithIdentifier = async (e) => {
  e.preventDefault();

  if (loading) return;

  setErrorMsg("");
  setLoading(true);

  try {
    let email = form.identifier.trim();

    // kalau bukan email → ambil dari username
    if (!email.includes("@")) {
      email = await getEmailFromUsername(email);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: form.password,
    });

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        throw new Error("Silakan verifikasi email terlebih dahulu");
      }
      throw new Error("Email atau password salah");
    }

    if (!data?.user) throw new Error("Login gagal");

    const { data: sessionData } = await supabase.auth.getSession();

    if (sessionData?.session) {
  navigate("/auth/callback");
} else {
      throw new Error("Session tidak ditemukan");
    }

  } catch (err) {
    console.error("Login error:", err);
    setErrorMsg(err.message || "Gagal login");
  } finally {
    setLoading(false);
  }
};

  //  GOOGLE LOGIN
  const loginWithGoogle = async () => {
    if (loading) return;

    setErrorMsg("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err) {
      console.error("Google login error:", err);
      setErrorMsg("Login Google gagal");
      setLoading(false);
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
              name="identifier"
              placeholder="email@example.com atau username"
              value={form.identifier}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
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
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="login-divider">
          <span>atau</span>
        </div>

        <button
          className="btn-google"
          onClick={loginWithGoogle}
          disabled={loading}
        >
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