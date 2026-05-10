import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "./Navbar.css";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname;

  // 🔥 MODE HALAMAN
  const isAuthPage =
    path === "/userlogin" ||
    path === "/userregister" ||
    path === "/editprofile";

  const isMinimalPage =
    path === "/profile" || path === "/about";

  const isHome = path === "/";

  /* ================= SCROLL EFFECT (FIXED) ================= */
  useEffect(() => {
    const root = document.getElementById("root");

    const handleScroll = () => {
      if (root) {
        setScrolled(root.scrollTop > 50);
      }
    };

    if (root) {
      root.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (root) {
        root.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  /* ================= AUTH STATE ================= */
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

  /* ================= SCROLL FIX (FIXED) ================= */
  const handleScrollTo = (id) => {
    setMenuOpen(false);

    if (!isHome) {
      navigate("/", { state: { scrollTo: id } });
      return;
    }

    const root = document.getElementById("root");
    const el = document.getElementById(id);

    if (el && root) {
      root.scrollTo({
        top: el.offsetTop,
        behavior: "smooth",
      });
    }
  };

  /* ================= BACK BUTTON ================= */
  const handleBack = () => {
    if (path === "/editprofile") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      {/* 🔥 MODE MINIMAL */}
      {isMinimalPage ? (
        <div className="navbar__minimal">
          <button className="back-icon" onClick={handleBack}>
            ←
          </button>

          <img src={logo} alt="ASH Logo" className="navbar__logo" />

          <button className="btn-cart">🛒</button>
        </div>

      ) : isAuthPage ? (

        /* 🔥 AUTH PAGE */
        <div className="navbar__left">
          <button className="back-icon" onClick={handleBack}>
            ←
          </button>

          <img src={logo} alt="ASH Logo" className="navbar__logo" />
        </div>

      ) : (
        <>
          {/* LEFT */}
          <div className="navbar__left">
            {!isHome && (
              <button className="back-icon" onClick={handleBack}>
                ←
              </button>
            )}
            <img src={logo} alt="ASH Logo" className="navbar__logo" />
          </div>

          {/* MENU */}
          <ul className={`navbar__menu ${menuOpen ? "active" : ""}`}>
            <li onClick={() => handleScrollTo("products")}>Product</li>
            <li onClick={() => handleScrollTo("services")}>Services</li>

            <li>
              <Link to="/about" onClick={() => setMenuOpen(false)}>
                About
              </Link>
            </li>

            <li onClick={() => handleScrollTo("footer")}>Contact</li>

            {/* MOBILE */}
            <li className="mobile-only mobile-cart">
              🛒
            </li>

            {!user ? (
              <li className="mobile-only login-mobile">
                <Link to="/userlogin" onClick={() => setMenuOpen(false)}>
                  LOGIN / REGISTER
                </Link>
              </li>
            ) : (
              <li className="mobile-only mobile-profile">
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  👤 Your Profile
                </Link>
              </li>
            )}
          </ul>

          {/* RIGHT */}
          <div className="navbar__actions">
            <button className="btn-cart">🛒</button>

            {!user ? (
              <Link to="/userlogin" className="btn-login">
                LOGIN / REGISTER
              </Link>
            ) : (
              <Link to="/profile" className="navbar-profile">
                👤
              </Link>
            )}
          </div>

          {/* HAMBURGER */}
          <div
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </>
      )}
    </nav>
  );
}