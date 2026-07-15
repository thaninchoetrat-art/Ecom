// src/page/admin/services/backupService.js
// จัดการระบบสำรองข้อมูล (Backup) — เฉพาะ Admin เท่านั้นที่เรียกได้
// (ฝั่ง backend มี verifyToken + requireRole('Admin') กันไว้อีกชั้นเสมอ)

const BACKEND_URL = "http://localhost:4000/api/admin/backups";

const authHeaders = () => {
  const token = localStorage.getItem("user_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const fetchBackups = async () => {
  const res = await fetch(BACKEND_URL, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "โหลดรายการสำรองข้อมูลไม่สำเร็จ");
  return data.backups || [];
};

export const runBackupNow = async () => {
  const res = await fetch(`${BACKEND_URL}/run`, {
    method: "POST",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "สำรองข้อมูลไม่สำเร็จ");
  return data.backup;
};

// ดาวน์โหลดไฟล์ backup — ต้องแนบ Authorization header เอง (ทำผ่าน <a> ธรรมดาไม่ได้)
// จึงดึงเป็น blob แล้วสร้างลิงก์ดาวน์โหลดชั่วคราวแทน
export const downloadBackup = async (fileName) => {
  const res = await fetch(`${BACKEND_URL}/${encodeURIComponent(fileName)}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "ดาวน์โหลดไฟล์ไม่สำเร็จ");
  }

  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export const deleteBackup = async (fileName) => {
  const res = await fetch(`${BACKEND_URL}/${encodeURIComponent(fileName)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "ลบไฟล์สำรองข้อมูลไม่สำเร็จ");
  return data;
};

// กู้คืนข้อมูลจากไฟล์ backup ที่เลือก — เขียนทับข้อมูลปัจจุบันทั้งหมดใน back/data/
export const restoreBackup = async (fileName) => {
  const res = await fetch(`${BACKEND_URL}/${encodeURIComponent(fileName)}/restore`, {
    method: "POST",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "กู้คืนข้อมูลไม่สำเร็จ");
  return data.restore;
};

// ดูตัวอย่างเนื้อหาในไฟล์ backup (รายชื่อบัญชี + รายการออเดอร์) เพื่อเลือกกู้คืนเฉพาะรายการ
export const previewBackup = async (fileName) => {
  const res = await fetch(`${BACKEND_URL}/${encodeURIComponent(fileName)}/preview`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "โหลดตัวอย่างข้อมูลไม่สำเร็จ");
  return data.preview;
};

// กู้คืนแบบเลือกรายการ — เฉพาะบัญชีผู้ใช้ (userKeys) และ/หรือออเดอร์ (orderIds) ที่เลือกเท่านั้น
export const restoreSelected = async (fileName, { userKeys = [], orderIds = [] }) => {
  const res = await fetch(`${BACKEND_URL}/${encodeURIComponent(fileName)}/restore-selected`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ userKeys, orderIds }),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "กู้คืนข้อมูลไม่สำเร็จ");
  return data.restore;
};
