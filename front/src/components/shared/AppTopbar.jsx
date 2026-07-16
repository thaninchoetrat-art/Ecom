import { FiMenu, FiBell, FiSearch, FiLogOut } from "react-icons/fi";
import { useLocation, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { logout } from "../../services/meService";

// 🟢 รวมโค้ด Topbar ของ Admin (AdminTopbar.jsx) กับ Staff (StaffTopbar.jsx) ไว้ที่เดียว
// เพราะโครงสร้าง JSX/Tailwind classNames เหมือนกันทุกเส้น ต่างกันแค่ "ข้อมูล"
// (แผนที่ชื่อหัวข้อของแต่ละหน้า, ข้อความ fallback ตอนยังไม่รู้ชื่อ/สิทธิ์, ลิงก์โปรไฟล์) เลยแยกเป็น props แทน
//
// props:
// - onOpenMobile: เปิดเมนูมือถือ
// - titleMap: { [pathname]: หัวข้อของหน้านั้น }
// - defaultTitle: หัวข้อ fallback ถ้า path ไม่ตรงกับ titleMap เลย
// - profilePath: ลิงก์ไปหน้าโปรไฟล์ของตัวเอง (เช่น /admin/profile หรือ /staff/profile)
// - fallbackName / fallbackRole: ข้อความ fallback ถ้ายังไม่มีชื่อ/สิทธิ์ใน localStorage
const AppTopbar = ({ onOpenMobile, titleMap, defaultTitle, profilePath, fallbackName, fallbackRole }) => {
  const location = useLocation();
  const title = titleMap[location.pathname] || defaultTitle;

  // 🟢 อ่านชื่อ/สิทธิ์จริงของคนที่ login อยู่ ไม่ hardcode
  const displayName = localStorage.getItem("local_user_name") || fallbackName;
  const displayRole = localStorage.getItem("user_role") || fallbackRole;
  const initial = displayName.trim().charAt(0).toUpperCase() || fallbackName.charAt(0);

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
            className="w-56 rounded-xl border border-gray-200 bg-gray-50 py-2 !pl-10 pr-3 text-sm outline-none focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100"
          />
        </div>

        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <FiBell size={18} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-pink-500 ring-2 ring-white" />
        </button>

        <div className="flex items-center gap-2 border-l border-gray-100 pl-3">
          <Link
            to={profilePath}
            className="flex items-center gap-2.5 rounded-lg !px-1.5 !py-1 transition hover:bg-gray-50"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
              {initial}
            </div>
            <div className="hidden leading-tight sm:block">
              <p className="text-sm font-semibold text-gray-800">{displayName}</p>
              <p className="text-xs text-gray-400">{displayRole}</p>
            </div>
          </Link>

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

export default AppTopbar;
