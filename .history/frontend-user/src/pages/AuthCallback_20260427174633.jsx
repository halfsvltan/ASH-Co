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
          .maybeSingle(); // ✅ FIX (AMAN)

        // ================= AUTO CREATE PROFILE =================
        if (!profile) {
          console.log("Profile belum ada, membuat...");

          const { error: insertError } = await supabase
            .from("profiles")
            .upsert({ // ✅ FIX (ANTI RLS)
              id: user.id,
              email: user.email,
              username:
                user.user_metadata?.username ||
                user.email.split("@")[0],
              role: "user",
            });

          if (insertError) {
            console.error("Gagal insert profile:", insertError);

            await supabase.auth.signOut(); // ✅ FIX ghost session
            navigate("/userlogin");
            return;
          }

          // ambil ulang profile
          const res = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

          profile = res.data;
        }

        // ================= GUARD PROFILE =================
        if (!profile) {
          await supabase.auth.signOut(); // ✅ FIX ghost session
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

        await supabase.auth.signOut(); // ✅ FIX
        navigate("/userlogin");
      }
    };

    handleAuth();
  }, [navigate]);

  return <p style={{ textAlign: "center" }}>Memproses login...</p>;
}