// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - StaffSidebar() — บรรทัด 16

import { FiShoppingCart, FiBox, FiArchive, FiTruck } from "react-icons/fi";
import AppSidebar from "../../../components/shared/AppSidebar";

// 🟢 โค้ด Sidebar จริง ๆ ย้ายไปรวมกับของ Admin แล้วที่ src/components/shared/AppSidebar.jsx
// ไฟล์นี้เหลือแค่ "ข้อมูลเฉพาะของ Staff" (เมนู/ป้ายชื่อ) แล้วส่งเป็น props ไปให้ตัวกลางเรนเดอร์
const NAV_ITEMS = [
  { to: "/staff", label: "ตรวจสอบคำสั่งซื้อ", icon: FiShoppingCart, end: true },
  { to: "/staff/products", label: "จัดการสินค้า", icon: FiBox },
  { to: "/staff/inventory", label: "จัดการสต๊อกสินค้า", icon: FiArchive },
  { to: "/staff/shipping", label: "จัดการการจัดส่ง", icon: FiTruck },
];

const StaffSidebar = (props) => (
  <AppSidebar
    {...props}
    navItems={NAV_ITEMS}
    brandLabel="Staff"
    sectionLabel="เมนูปฏิบัติงาน"
  />
);

export default StaffSidebar;
