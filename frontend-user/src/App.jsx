import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

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
import ProtectedRoute from "./routes/ProtectedRoute";

function Home() {
  return (
    <>
      <Hero />
      <Products />
      <Services />
      <Clients />
    </>
  );
}

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
    path: "/userregister", // 
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
]);



export default function App() {
  return <RouterProvider router={router} />;
}
