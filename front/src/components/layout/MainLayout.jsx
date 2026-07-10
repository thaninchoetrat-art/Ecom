import { Outlet } from "react-router-dom";


import Navbar from "./Navbar";
import Footer from "./Footer";
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white">

      <Navbar />

      <main className="min-h-[70vh]">

        <Outlet />

      </main>

      <Footer />

    </div>
  );
};

export default MainLayout;