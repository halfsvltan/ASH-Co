import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setUser(session?.user ?? null);
      setLoading(false);
    };

    checkUser();
  }, []);

  if (loading) {
    return <p className="text-center mt-20">Checking authentication...</p>;
  }

  if (!user) {
    return <Navigate to="/userlogin" replace />;
  }

  return children;
}
