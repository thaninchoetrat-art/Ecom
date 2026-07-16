import { NavLink } from "react-router-dom";
import { FiChevronsLeft, FiChevronsRight, FiArrowLeft } from "react-icons/fi";

// 🟢 รวมโค้ด Sidebar ของ Admin (AdminSidebar.jsx) กับ Staff (StaffSidebar.jsx) ไว้ที่เดียว
// เพราะโครงสร้าง JSX/Tailwind classNames เหมือนกันทุกเส้น ต่างกันแค่ "ข้อมูล"
// (รายการเมนู, ป้ายชื่อแบรนด์, ข้อความหัวข้อเมนู) เลยแยกเป็น props แทน
//
// props:
// - navItems: [{ to, label, icon, end }]
// - brandLabel: ข้อความต่อท้าย "5 Paul" เช่น "Admin" หรือ "Staff"
// - sectionLabel: หัวข้อเล็ก ๆ เหนือรายการเมนู เช่น "เมนูจัดการร้านค้า"
const AppSidebar = ({
  navItems,
  brandLabel,
  sectionLabel,
  collapsed,
  onToggle,
  mobileOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Overlay สำหรับมือถือ */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col border-r border-gray-100 bg-white transition-all duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          lg:sticky lg:top-0 lg:translate-x-0 ${collapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        {/* ส่วนหัว Sidebar โลโก้ร้าน */}
        <div className="flex h-16 items-center justify-between border-b border-gray-100 !px-4">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-pink-500 text-sm font-black text-white shadow-sm shadow-pink-200">
              LB
            </div>
            {!collapsed && (
              <span className="truncate text-base font-bold text-gray-900 tracking-wide">
                5 Paul <span className="text-pink-500">{brandLabel}</span>
              </span>
            )}
          </div>
          <button
            onClick={onToggle}
            className="hidden rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 lg:flex transition-colors"
          >
            {collapsed ? <FiChevronsRight size={16} /> : <FiChevronsLeft size={16} />}
          </button>
        </div>

        {/* รายการเมนูหลัก */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto !px-3 !py-5">
          {!collapsed && (
            <p className="!px-3 !pb-1 text-[11px] font-bold uppercase tracking-wider text-gray-400/80">
              {sectionLabel}
            </p>
          )}
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `group flex items-center transition-all rounded-xl !py-2.5 text-sm font-semibold ${
                collapsed
                  ? "justify-center !px-0 h-11 w-11 mx-auto"
                  : "gap-3 !px-3.5"
                } ${isActive
                  ? "bg-pink-500 text-white shadow-md shadow-pink-100"
                  : "text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                }`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* ปุ่มกลับหน้าร้านค้าด้านล่างสุด */}
        <div className="border-t border-gray-100 !p-3">
          <NavLink
            to="/"
            className={`flex items-center transition-all rounded-xl !py-2.5 text-sm font-bold border border-gray-200 bg-gray-50 text-gray-700 hover:bg-pink-50 hover:text-pink-600 hover:border-pink-200 shadow-sm ${
              collapsed ? "justify-center !px-0 h-11 w-11 mx-auto" : "gap-3 !px-4"
              }`}
            title={collapsed ? "กลับหน้าร้าน" : undefined}
          >
            <FiArrowLeft size={18} className="shrink-0" />
            {!collapsed && <span>กลับหน้าร้านค้า</span>}
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
