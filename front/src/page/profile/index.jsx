import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { addProduct } from "../products/productService";
import ShippingTracking from "./ShippingTracking"; // เพิ่มการ import
import ProfileSidebar from "./profileSidebar";
import ProfileForm from "./profileForm";
import ProfileAddress from "./profileAddress";
import ProfileProducts from "./profileProducts";
import ProfileUpload from "./profileUpload";
import * as S from "./profileStyles";

const ProfilePage = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("is_logged_in") === "true";

  const [activeTab, setActiveTab] = useState("profile");

  // State สำหรับข้อมูลต่างๆ (คงเดิม)
  const [profileData, setProfileData] = useState(() => {
    try {
      const savedData = localStorage.getItem("user_profile_data");
      return savedData ? JSON.parse(savedData) : { username: "", fullName: "", email: localStorage.getItem("local_user_email") || "", phone: "", gender: "male", birthDay: "", birthMonth: "", birthYear: "" };
    } catch (e) { return { username: "", fullName: "", email: "", phone: "", gender: "male" }; }
  });

  const [addressData, setAddressData] = useState(() => {
    try {
      const savedAddress = localStorage.getItem("user_profile_address");
      return savedAddress ? JSON.parse(savedAddress) : { receiverName: "", phone: "", detail: "", province: "", district: "", postalCode: "" };
    } catch (e) { return {}; }
  });

  const [newProduct, setNewProduct] = useState({
    title: "", brand: "", price: "", salePrice: "", stock: "", category: "Cosmetic Collection", description: "", image: "" 
  });

  const [avatar, setAvatar] = useState(() => {
    const savedAvatar = localStorage.getItem("user_profile_avatar");
    return savedAvatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(profileData?.username || "user")}`;
  });

  // Effect สำหรับความปลอดภัยและอัปเดต Avatar
  useEffect(() => {
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อนใช้งานหน้าโปรไฟล์");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

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
        localStorage.setItem("user_profile_avatar", reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Submit Handlers
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user_profile_data", JSON.stringify(profileData));
    alert("🎉 บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!");
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user_profile_address", JSON.stringify(addressData));
    alert("📌 บันทึกที่อยู่จัดส่งสินค้าเรียบร้อยแล้ว!");
  };

  const handleProductSubmit = (e) => {
    e.preventDefault();
    if (!newProduct.title.trim()) return alert("กรุณากรอกชื่อสินค้า");
    
    const finalImageSrc = newProduct.image || "https://via.placeholder.com/240";
    const productWithId = {
      ...newProduct,
      id: "prod_" + Date.now(),
      price: Number(newProduct.price) || 0,
      image: finalImageSrc,
      createdAt: new Date().toISOString()
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
        const savedOrders = JSON.parse(localStorage.getItem("myOrders") || "[]");
        return (
          <>
            <S.HeaderSection><S.PageTitle>การซื้อของฉัน</S.PageTitle></S.HeaderSection>
            <div className="mt-6">
              {savedOrders.length === 0 ? <p>📦 ประวัติการสั่งซื้อของคุณยังว่างเปล่า</p> : savedOrders.map((o, i) => (
                <div key={i} className="p-4 border rounded mb-2">หมายเลขคำสั่งซื้อ: {o.orderId?.split("-").pop()} | 
ยอด: ฿{o.grandTotal?.toLocaleString() || 0}</div>
              ))}
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