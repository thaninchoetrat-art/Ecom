import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { addProduct } from "../products/productService";
import ProfileSidebar from "./profileSidebar";
import ProfileForm from "./profileForm";
import ProfileAddress from "./profileAddress";
import ProfileProducts from "./profileProducts";
import ProfileUpload from "./profileUpload";
import * as S from "./profileStyles";

const ProfilePage = () => {
  const navigate = useNavigate();
  const currentUserName = localStorage.getItem("local_user_name") || "nawamin";
  
  // State สำหรับควบคุมการเปลี่ยนหน้าเมนูภายใน
  const [activeTab, setActiveTab] = useState("profile");
  
  // ตรวจสอบสถานะว่าได้ล็อกอินหรือยัง
  const isLoggedIn = localStorage.getItem("is_logged_in") === "true";

  // เช็คระบบความปลอดภัย: ถ้าไม่มีสถานะล็อกอิน ให้เด้งไปหน้า Login ทันที
  useEffect(() => {
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อนใช้งานหน้าโปรไฟล์");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // State สำหรับข้อมูลส่วนตัว
  const [profileData, setProfileData] = useState(() => {
    const savedData = localStorage.getItem("user_profile_data");
    const defaultEmail = localStorage.getItem("local_user_email") || "";

    return savedData ? JSON.parse(savedData) : {
      username: currentUserName,
      fullName: "",
      email: defaultEmail,
      phone: "",
      gender: "male",
      birthDay: "",
      birthMonth: "",
      birthYear: ""
    };
  });

  // State สำหรับข้อมูลที่อยู่
  const [addressData, setAddressData] = useState(() => {
    const savedAddress = localStorage.getItem("user_profile_address");
    return savedAddress ? JSON.parse(savedAddress) : {
      receiverName: "",
      phone: "",
      detail: "",
      province: "",
      district: "",
      postalCode: ""
    };
  });

  const [newProduct, setNewProduct] = useState({
    title: "",
    brand: "",
    price: "",
    salePrice: "",
    stock: "",
    category: "Cosmetic Collection",
    description: ""
  });

  const [avatar, setAvatar] = useState(() => {
    return localStorage.getItem("user_profile_avatar") || "https://api.dicebear.com/7.x/bottts/svg?seed=nawamin";
  });

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleProductChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
        localStorage.setItem("user_profile_avatar", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const imageInput = fileInputs[fileInputs.length - 1] || document.querySelector('input[type="file"]');

    const processSave = (imageSrc) => {
      try {
        const productWithId = {
          ...newProduct,
          id: "prod_" + Date.now(),
          productId: "prod_" + Date.now(), 
          name: newProduct.title,
          productName: newProduct.title,
          title: newProduct.title,
          brand: newProduct.brand || "General Brand",
          price: Number(newProduct.price),
          discountPrice: newProduct.salePrice ? Number(newProduct.salePrice) : null,
          salePrice: newProduct.salePrice ? Number(newProduct.salePrice) : null,
          stock: Number(newProduct.stock) || 0,
          image: imageSrc || "https://via.placeholder.com/240",
          images: imageSrc ? [imageSrc] : ["https://via.placeholder.com/240"],
          imageUrl: imageSrc || "https://via.placeholder.com/240",
          categoryId: newProduct.category,
          category: newProduct.category,
          description: newProduct.description,
          createdAt: new Date().toISOString()
        };

        // ✅ เรียกใช้ addProduct เพื่อให้ข้อมูลไปรวมกับที่เดียวกับที่หน้าร้านเรียกใช้งาน
        addProduct(productWithId);
        
        alert(`🎉 เพิ่มสินค้า "${newProduct.title}" เข้าหน้าร้านเรียบร้อยแล้ว!`);

        setNewProduct({
          title: "", 
          brand: "",
          price: "", 
          salePrice: "",
          stock: "",
          category: "Cosmetic Collection", 
          description: ""
        });
        if (imageInput) imageInput.value = "";
      } catch (err) {
        alert("❌ ความจำเต็ม: ขนาดรูปภาพใหญ่เกินไป ลองเปลี่ยนใช้ไฟล์รูปขนาดเล็กดูนะครับ");
      }
    };

    if (imageInput && imageInput.files && imageInput.files[0]) {
      const file = imageInput.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 400; 
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.6);
          processSave(compressedBase64);
        };
      };
      reader.readAsDataURL(file);
    } else {
      processSave("");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <>
            <S.HeaderSection>
              <S.PageTitle>ข้อมูลของฉัน</S.PageTitle>
              <S.PageSubTitle>จัดการข้อมูลส่วนตัวคุณเพื่อความปลอดภัยของบัญชีผู้ใช้นี้</S.PageSubTitle>
            </S.HeaderSection>
            <S.FormContainer>
              <ProfileForm 
                profileData={profileData} 
                handleChange={handleChange} 
                handleSubmit={handleSubmit} 
              />
              <ProfileUpload 
                avatar={avatar} 
                handleImageChange={handleImageChange} 
              />
            </S.FormContainer>
          </>
        );
      case "address":
        return (
          <>
            <S.HeaderSection>
              <S.PageTitle>ที่อยู่ของฉัน</S.PageTitle>
              <S.PageSubTitle>จัดการและเพิ่มที่อยู่สำหรับการจัดส่งสินค้าของคุณ</S.PageSubTitle>
            </S.HeaderSection>
            <S.FormContainer>
              <S.InputsBlock onSubmit={handleAddressSubmit}>
                <S.FormGroup>
                  <S.Label>ชื่อ-นามสกุล ผู้รับ</S.Label>
                  <S.InputField 
                    type="text" 
                    name="receiverName" 
                    value={addressData.receiverName} 
                    onChange={handleAddressChange} 
                    placeholder="กรอกชื่อและนามสกุลผู้รับสินค้า"
                    required
                  />
                </S.FormGroup>
                <S.FormGroup>
                  <S.Label>เบอร์โทรศัพท์</S.Label>
                  <S.InputField 
                    type="text" 
                    name="phone" 
                    value={addressData.phone} 
                    onChange={handleAddressChange} 
                    placeholder="กรอกเบอร์โทรศัพท์ที่ติดต่อได้"
                    required
                  />
                </S.FormGroup>
                <S.FormGroup>
                  <S.Label>รายละเอียดที่อยู่ (บ้านเลขที่, ซอย, ถนน)</S.Label>
                  <S.InputField 
                    type="text" 
                    name="detail" 
                    value={addressData.detail} 
                    onChange={handleAddressChange} 
                    placeholder="เช่น 99/1 หมู่ 5 ซอยสยาม ถนนสุขุมวิท"
                    required
                  />
                </S.FormGroup>
                <S.FormGroup>
                  <S.Label>จังหวัด</S.Label>
                  <S.InputField 
                    type="text" 
                    name="province" 
                    value={addressData.province} 
                    onChange={handleAddressChange} 
                    placeholder="กรอกจังหวัด"
                    required
                  />
                </S.FormGroup>
                <S.FormGroup>
                  <S.Label>เขต / อำเภอ</S.Label>
                  <S.InputField 
                    type="text" 
                    name="district" 
                    value={addressData.district} 
                    onChange={handleAddressChange} 
                    placeholder="กรอกเขต หรือ อำเภอ"
                    required
                  />
                </S.FormGroup>
                <S.FormGroup>
                  <S.Label>รหัสไปรษณีย์</S.Label>
                  <S.InputField 
                    type="text" 
                    name="postalCode" 
                    value={addressData.postalCode} 
                    onChange={handleAddressChange} 
                    placeholder="กรอกรหัสไปรษณีย์ 5 หลัก"
                    maxLength="5"
                    required
                  />
                </S.FormGroup>
                <S.SaveButton type="submit">บันทึกที่อยู่จัดส่ง</S.SaveButton>
              </S.InputsBlock>
            </S.FormContainer>
          </>
        );
      case "manage_products":
        return (
          <ProfileProducts 
            newProduct={newProduct}
            handleProductChange={handleProductChange}
            handleProductSubmit={handleProductSubmit}
          />
        );
      case "orders":
        return (
          <>
            <S.HeaderSection>
              <S.PageTitle>การซื้อของฉัน</S.PageTitle>
              <S.PageSubTitle>ตรวจสอบประวัติการสั่งซื้อสินค้าทั้งหมดของคุณ</S.PageSubTitle>
            </S.HeaderSection>
            <div style={{ color: "#333", padding: "20px", background: "#f9f9f9", border: "1px solid #eee", borderRadius: "8px", marginTop: "20px" }}>
              📦 ประวัติการสั่งซื้อของคุณยังว่างเปล่า
            </div>
          </>
        );
      case "shipping":
        return (
          <>
            <S.HeaderSection>
              <S.PageTitle>ดูการจัดส่งสินค้า</S.PageTitle>
              <S.PageSubTitle>ติดตามสถานะพัสดุและรถขนส่งสินค้า</S.PageSubTitle>
            </S.HeaderSection>
            <div style={{ color: "#333", padding: "20px", background: "#f9f9f9", border: "1px solid #eee", borderRadius: "8px", marginTop: "20px" }}>
              🚚 ยังไม่มีสินค้าที่กำลังจัดส่งในขณะนี้
            </div>
          </>
        );
      default:
        return null;
    }
  };

  if (!isLoggedIn) return null;

  return (
    <S.ProfileWrapper>
      <ProfileSidebar 
        username={profileData.username} 
        avatar={avatar} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      <S.MainContent>{renderContent()}</S.MainContent>
    </S.ProfileWrapper>
  );
};

export default ProfilePage;