import { FiMenu, FiBell, FiSearch } from "react-icons/fi";
import { useLocation } from "react-router-dom";

const TITLE_MAP = {
  "/admin": "แดชบอร์ดสรุปยอดขาย",
  "/admin/products": "จัดการข้อมูลสินค้า",
  "/admin/members": "จัดการสมาชิก",
  "/admin/orders": "จัดการคำสั่งซื้อ",
  "/admin/inventory": "ตรวจสอบและจัดการคลังสินค้า",
  "/admin/shipping": "จัดการสถานะการจัดส่ง",
};

const AdminTopbar = ({ onOpenMobile }) => {
  const location = useLocation();
  const title = TITLE_MAP[location.pathname] || "แผงควบคุมผู้ดูแลระบบ";

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
            ระบบจัดการหลังบ้าน Leo Beauty
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

        <div className="flex items-center gap-2.5 border-l border-gray-100 pl-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-sm font-bold text-pink-600">
            A
          </div>
          <div className="hidden leading-tight sm:block">
            <p className="text-sm font-semibold text-gray-800">Admin</p>
            <p className="text-xs text-gray-400">ผู้ดูแลระบบ</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;