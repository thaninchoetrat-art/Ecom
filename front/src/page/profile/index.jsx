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
  
  // ตรวจสอบสถานะว่าได้ล็อกอินหรือยัง
  const isLoggedIn = localStorage.getItem("is_logged_in") === "true";

  // 1. ✨ ประกาศ State สำหรับสลับแท็บเมนู
  const [activeTab, setActiveTab] = useState("profile");

  // State สำหรับข้อมูลส่วนตัว
  const [profileData, setProfileData] = useState(() => {
    try {
      const savedData = localStorage.getItem("user_profile_data");
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (e) {
      console.error("Error parsing profile data:", e);
    }

    return {
      username: "", 
      fullName: "",
      email: localStorage.getItem("local_user_email") || "",
      phone: "",
      gender: "male",
      birthDay: "",
      birthMonth: "",
      birthYear: ""
    };
  });

  // State สำหรับข้อมูลที่อยู่
  const [addressData, setAddressData] = useState(() => {
    try {
      const savedAddress = localStorage.getItem("user_profile_address");
      if (savedAddress) return JSON.parse(savedAddress);
    } catch (e) {
      console.error("Error parsing address data:", e);
    }
    return {
      receiverName: "",
      phone: "",
      detail: "",
      province: "",
      district: "",
      postalCode: ""
    };
  });

  // 💡 [ปรับปรุง] เพิ่มคีย์ image รอรับค่าไฟล์รูปภาพสินค้าไว้ใน State เพื่อความชัวร์
  const [newProduct, setNewProduct] = useState({
    title: "",
    brand: "",
    price: "",
    salePrice: "",
    stock: "",
    category: "Cosmetic Collection",
    description: "",
    image: "" 
  });

  // 🖼️ รูปโปรไฟล์สำรอง (Avatar)
  const [avatar, setAvatar] = useState(() => {
    const savedAvatar = localStorage.getItem("user_profile_avatar");
    if (savedAvatar) return savedAvatar;
    
    const currentName = profileData?.username || "user";
    return `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentName)}`;
  });

  // เช็คระบบความปลอดภัย: ถ้าไม่มีสถานะล็อกอิน ให้เด้งไปหน้า Login
  useEffect(() => {
    if (!isLoggedIn) {
      alert("กรุณาเข้าสู่ระบบก่อนใช้งานหน้าโปรไฟล์");
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  // คอยอัปเดตรูปอวาตาร์อัตโนมัติเมื่อผู้ใช้เปลี่ยนชื่อในช่อง username
  useEffect(() => {
    const savedAvatar = localStorage.getItem("user_profile_avatar");
    if (!savedAvatar) {
      const currentName = profileData?.username || "user";
      setAvatar(`https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentName)}`);
    }
  }, [profileData?.username]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleAddressChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  // 💡 [แก้ไขสำเร็จ] ปรับปรุงให้รองรับทั้ง Object จำลองรูปภาพ { name, value } และ Event การพิมพ์ปกติ
  const handleProductChange = (e) => {
    if (e && e.target) {
      // สำหรับช่องกรอกข้อมูลตัวหนังสือทั่วไป
      const { name, value } = e.target;
      setNewProduct((prev) => ({
        ...prev,
        [name]: value
      }));
    } else if (e && e.name) {
      // สำหรับรูปภาพ Base64 ที่ส่งแบบ Object ตรงๆ มาจากคอมโพเนนต์ลูก
      setNewProduct((prev) => ({
        ...prev,
        [e.name]: e.value
      }));
    }
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
    
    if (profileData?.username) {
      localStorage.setItem("local_user_name", profileData.username);
    }
    alert("🎉 บันทึกข้อมูลส่วนตัวเรียบร้อยแล้ว!");
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("user_profile_address", JSON.stringify(addressData));
    alert("📌 บันทึกที่อยู่จัดส่งสินค้าเรียบร้อยแล้ว!");
  };

  // 💡 ระบบบันทึกสินค้าดึงข้อมูลภาพจากสเตทตรงๆ อย่างมีประสิทธิภาพ
  const handleProductSubmit = (e) => {
    e.preventDefault();

<<<<<<< Updated upstream
    if (!newProduct.title.trim()) {
      alert("กรุณากรอกชื่อสินค้า");
      return;
    }
=======
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
>>>>>>> Stashed changes

    try {
      // ดึงรูปภาพจากค่าดั้งเดิมในสเตท ถ้าไม่มีให้ใช้ placeholder
      const finalImageSrc = newProduct.image || "https://via.placeholder.com/240";

      const productWithId = {
        id: "prod_" + Date.now(),
        productId: "prod_" + Date.now(), 
        name: newProduct.title,
        productName: newProduct.title,
        title: newProduct.title,
        brand: newProduct.brand || "General Brand",
        price: Number(newProduct.price) || 0,
        discountPrice: newProduct.salePrice ? Number(newProduct.salePrice) : null,
        salePrice: newProduct.salePrice ? Number(newProduct.salePrice) : null,
        stock: Number(newProduct.stock) || 0,
        image: finalImageSrc,
        images: [finalImageSrc],
        imageUrl: finalImageSrc,
        categoryId: newProduct.category,
        category: newProduct.category,
        description: newProduct.description || "",
        createdAt: new Date().toISOString()
      };

      // ทำการส่งบันทึกไปยังเซิร์ฟเวอร์หรือ LocalStorage ผ่าน service
      addProduct(productWithId);
      alert(`🎉 เพิ่มสินค้า "${newProduct.title}" เข้าหน้าร้านเรียบร้อยแล้ว!`);

      // เคลียร์ค่าในฟอร์มหลังจากกดส่งเรียบร้อย
      setNewProduct({
        title: "", 
        brand: "",
        price: "", 
        salePrice: "",
        stock: "",
        category: "Cosmetic Collection", 
        description: "",
        image: "" 
      });

      // จัดการรีเซ็ตปุ่มเลือกไฟล์ใน HTML
      const fileInputs = document.querySelectorAll('input[type="file"]');
      fileInputs.forEach(input => {
        input.value = "";
      });

    } catch (err) {
      console.error(err);
      alert("❌ ไม่สามารถบันทึกสินค้าได้ หรือขนาดไฟล์ภาพใหญ่เกินความจุของระบบ");
    }
  };

  const renderContent = () => {
    const safeProfileData = profileData || { username: "", fullName: "", email: "" };

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
                profileData={safeProfileData} 
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

  // เช็คเรื่องล็อกอินก่อนการส่งออก JSX เสมอ
  if (!isLoggedIn) return null;

  return (
    <S.ProfileWrapper>
      <ProfileSidebar 
        username={profileData?.username || "ผู้ใช้งาน"} 
        avatar={avatar} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      <S.MainContent>{renderContent()}</S.MainContent>
    </S.ProfileWrapper>
  );
};

export default ProfilePage;