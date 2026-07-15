import { Link, NavLink } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
} from "react-icons/fi";
import { useState, useContext, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { CartContext } from "../../page/cart/CartContext";
import { logout } from "../../services/meService";

const menus = [
  { name: "หน้าแรก", path: "/" }, 
  { name: "หมวดหมู่สินค้า", path: "/shop" },
  { name: "แบรนด์ทั้งหมด", path: "/brands" },
  { name: "สินค้าใหม่", path: "/new" },
  { name: "คอลเลคชั่นพิเศษ", path: "/collection" },
  { name: "โปรโมชั่นออนไลน์", path: "/promotion" },
  { name: "ร้านคาร์มาร์ท", path: "/stores" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { totalItems } = useContext(CartContext) || { totalItems: 0 };
  const [bounce, setBounce] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setBounce(true);
    const timer = setTimeout(() => setBounce(false), 400);
    return () => clearTimeout(timer);
  }, [totalItems]);

  // 🟢 เดิมปุ่มโปรไฟล์พาไปหน้า /profile (ของลูกค้า) เสมอ ไม่ว่าใคร login อยู่ก็ตาม
  // ทำให้ Staff/Admin ที่หลงมาที่หน้าแรกแล้วกดโปรไฟล์ ดันไปเจอหน้าโปรไฟล์ลูกค้าซึ่งไม่ใช่ของตัวเอง
  // ตอนนี้เช็ค role จาก localStorage แล้วพาไปหน้าของตัวเองแทน
  const isLoggedIn = localStorage.getItem("is_logged_in") === "true";
  const userRole = localStorage.getItem("user_role");
  const profilePath =
    userRole === "Admin" ? "/admin" : userRole === "Staff" ? "/staff" : "/profile";

  const handleLogout = async () => {
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
    /* 🟢 ใช้ Breakout Hack: w-screen ml-[calc(50%-50vw)] max-w-none ทะลวงกล่องออกไปติดขอบจอ */
    <header className="sticky top-0 z-50 w-screen ml-[calc(50%-50vw)] max-w-none border-b border-pink-100 bg-white/90 backdrop-blur-xl">
      
      {/* ส่วนเนื้อหาภายในล็อกจัดกึ่งกลางสวยงามเท่าเดิม */}
      <div className="max-w-7xl mx-auto w-full h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* โลโก้ร้านค้า */}
        <Link
          to="/"
          className="text-3xl font-black tracking-tight text-pink-600 sm:text-4xl"
        >
          5 Paul
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-10">
          {menus.map((menu) => (
            <NavLink
              key={menu.name}
              to={menu.path}
              className={({ isActive }) =>
                `text-[15px] transition ${
                  isActive
                    ? "text-pink-600 font-bold"
                    : "text-gray-700 hover:text-pink-600"
                }`
              }
            >
              {menu.name}
            </NavLink>
          ))}
        </nav>

        {/* ปุ่มฝั่งขวา (Search, ตะกร้า, โปรไฟล์) */}
        <div className="flex items-center gap-6">
          <button className="rounded-full border border-gray-200 p-2.5 text-xl text-gray-600 transition hover:border-pink-200 hover:text-pink-600">
            <FiSearch />
          </button>

          <Link to="/cart">
            <button className="relative rounded-full border border-gray-200 p-2.5 text-xl text-gray-600 transition hover:border-pink-200 hover:text-pink-600">
              <FiShoppingCart />
              {totalItems > 0 && (
                <span
                  className={`absolute -top-2 -right-3 h-5 min-w-[20px] rounded-full bg-pink-600 px-1 text-white text-[11px] flex items-center justify-center transition-transform duration-300 ${
                    bounce ? "scale-125" : "scale-100"
                  }`}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
          </Link>

          <Link to={profilePath}>
            <button className="rounded-full border border-gray-200 p-2.5 text-xl text-gray-600 transition hover:border-pink-200 hover:text-pink-600">
              <FiUser />
            </button>
          </Link>

          {/* 🟢 ปุ่มออกจากระบบ: แสดงเฉพาะตอน login อยู่ */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              title="ออกจากระบบ"
              className="rounded-full border border-gray-200 p-2.5 text-xl text-gray-600 transition hover:border-red-200 hover:text-red-600"
            >
              <FiLogOut />
            </button>
          )}

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-full border border-gray-200 p-2.5 text-xl text-gray-600 lg:hidden"
          >
            {mobileOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-6 py-5 space-y-5">
            {menus.map((menu) => (
              <NavLink
                key={menu.name}
                to={menu.path}
                onClick={() => setMobileOpen(false)}
                className="block text-gray-700 hover:text-pink-600"
              >
                {menu.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}

    </header>
  );
}