// front/src/page/admin/AdminLayout.jsx
// 🟢 โครงหน้าหลักของฝั่ง Admin ทั้งหมด (ใช้ครอบทุกหน้าใต้ path /admin/*)
// ประกอบด้วย AdminSidebar + AdminTopbar + พื้นที่แสดงเนื้อหา (Outlet ของ react-router)
// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - AdminLayout() — บรรทัด 12

import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopbar from "./components/AdminTopbar";

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans lg:flex">

      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar onOpenMobile={() => setMobileOpen(true)} />
        
        <main className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;