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

  const isPureAuthPage =
    path === "/userlogin" ||
    path === "/userregister";

  const isProfilePage =
    path === "/profile" ||
    path === "/editprofile";

  const isHome = path === "/";
  const isAbout = path === "/about";

  /* ================= SCROLL ================= */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= AUTO CLOSE MENU ================= */
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  /* ================= AUTH ================= */
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

  /* ================= SCROLL TO ================= */
  const handleScrollTo = (id) => {
    setMenuOpen(false);

    if (!isHome) {
      navigate("/", { state: { scrollTo: id } });
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      
      {/* 🔥 AUTH & PROFILE MODE */}
      {(isPureAuthPage || isProfilePage) ? (
        <>
          <div className="navbar__left">
            <button className="back-icon" onClick={() => navigate("/")}>
              ←
            </button>
            <img src={logo} alt="ASH Logo" className="navbar__logo" />
          </div>

          {/* CART hanya profile */}
          {isProfilePage && (
            <div className="navbar__actions">
              <button className="btn-cart">🛒</button>
            </div>
          )}
        </>
      ) : (
        <>
          {/* LEFT */}
          <div className="navbar__left">
            {!isHome && (
              <button className="back-icon" onClick={() => navigate("/")}>
                ←
              </button>
            )}
            <img src={logo} alt="ASH Logo" className="navbar__logo" />
          </div>

          {/* MENU */}
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

              <li className="mobile-only mobile-cart">
                🛒 Keranjang
              </li>

              {!user ? (
                <li className="mobile-only login-mobile">
                  <Link to="/userlogin">LOGIN / REGISTER</Link>
                </li>
              ) : (
                <li className="mobile-only mobile-profile">
                  <Link to="/profile">👤 Your Profile</Link>
                </li>
              )}
            </ul>
          )}

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
        </>
      )}
    </nav>
  );
}