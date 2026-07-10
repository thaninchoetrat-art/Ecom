import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import TopBar from "./components/layout/TopBar";
import SearchBox from "./components/layout/SearchBox";
import CategoryBanner from "./components/banner/CategoryBanner";

import ProductPage from "./page/products/ProductPage";
import Dashboard from "./page/products/Dashboard/Dashboard";
import Login from "./page/products/Login/Login";

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col w-full overflow-x-hidden">
      <Routes>
        {/* หน้าแรก */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <TopBar />
              <br />

              <CategoryBanner />

              <main className="w-full px-[4%] md:px-[8%] lg:px-[11%] xl:px-[13%] py-8 flex flex-col gap-6">
                <br />
                <SearchBox />
                <ProductPage />
              </main>

              <br />
              <br />
              <br />

              <Footer />
            </>
          }
        />

        {/* หน้า Login */}
        <Route path="/login" element={<Login />} />

        {/* หน้า Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}