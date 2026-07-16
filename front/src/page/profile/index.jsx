import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct, PRODUCT_SOURCE } from "../products/productService";
import { getOrdersByUser, getCheckoutUserId } from "../checkout/checkoutService";
import ShippingTracking from "./ShippingTracking"; // เพิ่มการ import
import ProfileSidebar from "./profileSidebar";
import ProfileForm from "./profileForm";
import ProfileAddress from "./profileAddress";
import ProfileProducts from "./profileProducts";
import ProfileUpload from "./profileUpload";
import * as S from "./profileStyles";

// 🟢 เดิม user_profile_data / user_profile_address / user_profile_avatar เป็นคีย์กลาง
// ใช้ร่วมกันทุกบัญชีบนเบราว์เซอร์เครื่องเดียวกัน (เหมือนปัญหาตะกร้า/ประวัติสั่งซื้อที่แก้ไปก่อนหน้า)
// ทำให้ข้อมูลส่วนตัว/ที่อยู่/รูปโปรไฟล์ของบัญชีหนึ่งไปโผล่ในอีกบัญชีได้ ตอนนี้แยกคีย์ตามอีเมลบัญชีที่ login อยู่
function getProfileStorageKey(base) {
  const email = localStorage.getItem("local_user_email");
  return email ? `${base}_${email}` : `${base}_guest`;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("is_logged_in") === "true";

  const [activeTab, setActiveTab] = useState("profile");

  // State สำหรับข้อมูลต่างๆ (คงเดิม)
  const [profileData, setProfileData] = useState(() => {
    try {
      const savedData = localStorage.getItem(getProfileStorageKey("user_profile_data"));
      return savedData ? JSON.parse(savedData) : { username: "", fullName: "", email: localStorage.getItem("local_user_email") || "", phone: "", gender: "male", birthDay: "", birthMonth: "", birthYear: "" };
    } catch (e) { return { username: "", fullName: "", email: "", phone: "", gender: "male" }; }
  });

  const [addressData, setAddressData] = useState(() => {
    try {
      const savedAddress = localStorage.getItem(getProfileStorageKey("user_profile_address"));
      return savedAddress ? JSON.parse(savedAddress) : { receiverName: "", phone: "", detail: "", province: "", district: "", postalCode: "" };
    } catch (e) { return {}; }
  });

  const [newProduct, setNewProduct] = useState({
    title: "", brand: "", price: "", salePrice: "", stock: "", category: "Cosmetic Collection", description: "", image: ""
  });

  const [avatar, setAvatar] = useState(() => {
    const savedAvatar = localStorage.getItem(getProfileStorageKey("user_profile_avatar"));
    return savedAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profileData?.username || "user")}`;
  });

  // 🟢 เดิมแท็บ "การซื้อของฉัน" อ่านจาก localStorage คีย์กลาง "myOrders" ซึ่งใช้ร่วมกันทุกบัญชี
  // บนเบราว์เซอร์เครื่องเดียวกัน (เหมือนปัญหาตะกร้าที่แก้ไปก่อนหน้า) ทำให้เห็นออเดอร์ของคนอื่นปนด้วย
  // ตอนนี้เปลี่ยนมาดึงจาก backend เฉพาะออเดอร์ของ user คนที่ login อยู่เท่านั้น
  const [myOrders, setMyOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Effect สำหรับความปลอดภัยและอัปเดต Avatar
  useEffect(() => {
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อนใช้งานหน้าโปรไฟล์");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // โหลดคำสั่งซื้อของบัญชีตัวเองตอนเปิดแท็บ "การซื้อของฉัน"
  useEffect(() => {
    if (activeTab !== "orders") return;
    let cancelled = false;
    setOrdersLoading(true);
    getOrdersByUser(getCheckoutUserId())
      .then(({ orders }) => {
        if (!cancelled) setMyOrders(orders || []);
      })
      .catch((err) => {
        console.error("โหลดประวัติการสั่งซื้อไม่สำเร็จ", err);
        if (!cancelled) setMyOrders([]);
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });
    return () => { cancelled = true; };
  }, [activeTab]);

  // ฟังก์ชัน Handler ต่างๆ (ใช้ของเดิมที่ปรับปรุงแล้ว)
  const handleChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
  const handleAddressChange = (e) => setAddressData({ ...addressData, [e.target.name]: e.target.value });

  const handleProductChange = (e) => {
    if (e && e.target) setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    else if (e && e.name) setNewProduct({ ...newProduct, [e.name]: e.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem(getProfileStorageKey("user_profile_avatar"), reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Submit Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(getProfileStorageKey("user_profile_data"), JSON.stringify(profileData));
    alert("🎉 บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!");
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(getProfileStorageKey("user_profile_address"), JSON.stringify(addressData));
    alert("📌 บันทึกที่อยู่จัดส่งสินค้าเรียบร้อยแล้ว!");
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.title.trim()) return alert("กรุณากรอกชื่อสินค้า");

    // 🟢 กันราคา/ราคาลด/จำนวนสต็อกติดลบ ก่อนบันทึกสินค้าลงหน้าร้าน
    if (Number(newProduct.price) < 0) return alert("ราคาปกติต้องไม่ติดลบ");
    if (newProduct.salePrice !== "" && Number(newProduct.salePrice) < 0) return alert("ราคาลดพิเศษต้องไม่ติดลบ");
    if (Number(newProduct.stock) < 0) return alert("จำนวนในสต็อกต้องไม่ติดลบ");

    const finalImageSrc = newProduct.image || "https://via.placeholder.com/240";
    const productWithId = {
      ...newProduct,
      id: "prod_" + Date.now(),
      // 🟢 เติม productName/categoryId ให้ตรงกับที่หน้าแอดมิน/หน้าร้านใช้อ่านค่า
      // (เดิมมีแค่ title เฉยๆ ทำให้ตารางแอดมินและหน้าร้านแสดงชื่อสินค้าว่างเปล่า)
      productName: newProduct.title,
      categoryId: "2",
      price: Number(newProduct.price) || 0,
      image: finalImageSrc,
      createdAt: new Date().toISOString(),
      // 🟢 สินค้าที่ลูกค้าโพสต์เองจากหน้าโปรไฟล์ ให้ติดแท็กว่ามาจาก Customer
      // (แยกจากสินค้าที่ Staff/Admin เพิ่มผ่านหน้าแอดมิน ซึ่ง default เป็น COMPANY)
      source: PRODUCT_SOURCE.CUSTOMER,
      // 🟢 เก็บว่าใครเป็นคนโพสต์ขายสินค้านี้ไว้ด้วย เพื่อให้หน้าจัดการคำสั่งซื้อของแอดมิน
      // แสดงได้ว่าถ้ามีคนซื้อสินค้าชิ้นนี้ไป ซื้อจากสมาชิกคนไหน (ที่มาโพสต์ขาย)
      sellerEmail: localStorage.getItem("local_user_email") || "",
      sellerName: localStorage.getItem("local_user_name") || "",
    };

    addProduct(productWithId);
    alert(`🎉 เพิ่มสินค้า "${newProduct.title}" เข้าหน้าร้านเรียบร้อยแล้ว!`);
    setNewProduct({ title: "", brand: "", price: "", salePrice: "", stock: "", category: "Cosmetic Collection", description: "", image: "" });
  };

  // Render Content รวมเคสของเวอร์ชัน 2
  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <><S.HeaderSection><S.PageTitle>ข้อมูลของฉัน</S.PageTitle></S.HeaderSection><S.FormContainer><ProfileForm profileData={profileData} handleChange={handleChange} handleSubmit={handleSubmit} /><ProfileUpload avatar={avatar} handleImageChange={handleImageChange} /></S.FormContainer></>;
      case "address":
        return <><S.HeaderSection><S.PageTitle>ที่อยู่ของฉัน</S.PageTitle></S.HeaderSection><S.FormContainer><ProfileAddress addressData={addressData} handleAddressChange={handleAddressChange} handleAddressSubmit={handleAddressSubmit} /></S.FormContainer></>;
      case "manage_products":
        return <ProfileProducts newProduct={newProduct} handleProductChange={handleProductChange} handleProductSubmit={handleProductSubmit} />;
      case "orders":
        return (
          <>
            <S.HeaderSection><S.PageTitle>การซื้อของฉัน</S.PageTitle></S.HeaderSection>
            <div className="mt-6">
              {ordersLoading ? (
                <p>กำลังโหลดข้อมูล...</p>
              ) : myOrders.length === 0 ? (
                <p>📦 ประวัติการสั่งซื้อของคุณยังว่างเปล่า</p>
              ) : (
                myOrders.map((o) => (
                  <div key={o.orderId} className="p-4 border rounded mb-2">หมายเลขคำสั่งซื้อ: {o.orderId?.split("-").pop()} |
ยอด: ฿{o.grandTotal?.toLocaleString() || 0}</div>
                ))
              )}
            </div>
          </>
        );
      case "shipping":
        return <ShippingTracking />;
      default:
        return null;
    }
  };

  if (!isLoggedIn) return null;

  return (
    <S.ProfileWrapper>
      <ProfileSidebar username={profileData?.username || "ผู้ใช้งาน"} avatar={avatar} activeTab={activeTab} setActiveTab={setActiveTab} />
      <S.MainContent>{renderContent()}</S.MainContent>
    </S.ProfileWrapper>
  );
};

export default ProfilePage;
