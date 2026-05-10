import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // ================= AMBIL USER =================
        const { data } = await supabase.auth.getUser();

        if (!data?.user) {
          navigate("/userlogin");
          return;
        }

        const user = data.user;

        // ================= CEK PROFILE =================
        let { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle(); // 🔥 FIX DI SINI

        // ================= HANDLE PROFILE HILANG =================
        if (!profile) {
          console.log("Profile tidak ditemukan, logout...");

          await supabase.auth.signOut(); // 🔥 logout paksa
          navigate("/userlogin");
          return;
        }

        // ================= REDIRECT BERDASARKAN ROLE =================
        if (profile.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }

      } catch (err) {
        console.error("AUTH CALLBACK ERROR:", err);

        await supabase.auth.signOut(); // 🔥 jaga-jaga
        navigate("/userlogin");
      }
    };

    handleAuth();
  }, [navigate]);

  return <p style={{ textAlign: "center" }}>Memproses login...</p>;
}