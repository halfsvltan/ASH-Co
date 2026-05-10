import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./AdminRegister.css";

export default function AdminRegister() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    // 🔥 langsung set role admin di profiles
    await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email: data.user.email,
        role: "admin",
      },
    ]);

    alert("Admin berhasil dibuat!");
    navigate("/adminlogin");
  };

  return (
    <div className="auth-container">
      <h2>Admin Register</h2>

      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Register Admin</button>
      </form>
    </div>
  );
}