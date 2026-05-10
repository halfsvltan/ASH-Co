import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        // 🔐 cek role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .single();

        if (profile?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/"); // atau user dashboard
        }
      } else {
        navigate("/adminlogin");
      }
    };

    handleSession();
  }, [navigate]);

  return <p>Memproses login...</p>;
}