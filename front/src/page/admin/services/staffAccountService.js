// front/src/page/admin/services/staffAccountService.js
// 🟢 ฟังก์ชันเรียก backend สำหรับหน้า MembersManage.jsx (ยิงไป /api/auth/accounts)
// fetchAccounts, createAccount, updateAccount, deleteAccount — จัดการบัญชีทุกสิทธิ์
// (ชื่อไฟล์เหมือนกับที่ StaffAccounts.jsx เคยใช้ แต่ฟังก์ชันในไฟล์นี้คนละชุดกัน)
// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - authHeaders() — บรรทัด 14
// - fetchAccounts() — บรรทัด 22
// - createAccount() — บรรทัด 29
// - updateAccount() — บรรทัด 40
// - deleteAccount() — บรรทัด 51

const BACKEND_URL = "http://localhost:4000/api/auth";

const authHeaders = () => {
  const token = localStorage.getItem("user_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchAccounts = async () => {
  const res = await fetch(`${BACKEND_URL}/accounts`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "โหลดรายชื่อบัญชีไม่สำเร็จ");
  return data.accounts || [];
};

export const createAccount = async ({ name, email, password, role, phone }) => {
  const res = await fetch(`${BACKEND_URL}/accounts`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ name, email, password, role, phone }),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "สร้างบัญชีไม่สำเร็จ");
  return data.user;
};

export const updateAccount = async (email, { name, phone, role, status }) => {
  const res = await fetch(`${BACKEND_URL}/accounts/${encodeURIComponent(email)}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ name, phone, role, status }),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "แก้ไขบัญชีไม่สำเร็จ");
  return data;
};

export const deleteAccount = async (email) => {
  const res = await fetch(`${BACKEND_URL}/accounts/${encodeURIComponent(email)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "ลบบัญชีไม่สำเร็จ");
  return data;
};
