// src/services/meService.js
// ใช้ร่วมกันได้ทั้ง Staff และ Admin (และ Customer ในอนาคตถ้าต้องการ)
// สำหรับดึงข้อมูลบัญชีของตัวเอง และออกจากระบบ

const BACKEND_URL = "http://localhost:4000/api/auth";

const authHeaders = () => {
  const token = localStorage.getItem("user_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ดึงข้อมูลบัญชีของผู้ใช้ที่ login อยู่ปัจจุบัน (ชื่อ / อีเมล / เบอร์ / สิทธิ์ / สถานะ)
export const fetchMyProfile = async () => {
  const res = await fetch(`${BACKEND_URL}/accounts/me`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "โหลดข้อมูลโปรไฟล์ไม่สำเร็จ");
  return data.user;
};

// ล้างข้อมูล session ฝั่งเครื่องแล้วพากลับไปหน้าล็อกอิน
export const logout = () => {
  localStorage.removeItem("user_token");
  localStorage.removeItem("is_logged_in");
  localStorage.removeItem("local_user_name");
  localStorage.removeItem("local_user_email");
  localStorage.removeItem("user_role");
  window.location.href = "/login";
};
