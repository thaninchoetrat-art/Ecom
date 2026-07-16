import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ProductPage from "./page/products/ProductPage";
import { fetchMyProfile } from "./services/meService";
import Navbar from "./components/layout/Navbar";
import TopBar from "./components/layout/TopBar";
import CategoryBanner from "./components/banner/CategoryBanner";
import ShippingTracking from "./page/profile/ShippingTracking";

import Footer from "./components/layout/Footer";
import Login from "./page/Login/login";
import ProfilePage from "./page/profile";
import RequireRole from "./components/auth/RequireRole";

import AdminLayout from "./page/admin/AdminLayout";
import AdminDashboard from "./page/admin/AdminDashboard";
import ProductsManage from "./page/admin/ProductsManage";
import MembersManage from "./page/admin/MembersManage";
import AdminProfile from "./page/admin/Profile";
import BackupManage from "./page/admin/BackupManage"; // 🟢 หน้าสำรองข้อมูล
// 🟢 หน้าคำสั่งซื้อ/คลังสินค้า/จัดส่ง เวอร์ชันของแอดมินเอง (แยกจากของ staff)
// เพื่อไม่ให้แอดมินต้องเข้าไปใน path /staff/* ซึ่งเป็นพื้นที่เฉพาะของพนักงาน
import AdminOrdersManage from "./page/admin/OrdersManage";
import AdminInventoryManage from "./page/admin/InventoryManage";
import AdminShippingManage from "./page/admin/ShippingManage";

import StaffLayout from "./page/staff/StaffLayout";
import StaffOrdersManage from "./page/staff/OrdersManage";
import StaffProductsManage from "./page/staff/ProductsManage";
import StaffInventoryManage from "./page/staff/InventoryManage";
import StaffShippingManage from "./page/staff/ShippingManage";
import StaffProfile from "./page/staff/Profile";

import Cart from "./page/cart";
import Checkout from "./page/checkout";
import OrderSuccess from "./page/checkout/OrderSuccess";
import Brand from "./components/layout/Brand";
import About from "./components/layout/About";

const UserLayout = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      <div className="w-full block">
        <Navbar />
        <TopBar />
      </div>
      <div className="w-full grow block">
        {children}
      </div>
      <div className="w-full mt-auto block">
        <Footer />
      </div>
    </div>
  );
};

function App() {
  // 🟢 เดิม local_user_email ถูกเพิ่มเข้ามาทีหลัง คนที่ล็อกอินค้างไว้ตั้งแต่ก่อนแก้โค้ด
  // จะไม่มีอีเมลนี้ใน localStorage เลย ทำให้ getCheckoutUserId() วนไปใช้ guest id ตัวเดียวกัน
  // ปนกันได้ทุกบัญชีที่ยังไม่เคยล็อกอินใหม่ (เห็นตะกร้า/ประวัติสั่งซื้อของคนอื่นได้)
  // ตรงนี้เลยเช็คซ่อมให้อัตโนมัติ: ถ้า login อยู่แต่ไม่มีอีเมลเก็บไว้ ให้ไปขอจาก backend
  // (ผ่าน token เดิม) มาเติมให้ แล้วรีโหลดหน้าเว็บครั้งเดียวเพื่อให้ตะกร้า/ประวัติแยกถูกต้อง
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("is_logged_in") === "true";
    const hasEmail = !!localStorage.getItem("local_user_email");
    const alreadyTriedHeal = sessionStorage.getItem("email_self_heal_done") === "true";

    if (isLoggedIn && !hasEmail && !alreadyTriedHeal) {
      sessionStorage.setItem("email_self_heal_done", "true");
      fetchMyProfile()
        .then((user) => {
          if (user?.email) {
            localStorage.setItem("local_user_email", user.email);
            window.location.reload();
          }
        })
        .catch(() => {
          // เงียบไว้ก็พอ ถ้าดึงไม่สำเร็จ (เช่น token หมดอายุ) ผู้ใช้แค่ต้องล็อกอินใหม่เอง
        });
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={
          <UserLayout>
            <br />
            <CategoryBanner />
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
              <br />
              <ProductPage />
            </main>
          </UserLayout>
        }
      />

      <Route path="/login" element={<Login />} />

      <Route path="/profile" element={
          <UserLayout>
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <ProfilePage />
            </main>
          </UserLayout>
        }
      />

      {/* 📦 เพิ่ม Route หน้าติดตามการจัดส่งที่นี่ */}
      <Route path="/shipping-tracking" element={
          <UserLayout>
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <ShippingTracking />
            </main>
          </UserLayout>
        }
      />

      <Route path="/cart" element={
          <UserLayout>
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Cart />
            </main>
          </UserLayout>
        }
      />

      <Route path="/checkout" element={
          <UserLayout>
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Checkout />
            </main>
          </UserLayout>
        }
      />

      <Route path="/order-success/:orderId" element={
          <UserLayout>
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <OrderSuccess />
            </main>
          </UserLayout>
        }
      />

      <Route path="/admin" element={
          <RequireRole roles={["Admin"]}>
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductsManage />} />
        <Route path="orders" element={<AdminOrdersManage />} />
        <Route path="inventory" element={<AdminInventoryManage />} />
        <Route path="shipping" element={<AdminShippingManage />} />
        <Route path="members" element={<MembersManage />} />
        <Route path="backup" element={<BackupManage />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* 🔒 พื้นที่เฉพาะพนักงาน (Staff) เท่านั้น แอดมินมีหน้าคำสั่งซื้อ/คลังสินค้า/จัดส่งของตัวเองแล้วที่ /admin/* */}
      <Route path="/staff" element={
          <RequireRole roles={["Staff"]}>
            <StaffLayout />
          </RequireRole>
        }
      >
        <Route index element={<StaffOrdersManage />} />
        <Route path="products" element={<StaffProductsManage />} />
        <Route path="inventory" element={<StaffInventoryManage />} />
        <Route path="shipping" element={<StaffShippingManage />} />
        <Route path="profile" element={<StaffProfile />} />
      </Route>

      <Route path="brand" element={<Brand />} />
      <Route path="about" element={<About />} />
    </Routes>
  );
}

export default App;
