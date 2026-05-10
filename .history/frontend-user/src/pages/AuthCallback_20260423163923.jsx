import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      // 🔥 WAJIB pakai ini (bukan getSession)
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        navigate("/adminlogin");
        return;
      }

      const user = data.user;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/profile"); // user biasa
      }
    };

    handleAuth();
  }, [navigate]);

  return <p>Memproses login...</p>;
}