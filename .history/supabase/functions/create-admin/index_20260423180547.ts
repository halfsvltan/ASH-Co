import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { email, password, username } = await req.json();

    // 🔐 Ambil token dari request header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Unauthorized");
    }

    const token = authHeader.replace("Bearer ", "");

    // 🔐 Client untuk cek user login
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
      }
    );

    // 🔍 Ambil user dari token
    const {
      data: { user },
      error: userError,
    } = await supabaseUser.auth.getUser();

    if (userError || !user) {
      throw new Error("Unauthorized");
    }

    // 🔥 CLIENT ADMIN (pakai service role)
    const supabaseAdmin = createClient(
      Deno.env.get("https://tkklinskyisadmjnkppt.supabase.co/rest/v1/")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // 🔐 CEK ROLE (INI KODE YANG KAMU TANYA)
    const { data: requester } = await supabaseAdmin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (requester?.role !== "admin") {
      throw new Error("Unauthorized: bukan admin");
    }

    // 🔥 CREATE ADMIN BARU
    const { data: newUser, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username },
      });

    if (createError) throw createError;

    // 🔥 INSERT PROFILE
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: newUser.user.id,
        email,
        username,
        role: "admin",
      });

    if (profileError) throw profileError;

    return new Response(
      JSON.stringify({ message: "Admin berhasil dibuat" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400 }
    );
  }
});