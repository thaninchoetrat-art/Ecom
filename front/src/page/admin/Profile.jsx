// src/page/admin/Profile.jsx
// 🟢 หน้าโปรไฟล์ของผู้ดูแลระบบ (Admin) เอง — เดิมกดที่มุมขวาบน (Topbar) แล้วไม่มีอะไรเกิดขึ้น
// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - AdminProfile() — บรรทัด 16
// - handleLogout() — บรรทัด 34

import { useEffect, useState } from "react";
import { FiMail, FiPhone, FiShield, FiCalendar, FiLogOut, FiUser } from "react-icons/fi";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { fetchMyProfile, logout } from "../../services/meService";
import StatusBadge from "./components/StatusBadge";

const ROLE_LABEL = { Staff: "พนักงาน", Admin: "ผู้ดูแลระบบ", Customer: "ลูกค้า" };

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchMyProfile();
        setProfile(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    const result = await Swal.fire({
      icon: "question",
      title: "ออกจากระบบ?",
      text: "คุณต้องการออกจากระบบใช่หรือไม่",
      showCancelButton: true,
      confirmButtonText: "ออกจากระบบ",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
    });
    if (result.isConfirmed) logout();
  };

  const displayName = profile?.name || localStorage.getItem("local_user_name") || "ผู้ดูแลระบบ";
  const initial = displayName.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className="flex w-full flex-col gap-6 !p-6 md:!p-8 !mx-auto !max-w-3xl">
      <div className="rounded-2xl border border-gray-100 bg-white !p-6 shadow-sm sm:!p-8">
        <div className="flex flex-col items-center gap-4 border-b border-gray-100 !pb-6 text-center sm:flex-row sm:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-pink-100 text-2xl font-bold text-pink-600">
            {initial}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{displayName}</h1>
            <div className="mt-1.5 flex justify-center sm:justify-start">
              <StatusBadge
                label={ROLE_LABEL[profile?.role] || profile?.role || "ผู้ดูแลระบบ"}
                color="purple"
              />
            </div>
          </div>
        </div>

        {loading && <p className="!py-8 text-center text-sm text-gray-400">กำลังโหลดข้อมูล...</p>}

        {!loading && error && (
          <p className="!py-8 text-center text-sm text-red-500">{error}</p>
        )}

        {!loading && !error && profile && (
          <div className="!mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 !p-4">
              <FiUser className="shrink-0 text-gray-400" size={18} />
              <div>
                <p className="text-xs text-gray-400">ชื่อ</p>
                <p className="text-sm font-medium text-gray-800">{profile.name || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 !p-4">
              <FiMail className="shrink-0 text-gray-400" size={18} />
              <div>
                <p className="text-xs text-gray-400">อีเมล</p>
                <p className="text-sm font-medium text-gray-800">{profile.email || "-"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 !p-4">
              <FiPhone className="shrink-0 text-gray-400" size={18} />
              <div>
                <p className="text-xs text-gray-400">เบอร์โทร</p>
                <p className="text-sm font-medium text-gray-800">{profile.phone || "ยังไม่ระบุ"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-gray-50 !p-4">
              <FiShield className="shrink-0 text-gray-400" size={18} />
              <div>
                <p className="text-xs text-gray-400">สิทธิ์การใช้งาน</p>
                <p className="text-sm font-medium text-gray-800">{ROLE_LABEL[profile.role] || profile.role}</p>
              </div>
            </div>
            {profile.createdAt && (
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 !p-4 sm:col-span-2">
                <FiCalendar className="shrink-0 text-gray-400" size={18} />
                <div>
                  <p className="text-xs text-gray-400">สมาชิกตั้งแต่</p>
                  <p className="text-sm font-medium text-gray-800">{dayjs(profile.createdAt).format("D MMMM YYYY")}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleLogout}
          className="!mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 !py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500 hover:text-white"
        >
          <FiLogOut size={16} /> ออกจากระบบ
        </button>
      </div>
    </div>
  );
};

export default AdminProfile;
