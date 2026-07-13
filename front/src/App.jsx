import { Routes, Route } from "react-router-dom";

import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import TopBar from "./components/layout/TopBar";
import SearchBox from "./components/layout/SearchBox";
import CategoryBanner from "./components/banner/CategoryBanner";

import ProductPage from "./page/products/ProductPage";
import Login from "./page/products/Login/Login";

import AdminLayout from "./page/admin/AdminLayout";
import AdminDashboard from "./page/admin/AdminDashboard";
import ProductsManage from "./page/admin/ProductsManage";
import MembersManage from "./page/admin/MembersManage";
import OrdersManage from "./page/admin/OrdersManage";
import InventoryManage from "./page/admin/InventoryManage";
import ShippingManage from "./page/admin/ShippingManage";

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

        {/* ส่วน Admin: จัดการสินค้า / สมาชิก / คำสั่งซื้อ / คลังสินค้า / การจัดส่ง / แดชบอร์ด */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductsManage />} />
          <Route path="members" element={<MembersManage />} />
          <Route path="orders" element={<OrdersManage />} />
          <Route path="inventory" element={<InventoryManage />} />
          <Route path="shipping" element={<ShippingManage />} />
        </Route>
      </Routes>
    </div>
  );
}