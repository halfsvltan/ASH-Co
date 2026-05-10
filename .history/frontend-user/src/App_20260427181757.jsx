import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useEffect } from "react";

import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Products from "./sections/Products";
import Services from "./sections/Services";
import Clients from "./sections/Clients";
import Footer from "./components/Footer";

import UserLogin from "./pages/user/UserLogin";
import UserRegister from "./pages/user/UserRegister";
import UserProfile from "./pages/user/UserProfile";
import EditProfile from "./pages/user/EditProfile";

import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AuthCallback from "./pages/AuthCallback";

import ProductsPage from "./pages/ProductsPage";

/* ================= SCROLL TO TOP ================= */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

/* ================= HOME ================= */
function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      el?.scrollIntoView({ behavior: "smooth" });

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  return (
    <>
      <Hero />
      <Products />
      <Services />
      <Clients />
    </>
  );
}

/* ================= ROUTER ================= */
const router = createBrowserRouter(
  [
    // ===== USER ROUTES =====
    {
      path: "/",
      element: (
        <>
          <ScrollToTop />
          <Navbar />
          <Home />
          <Footer />
        </>
      ),
    },
    {
      path: "/about",
      element: (
        <>
          <ScrollToTop />
          <Navbar />
          <About />
          <Footer />
        </>
      ),
    },
    {
      path: "/userlogin",
      element: (
        <>
          <ScrollToTop />
          <Navbar />
          <UserLogin />
          <Footer />
        </>
      ),
    },
    {
      path: "/userregister",
      element: (
        <>
          <ScrollToTop />
          <Navbar />
          <UserRegister />
          <Footer />
        </>
      ),
    },
    {
      path: "/profile",
      element: (
        <>
          <ScrollToTop />
          <Navbar />
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
          <Footer />
        </>
      ),
    },
    {
      path: "/editprofile",
      element: (
        <>
          <ScrollToTop />
          <Navbar />
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
          <Footer />
        </>
      ),
    },

    // ===== ADMIN ROUTES =====
    {
      path: "/adminlogin",
      element: (
        <>
          <ScrollToTop />
          <AdminLogin />
        </>
      ),
    },
    {
      path: "/admin/dashboard",
      element: (
        <>
          <ScrollToTop />
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        </>
      ),
    },
    {
  path: "/auth/callback",
  element: <AuthCallback />,
}
  ],
  {
    future: {
      v7_startTransition: true,
    },
  }
);

/* ================= APP ================= */
export default function App() {
  return <RouterProvider router={router} />;
}