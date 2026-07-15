import { FiMenu, FiBell, FiSearch, FiLogOut } from "react-icons/fi";
import { useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { logout } from "../../../services/meService";

const TITLE_MAP = {
  "/staff": "ตรวจสอบคำสั่งซื้อ",
  "/staff/inventory": "ตรวจสอบและจัดการคลังสินค้า",
  "/staff/shipping": "จัดการสถานะการจัดส่ง",
  "/staff/profile": "โปรไฟล์ของฉัน",
};

const StaffTopbar = ({ onOpenMobile }) => {
  const location = useLocation();
  const title = TITLE_MAP[location.pathname] || "แผงควบคุมพนักงาน";

  // 🟢 เดิมช่องนี้ hardcode เป็น "S" / "Staff" เฉยๆ ไม่บอกว่าใคร login อยู่จริง
  // ดึงชื่อ/ตำแหน่งจาก localStorage ที่ตั้งไว้ตอน login (login.jsx)
  const staffName = localStorage.getItem("local_user_name") || "พนักงาน";
  const staffRole = localStorage.getItem("user_role") || "Staff";
  const initial = staffName.trim().charAt(0).toUpperCase() || "S";

  // 🟢 ปุ่มออกจากระบบ: ล้าง localStorage แล้วพากลับไปหน้า login
  const handleLogout = async (e) => {
    e.preventDefault();
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

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-gray-100 bg-white/90 !px-6 backdrop-blur md:!px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
        >
          <FiMenu size={20} />
        </button>
        <div>
          <h1 className="text-base font-bold text-gray-900 lg:text-lg">{title}</h1>
          <p className="hidden text-xs text-gray-400 sm:block">
            ระบบปฏิบัติงานหลังบ้าน Leo Beauty
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <FiSearch
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="ค้นหา..."
           className="w-56 rounded-xl border border-gray-200 bg-gray-50 py-2 !pl-10 pr-3..."
          />
        </div>

        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <FiBell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-pink-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2 border-l border-gray-100 pl-3">
          {/* 🟢 เดิมกดตรงนี้แล้วไม่มีอะไรเกิดขึ้น ตอนนี้พาไปหน้าโปรไฟล์ของตัวเอง */}
          <Link
            to="/staff/profile"
            className="flex items-center gap-2.5 rounded-lg !px-1.5 !py-1 transition hover:bg-gray-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
              {initial}
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold text-gray-800">{staffName}</p>
              <p className="text-xs text-gray-400">{staffRole}</p>
            </div>
          </Link>

          {/* 🟢 ปุ่มออกจากระบบ */}
          <button
            type="button"
            onClick={handleLogout}
            title="ออกจากระบบ"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
          >
            <FiLogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default StaffTopbar;
