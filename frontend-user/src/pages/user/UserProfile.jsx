import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";

const DEFAULT_AVATAR = "/images/default-avatar.jpg";

/* ================= HELPER ================= */
const resolveAvatar = (avatarUrl) => {
  if (!avatarUrl) return DEFAULT_AVATAR;

  // Tolak avatar bawaan Google (sering error / expired)
  if (
    avatarUrl.includes("googleusercontent.com") ||
    avatarUrl.includes("lh3.google")
  ) {
    return DEFAULT_AVATAR;
  }

  return avatarUrl;
};

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          navigate("/userlogin");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        let finalProfile = data;

        // Jika profile belum ada → buat baru
        if (!finalProfile) {
          const { data: inserted, error: insertError } = await supabase
            .from("profiles")
            .insert({
              id: user.id,
              username: user.email.split("@")[0],
              avatar_url: DEFAULT_AVATAR,
            })
            .select()
            .single();

          if (insertError) throw insertError;
          finalProfile = inserted;
        }

        setProfile({
          username: finalProfile.username || user.email.split("@")[0],
          full_name:
            finalProfile.full_name ||
            user.user_metadata?.full_name ||
            user.email.split("@")[0],
          email: user.email,
          phone: finalProfile.phone || "-",
          address: finalProfile.address || "-",
          avatar_url: resolveAvatar(finalProfile.avatar_url),
        });
      } catch (err) {
        console.error("PROFILE ERROR:", err);
        alert("Gagal memuat profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  /* ================= UPLOAD AVATAR ================= */
  const uploadAvatar = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      const ext = file.name.split(".").pop();
      const fileName = `${user.id}.${ext}`;

      await supabase.storage.from("avatars").upload(fileName, file, {
        upsert: true,
      });

      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      await supabase
        .from("profiles")
        .update({ avatar_url: data.publicUrl })
        .eq("id", user.id);

      setProfile((prev) => ({
        ...prev,
        avatar_url: data.publicUrl,
      }));
    } catch (err) {
      console.error(err);
      alert("Gagal upload avatar");
    } finally {
      setUploading(false);
    }
  };

  /* ================= RENDER ================= */
  if (loading) return <p className="profile-loading">Loading...</p>;
  if (!profile) return null;

  return (
    <div className="user-profile">
      <div className="profile-card">
        <div className="profile-header">
          <label className="avatar-wrapper">
            <img
              src={profile.avatar_url}
              alt="Avatar"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = DEFAULT_AVATAR;
              }}
            />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => uploadAvatar(e.target.files[0])}
            />
            <span className="avatar-edit">
              {uploading ? "..." : "✏️"}
            </span>
          </label>

          <div className="profile-text">
            <h2>{profile.full_name}</h2>
            <p className="username">@{profile.username}</p>
            <p>{profile.email}</p>
          </div>
        </div>

        <div className="profile-info">
          <div>
            <span>Nomor Telepon</span>
            <p>{profile.phone}</p>
          </div>
          <div>
            <span>Alamat Lengkap</span>
            <p>{profile.address}</p>
          </div>
        </div>

        <button className="profile-btn" onClick={() => navigate("/")}>
          Kembali ke Home
        </button>
      </div>
    </div>
  );
}
