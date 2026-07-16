// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - AdminTopbar() — บรรทัด 15

import AppTopbar from "../../../components/shared/AppTopbar";

// 🟢 โค้ด Topbar จริง ๆ ย้ายไปรวมกับของ Staff แล้วที่ src/components/shared/AppTopbar.jsx
// ไฟล์นี้เหลือแค่ "ข้อมูลเฉพาะของ Admin" (หัวข้อแต่ละหน้า/ค่า fallback) แล้วส่งเป็น props ไปให้ตัวกลางเรนเดอร์
const TITLE_MAP = {
  "/admin": "แดชบอร์ดสรุปยอดขาย",
  "/admin/products": "จัดการข้อมูลสินค้า",
  "/admin/members": "จัดการสมาชิกและบัญชี",
  "/admin/profile": "โปรไฟล์ของฉัน",
};

const AdminTopbar = (props) => (
  <AppTopbar
    {...props}
    titleMap={TITLE_MAP}
    defaultTitle="แผงควบคุมผู้ดูแลระบบ"
    profilePath="/admin/profile"
    fallbackName="ผู้ดูแลระบบ"
    fallbackRole="Admin"
  />
);

export default AdminTopbar;
