import { Routes, Route } from "react-router-dom"; 
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

// 🛒 1. Import หน้าตะกร้าสินค้า (Cart) เข้ามา
import Cart from "./page/cart";
// 🧾 Import หน้าชำระเงิน / สั่งซื้อสินค้า (แยกโฟลเดอร์ของตัวเอง ไม่ยุ่งกับโค้ดส่วนอื่น)
import Checkout from "./page/checkout";
import OrderSuccess from "./page/checkout/OrderSuccess";

function App() {   
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
      <Route path="/login" element={<Login />} />         
      
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

      {/* 🛒 2. เพิ่ม Route สำหรับหน้าตะกร้าสินค้า (Cart) ตรงนี้ */}         
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
      
      {/* 🧾 ระบบสั่งซื้อสินค้า และชำระเงิน */}
      <Route
        path="/checkout"
        element={
          <>
            <Navbar />
            <main className="w-full px-[4%] md:px-[8%] lg:px-[11%] xl:px-[13%] py-8">
              <Checkout />
            </main>
            <Footer />
          </>
        }
      />
      <Route
        path="/order-success/:orderId"
        element={
          <>
            <Navbar />
            <main className="w-full px-[4%] md:px-[8%] lg:px-[11%] xl:px-[13%] py-8">
              <OrderSuccess />
            </main>
            <Footer />
          </>
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