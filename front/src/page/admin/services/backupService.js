// front/src/page/admin/services/backupService.js
// 🟢 ฟังก์ชันเรียก backend สำหรับหน้า BackupManage.jsx ทั้งหมด (ยิงไป /api/admin/backups)
// fetchBackups (ดูรายการไฟล์), runBackupNow (สำรองทันที), downloadBackup, deleteBackup,
// restoreBackup (กู้คืนทั้งไฟล์), previewBackup + restoreSelected (กู้คืนเฉพาะรายการที่เลือก)
// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - authHeaders() — บรรทัด 17
// - fetchBackups() — บรรทัด 25
// - runBackupNow() — บรรทัด 32
// - downloadBackup() — บรรทัด 42
// - deleteBackup() — บรรทัด 62
// - restoreBackup() — บรรทัด 72
// - previewBackup() — บรรทัด 82
// - restoreSelected() — บรรทัด 91

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

export const restoreBackup = async (fileName) => {
  const res = await fetch(`${BACKEND_URL}/${encodeURIComponent(fileName)}/restore`, {
    method: "POST",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "กู้คืนข้อมูลไม่สำเร็จ");
  return data.restore;
};

export const previewBackup = async (fileName) => {
  const res = await fetch(`${BACKEND_URL}/${encodeURIComponent(fileName)}/preview`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "โหลดตัวอย่างข้อมูลไม่สำเร็จ");
  return data.preview;
};

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
