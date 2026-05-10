import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
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
import ProtectedRoute from "./routes/ProtectedRoute";

/* ===== HOME WITH SCROLL SUPPORT ===== */
function Home() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const el = document.getElementById(location.state.scrollTo);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <>
      <Hero />
      <Products />
      <Services />
      <Clients />
    </>
  );
}

/* ===== ROUTER ===== */
const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
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
        <Navbar />
        <ProtectedRoute>
          <EditProfile />
        </ProtectedRoute>
        <Footer />
      </>
    ),
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}