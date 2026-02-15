import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "./Navbar.css";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  const location = useLocation();
  const isHome = location.pathname === "/";
  const isAbout = location.pathname === "/about";

  /* ================= SCROLL EFFECT ================= */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= AUTH STATE (STABIL) ================= */
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

useEffect(() => {
  const fetchProfile = async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("avatar_url, full_name")
      .eq("id", user.id)
      .maybeSingle(); // ✅ FIX PENTING

    if (error) {
      console.warn("Navbar profile fetch:", error.message);
      setProfile(null);
      return;
    }

    setProfile({
      avatar_url: data?.avatar_url || null,
      full_name: data?.full_name || null,
    });
  };

  fetchProfile();
}, [user]);


  /* ================= SCROLL TO SECTION ================= */
  const handleScrollTo = (id) => {
    setMenuOpen(false);

    if (!isHome) {
      window.location.href = "/";
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  /* ================= AVATAR LOGIC (FIX FINAL) ================= */
  const DEFAULT_AVATAR = "/images/default-avatar.jpg";

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

const avatar = resolveAvatar(profile?.avatar_url);

  const username =
    profile?.full_name ||
    user?.email?.split("@")[0];

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      {/* LEFT */}
      <div className="navbar__left">
        {!isHome && (
          <button
            className="back-icon"
            onClick={() => window.history.back()}
          >
            ←
          </button>
        )}
        <img src={logo} alt="ASH Logo" className="navbar__logo" />
      </div>

      {/* CENTER MENU */}
      {!isAbout && (
        <ul className={`navbar__menu ${menuOpen ? "active" : ""}`}>
          <li onClick={() => handleScrollTo("products")}>Product</li>
          <li onClick={() => handleScrollTo("services")}>Services</li>

          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>

          <li onClick={() => handleScrollTo("footer")}>Contact</li>

          {/* MOBILE ONLY */}
          <li className="mobile-only mobile-cart">
            <span className="cart-icon">🛒</span> Keranjang
          </li>

          {!user ? (
            <li className="mobile-only login-mobile">
              <Link to="/userlogin">LOGIN / REGISTER</Link>
            </li>
          ) : (
            <>
              <li className="mobile-only mobile-profile">
                <Link to="/profile">
                  <img
                    key={avatar}
                    src={avatar}
                    alt="avatar"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = DEFAULT_AVATAR;
                    }}
                  />
                  <span>{username}</span>
                </Link>
              </li>

              <li
                className="mobile-only"
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
              >
                LOGOUT
              </li>
            </>
          )}
        </ul>
      )}

      {/* RIGHT */}
      <div className="navbar__actions">
        <button className="btn-cart" aria-label="Keranjang">
          🛒
        </button>

        {!user ? (
          <Link to="/userlogin" className="btn-login">
            LOGIN / REGISTER
          </Link>
        ) : (
          <>
            <Link to="/profile" className="navbar-profile">
              <img
                key={avatar}
                src={avatar}
                alt="avatar"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = DEFAULT_AVATAR;
                }}
              />
              <span>{username}</span>
            </Link>

            <button
              className="btn-login"
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
            >
              LOGOUT
            </button>
          </>
        )}
      </div>

      {/* HAMBURGER */}
      {!isAbout && (
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      )}
    </nav>
  );
}
