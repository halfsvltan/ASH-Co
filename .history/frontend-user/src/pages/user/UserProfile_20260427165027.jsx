import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import "./UserProfile.css";
import defaultAvatar from "../../assets/images/default-avatar.jpg";

const DEFAULT_AVATAR = defaultAvatar;

const resolveAvatar = (avatarUrl) => {
  if (!avatarUrl) return DEFAULT_AVATAR;

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

        // 🔥 AMBIL PROFILE
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error && error.code !== "PGRST116") throw error;

        // 🔥 CEK ROLE (INI KUNCI UTAMA)
        if (data?.role === "admin") {
          navigate("/admin/dashboard");
          return;
        }

        let finalProfile = data;

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
        alert(err.message || "Gagal memuat profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) {
          navigate("/userlogin");
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  const uploadAvatar = async (file) => {
    if (!file) return;

    try {
      setUploading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("User tidak ditemukan");

      const ext = file.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);

      if (updateError) throw updateError;

      setProfile((prev) => ({
        ...prev,
        avatar_url: publicUrl,
      }));
    } catch (err) {
      console.error("UPLOAD ERROR:", err);
      alert(err.message || "Gagal upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/userlogin");
  };

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
            <p>@{profile.username}</p>
            <p>{profile.email}</p>
          </div>
        </div>

        <div className="profile-info">
          <div>
            <span>Nomor Telepon</span>
            <p>{profile.phone}</p>
          </div>
          <div>
            <span>Alamat</span>
            <p>{profile.address}</p>
          </div>
        </div>

        <button onClick={() => navigate("/editprofile")}>
          Edit Profile
        </button>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}