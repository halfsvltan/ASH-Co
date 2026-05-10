import { useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        // 🔥 PENTING: ambil session dulu
        const { data: sessionData } = await supabase.auth.getSession();
        const session = sessionData.session;

        if (!session) {
          navigate("/userlogin");
          return;
        }

        const user = session.user;

        // ================= UPSERT PROFILE =================
        const { error } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            email: user.email,
            username:
              user.user_metadata?.username ||
              user.email.split("@")[0],
            role: "user",
          });

        if (error) {
          console.error("UPSERT ERROR:", error);
          navigate("/");
          return;
        }

        // ================= AMBIL PROFILE =================
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        // ================= REDIRECT =================
        if (profile?.role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/profile");
        }

      } catch (err) {
        console.error("AUTH CALLBACK ERROR:", err);
        navigate("/userlogin");
      }
    };

    handleAuth();
  }, [navigate]);

  return <p style={{ textAlign: "center" }}>Memproses login...</p>;
}