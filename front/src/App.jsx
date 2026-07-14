import React, { useEffect } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom"; 

// Import Components
import * as Components from './page/login/Components'; 
import ProductPage from "./page/products/ProductPage"; 
import Navbar from "./components/layout/Navbar"; 
import TopBar from "./components/layout/TopBar"; 
import CategoryBanner from "./components/banner/CategoryBanner"; 
import SearchBox from "./components/layout/SearchBox"; 
import Footer from "./components/layout/Footer";  
import Login from "./page/Login/login";  
import ProfilePage from "./page/profile"; 
import AdminLayout from "./page/admin/AdminLayout"; 
import AdminDashboard from "./page/admin/AdminDashboard"; 
import ProductsManage from "./page/admin/ProductsManage"; 
import OrdersManage from "./page/admin/OrdersManage"; 
import MembersManage from "./page/admin/MembersManage"; 
import InventoryManage from "./page/admin/InventoryManage"; 
import ShippingManage from "./page/admin/ShippingManage"; 
import Cart from "./page/cart"; 

function App() {   
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("is_logged_in") === "true";
    const userRole = localStorage.getItem("user_role");

    // 1. เช็คถ้ายังไม่ Login ให้ไปหน้า Login
    if (!isLoggedIn && location.pathname !== "/login") {
      navigate("/login");
    } 
    // 2. เช็คสิทธิ์การเข้าถึง Admin
    else if (isLoggedIn && location.pathname.startsWith("/admin") && userRole !== "admin") {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้า Admin");
      navigate("/");
    }
    // 3. 🌟 เช็คสิทธิ์การเข้าถึง Staff
    else if (isLoggedIn && location.pathname === "/staff" && userRole !== "staff") {
      alert("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
      navigate("/");
    }
  }, [navigate, location.pathname]);

  return (    
    <Routes>        
      {/* (Home) */}        
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
            <Footer />            
          </>          
        } 
      />        
      
      {/* (Login) */}        
      <Route 
        path="/login" 
        element={
          <Components.PageWrapper>
            <Login />
          </Components.PageWrapper>
        } 
      />        
      
      {/* (Profile) */}        
      <Route 
        path="/profile" 
        element={          
          <>             
            <Navbar />             
            <main className="w-full px-[4%] md:px-[8%] lg:px-[11%] xl:px-[13%] py-8">                
              <ProfilePage />              
            </main>             
            <Footer />            
          </>          
        } 
      />        

      {/* (Cart) */}        
      <Route 
        path="/cart" 
        element={          
          <>             
            <Navbar />             
            <main className="w-full px-[4%] md:px-[8%] lg:px-[11%] xl:px-[13%] py-8">                
              <Cart />              
            </main>             
            <Footer />            
          </>          
        } 
      />
      
      {/* 🌟 (staff" Dashboard) เพิ่มหน้านี้สำหรับลูกค้า */}
      <Route 
        path="/staff" 
        element={
           // ใส่ Layout ของลูกค้าของคุณที่นี่
           <h1>หน้าสำหรับลูกค้า</h1> 
        } 
      />
      
      {/* (Admin) */}        
      <Route path="/admin" element={<AdminLayout />}>          
        <Route index element={<AdminDashboard />} />          
        <Route path="products" element={<ProductsManage />} />          
        <Route path="orders" element={<OrdersManage />} />          
        <Route path="members" element={<MembersManage />} />          
        <Route path="inventory" element={<InventoryManage />} />          
        <Route path="shipping" element={<ShippingManage />} />        
      </Route>      
    </Routes>   
  ); 
}

export default App;