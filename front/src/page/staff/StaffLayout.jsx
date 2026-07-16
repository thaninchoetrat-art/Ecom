// front/src/page/staff/StaffLayout.jsx
// 🟢 โครงหน้าหลักของฝั่ง Staff ทั้งหมด (ใช้ครอบทุกหน้าใต้ path /staff/*)
// ประกอบด้วย StaffSidebar + StaffTopbar + พื้นที่แสดงเนื้อหา (Outlet) เหมือน AdminLayout.jsx
// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - StaffLayout() — บรรทัด 12

import { useState } from "react";
import { Outlet } from "react-router-dom";
import StaffSidebar from "./components/StaffSidebar";
import StaffTopbar from "./components/StaffTopbar";

const StaffLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gray-50 font-sans lg:flex">
      {/* แถบเมนูด้านข้าง */}
      <StaffSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* พื้นที่เนื้อหาฝั่งขวา */}
      <div className="flex min-w-0 flex-1 flex-col">
        <StaffTopbar onOpenMobile={() => setMobileOpen(true)} />

        <main className="mx-auto w-full max-w-7xl p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffLayout;
