// front/src/page/staff/components/StaffTopbar.jsx
// 🟢 wrapper ส่งหัวข้อของแต่ละหน้า (TITLE_MAP) เฉพาะของ Staff ไปให้
// components/shared/AppTopbar.jsx เรนเดอร์จริง
// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - StaffTopbar() — บรรทัด 17

import AppTopbar from "../../../components/shared/AppTopbar";

const TITLE_MAP = {
  "/staff": "ตรวจสอบคำสั่งซื้อ",
  "/staff/products": "จัดการข้อมูลสินค้า",
  "/staff/inventory": "ตรวจสอบและจัดการคลังสินค้า",
  "/staff/shipping": "จัดการสถานะการจัดส่ง",
  "/staff/profile": "โปรไฟล์ของฉัน",
};

const StaffTopbar = (props) => (
  <AppTopbar
    {...props}
    titleMap={TITLE_MAP}
    defaultTitle="แผงควบคุมพนักงาน"
    profilePath="/staff/profile"
    fallbackName="พนักงาน"
    fallbackRole="Staff"
  />
);

export default StaffTopbar;
