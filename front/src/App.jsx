import { Routes, Route } from "react-router-dom"; 
import ProductPage from "./page/products/ProductPage"; 
import Navbar from "./components/layout/Navbar"; 
import TopBar from "./components/layout/TopBar"; 
import CategoryBanner from "./components/banner/CategoryBanner"; 

import Footer from "./components/layout/Footer";  
import Login from "./page/Login/login";  
import ProfilePage from "./page/profile"; 
import RequireRole from "./components/auth/RequireRole";

import AdminLayout from "./page/admin/AdminLayout";
import AdminDashboard from "./page/admin/AdminDashboard";
import ProductsManage from "./page/admin/ProductsManage";
import MembersManage from "./page/admin/MembersManage";
import AdminProfile from "./page/admin/Profile"; // 🟢 หน้าโปรไฟล์ของ Admin เอง

import StaffLayout from "./page/staff/StaffLayout";
import StaffOrdersManage from "./page/staff/OrdersManage";
import StaffInventoryManage from "./page/staff/InventoryManage";
import StaffShippingManage from "./page/staff/ShippingManage";
import StaffProfile from "./page/staff/Profile"; // 🟢 หน้าโปรไฟล์ของ Staff เอง

import Cart from "./page/cart";
import Checkout from "./page/checkout";
import OrderSuccess from "./page/checkout/OrderSuccess";
import Brand from "./components/layout/Brand"
import About from "./components/layout/About"

// 🟢 1. สร้าง UserLayout เพื่อคุมให้ Navbar และ Footer กาง 100% เสมอ
const UserLayout = ({ children }) => {
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-white">
      {/* Navbar และ TopBar อยู่ด้านบน กางสุดขอบจอ */}
      <div className="w-full block">
        <Navbar />
        <TopBar />
      </div>
      
      {/* เนื้อหาแต่ละหน้าจะมาแทรกตรงกลาง */}
      <div className="w-full grow block">
        {children}
      </div>
      
      {/* Footer อยู่ด้านล่าง กางสุดขอบจอ */}
      <div className="w-full mt-auto block">
        <Footer />
      </div>
    </div>
  );
};

function App() {   
  return (     
    <Routes>         
      {/* 🏠 หน้าแรก */}         
      <Route           
        path="/"           
        element={             
          <UserLayout>               
            <br />
            <CategoryBanner />               
            {/* 🟢 2. เปลี่ยนคลาสตรง main เป็น max-w-7xl mx-auto เพื่อให้สวยงามเต็มจอ */}
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">                 
              <br />
                  
              <ProductPage />               
            </main>               
          </UserLayout>           
        }         
      />         
      
      {/* 🔐 หน้า Login (ไม่ต้องมี Navbar/Footer) */}         
      <Route path="/login" element={<Login />} />         
      
      {/* 👤 หน้า Profile */}         
      <Route           
        path="/profile"           
        element={             
          <UserLayout>               
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">                 
              <ProfilePage />               
            </main>               
          </UserLayout>           
        }         
      />         

      {/* 🛒 หน้า Cart */}         
      <Route           
        path="/cart"           
        element={             
          <UserLayout>               
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">                 
              <Cart />               
            </main>               
          </UserLayout>           
        }         
      />
      
      {/* 🧾 หน้า Checkout (ชำระเงิน) */}
      <Route
        path="/checkout"
        element={
          <UserLayout>
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Checkout />
            </main>
          </UserLayout>
        }
      />

      {/* 🎉 หน้า Order Success */}
      <Route
        path="/order-success/:orderId"
        element={
          <UserLayout>
            <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <OrderSuccess />
            </main>
          </UserLayout>
        }
      />

      {/* ⚙️ หน้า Admin (เฉพาะสิทธิ์ Admin) */}
      <Route
        path="/admin"
        element={
          <RequireRole roles={["Admin"]}>
            <AdminLayout />
          </RequireRole>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<ProductsManage />} />
        <Route path="members" element={<MembersManage />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      {/* 🧑‍💼 หน้า Staff (สิทธิ์ Staff และ Admin เข้าได้) */}
      <Route
        path="/staff"
        element={
          <RequireRole roles={["Staff", "Admin"]}>
            <StaffLayout />
          </RequireRole>
        }
      >
        <Route index element={<StaffOrdersManage />} />
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