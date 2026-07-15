import { Routes, Route } from "react-router-dom"; 
import ProductPage from "./page/products/ProductPage"; 
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

import StaffLayout from "./page/staff/StaffLayout";
import StaffOrdersManage from "./page/staff/OrdersManage";
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
        <Route path="members" element={<MembersManage />} />
        <Route path="profile" element={<AdminProfile />} />
      </Route>

      <Route path="/staff" element={
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