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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      const user = data.user;

      // 🔥 INSERT MANUAL KE PROFILES (INI KUNCI FIX ERROR)
      if (user) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: email,
            username: username,
            role: "user",
          });

        if (insertError) throw insertError;
      }

      setSuccessMsg("Registrasi berhasil! Silakan login.");

      setUsername("");
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/userlogin");
      }, 1500);

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
        <h1>Register</h1>

        {errorMsg && <p className="form-error">{errorMsg}</p>}
        {successMsg && <p className="form-success">{successMsg}</p>}

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
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}