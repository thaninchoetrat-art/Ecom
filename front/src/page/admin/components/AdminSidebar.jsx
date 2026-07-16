// front/src/page/admin/components/AdminSidebar.jsx
// 🟢 wrapper ส่งเมนู/ชื่อแบรนด์เฉพาะของ Admin ไปให้ components/shared/AppSidebar.jsx เรนเดอร์จริง
// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - AdminSidebar() — บรรทัด 29

import {
  FiGrid,
  FiBox,
  FiUsers,
  FiDatabase,
  FiShoppingBag,
  FiArchive,
  FiTruck,
} from "react-icons/fi";
import AppSidebar from "../../../components/shared/AppSidebar";

// 🟢 โค้ด Sidebar จริง ๆ ย้ายไปรวมกับของ Staff แล้วที่ src/components/shared/AppSidebar.jsx
// ไฟล์นี้เหลือแค่ "ข้อมูลเฉพาะของ Admin" (เมนู/ป้ายชื่อ) แล้วส่งเป็น props ไปให้ตัวกลางเรนเดอร์
const NAV_ITEMS = [
  { to: "/admin", label: "แดชบอร์ด", icon: FiGrid, end: true },
  { to: "/admin/products", label: "จัดการสินค้า", icon: FiBox },
  { to: "/admin/orders", label: "จัดการคำสั่งซื้อ", icon: FiShoppingBag },
  { to: "/admin/inventory", label: "จัดการคลังสินค้า", icon: FiArchive },
  { to: "/admin/shipping", label: "จัดการจัดส่ง", icon: FiTruck },
  { to: "/admin/members", label: "จัดการสมาชิก / บัญชี", icon: FiUsers },
  { to: "/admin/backup", label: "สำรองข้อมูล", icon: FiDatabase },
];

const AdminSidebar = (props) => (
  <AppSidebar
    {...props}
    navItems={NAV_ITEMS}
    brandLabel="Admin"
    sectionLabel="เมนูจัดการร้านค้า"
  />
);

export default AdminSidebar;
