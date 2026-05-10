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

  const isAuthPage =
    path === "/userlogin" ||
    path === "/userregister" ||
    path === "/editprofile";

  const isMinimalPage =
    path === "/profile" || path === "/about";

  const isHome = path === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  const handleScrollTo = (id) => {
    setMenuOpen(false);

    if (!isHome) {
      navigate("/", { state: { scrollTo: id } });
      return;
    }

    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleBack = () => {
    if (path === "/editprofile") {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>

      {isMinimalPage ? (
        <div className="navbar__minimal">
          <button className="back-icon" onClick={handleBack}>←</button>
          <img src={logo} alt="ASH Logo" className="navbar__logo" />
          <button className="btn-cart">🛒</button>
        </div>

      ) : isAuthPage ? (

        <div className="navbar__left">
          <button className="back-icon" onClick={handleBack}>←</button>
          <img src={logo} alt="ASH Logo" className="navbar__logo" />
        </div>

      ) : (
        <>
          <div className="navbar__left">
            {!isHome && (
              <button className="back-icon" onClick={handleBack}>←</button>
            )}
            <img src={logo} alt="ASH Logo" className="navbar__logo" />
          </div>

          <ul className={`navbar__menu ${menuOpen ? "active" : ""}`}>
            <li onClick={() => handleScrollTo("products")}>Product</li>
            <li onClick={() => handleScrollTo("services")}>Services</li>

            <li>
              <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
            </li>

            <li onClick={() => handleScrollTo("footer")}>Contact</li>

            <li className="mobile-only mobile-cart">
              <span className="cart-icon">🛒</span>
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

          <div className="navbar__actions">
            <button className="btn-cart">🛒</button>

            {!user ? (
              <Link to="/userlogin" className="btn-login">
                LOGIN / REGISTER
              </Link>
            ) : (
              <Link to="/profile" className="navbar-profile">👤</Link>
            )}
          </div>

          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </>
      )}
    </nav>
  );
}