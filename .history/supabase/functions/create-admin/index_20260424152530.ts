import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/* ================= CORS ================= */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

/* ================= FUNCTION ================= */
serve(async (req) => {
  // 🔥 handle preflight (WAJIB untuk browser)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    /* ================= VALIDASI BODY ================= */
    const body = await req.json();
    const { email, password, username } = body;

    if (!email || !password || !username) {
      throw new Error("Data tidak lengkap");
    }

    /* ================= AUTH HEADER ================= */
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Unauthorized: No token");
    }

    const token = authHeader.replace("Bearer ", "");

    /* ================= CLIENT USER ================= */
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
      throw new Error("Unauthorized: invalid user");
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

    /* ================= CEK EMAIL SUDAH ADA ================= */
    const { data: existingUser } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      throw new Error("Email sudah terdaftar");
    }

    /* ================= CREATE ADMIN ================= */
    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username },
      });

    if (createError || !newUser?.user) {
      throw new Error(createError?.message || "Gagal membuat user");
    }

    /* ================= INSERT PROFILE ================= */
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: newUser.user.id,
        email,
        username,
        role: "admin",
      });

    if (profileError) {
      throw new Error("Gagal insert profile: " + profileError.message);
    }

    /* ================= SUCCESS ================= */
    return new Response(
      JSON.stringify({
        message: "Admin berhasil dibuat",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("EDGE FUNCTION ERROR:", err);

    return new Response(
      JSON.stringify({
        error: err.message || "Internal Server Error",
      }),
      {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});