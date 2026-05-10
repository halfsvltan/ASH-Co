import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { email, password, username } = await req.json();

    /* ================= AUTH HEADER ================= */
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Unauthorized: No token");
    }

    const token = authHeader.replace("Bearer ", "");

    /* ================= CLIENT USER (VALIDASI LOGIN) ================= */
    const supabaseUser = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("ANON_KEY")!,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized: Invalid user");
    }

    /* ================= CLIENT ADMIN ================= */
    const supabaseAdmin = createClient(
      Deno.env.get("PROJECT_URL")!,
      Deno.env.get("SERVICE_ROLE_KEY")!
    );

    /* ================= CEK ROLE ================= */
    const { data: requester, error: roleError } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (roleError || requester?.role !== "admin") {
      throw new Error("Unauthorized: bukan admin");
    }

    /* ================= CREATE ADMIN ================= */
    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username },
      });

    if (createError) throw createError;

    /* ================= INSERT PROFILE ================= */
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: newUser.user.id,
        email,
        username,
        role: "admin",
      });

    if (profileError) throw profileError;

    /* ================= RESPONSE ================= */
    return new Response(
      JSON.stringify({ message: "Admin berhasil dibuat" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});