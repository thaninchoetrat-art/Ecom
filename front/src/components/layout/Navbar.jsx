import { Link, NavLink } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiSettings,
} from "react-icons/fi";
import { useState, useContext, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import { CartContext } from "../../page/cart/CartContext";
import { logout } from "../../services/meService";
import { useNavigate } from "react-router-dom";

const menus = [
  { name: "หน้าแรก", path: "/" },

  { name: "แบรนด์ทั้งหมด", path: "/Brand" },
  { name: "เกี่ยวกับเรา", path: "/About" },

];

export default function Navbar() {
  const navigate = useNavigate();
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

  // 🟢 ปุ่มโปรไฟล์พาไปหน้า /profile เสมอ ไม่ว่า role ไหนก็ตาม (เหมือน Customer)
  // ถ้าเป็น Admin/Staff จะมีปุ่มแยกต่างหากใน Navbar นี้เลย ให้กดเข้า /admin หรือ /staff เอง
  const isLoggedIn = localStorage.getItem("is_logged_in") === "true";
  const userRole = localStorage.getItem("user_role");
  const profilePath = "/profile";
  const managePath = userRole === "Admin" ? "/admin" : userRole === "Staff" ? "/staff" : null;

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

  if (!result.isConfirmed) return;

  await logout();

  navigate("/", { replace: true });
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


          {isLoggedIn && (
  <Link to="/cart">
    <button className="relative rounded-full border cursor-pointer border-gray-200 p-2.5 text-xl text-gray-600 transition hover:border-pink-200 hover:text-pink-600">
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
)}

          {/* 🟢 ปุ่มเข้าสู่ระบบจัดการ: แสดงเฉพาะ Admin/Staff ที่ login อยู่ */}
          {isLoggedIn && managePath && (
            <Link to={managePath}>
              <button
                title={userRole === "Admin" ? "เข้าสู่ระบบผู้ดูแลระบบ (Admin)" : "เข้าสู่ระบบพนักงาน (Staff)"}
                className="flex items-center gap-1.5 rounded-full border cursor-pointer border-indigo-200 bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-100"
              >
                <FiSettings />
                <span className="hidden sm:inline">{userRole}</span>
              </button>
            </Link>
          )}

         {isLoggedIn ? (
            // Loginแสดง icon user
            <Link to={profilePath}>
              <button className="rounded-full border cursor-pointer border-gray-200 p-2.5 text-xl text-gray-600 transition hover:border-pink-200 hover:text-pink-600">
                <FiUser />
              </button>
            </Link>
          ) : (
            // ยังไม่ได้ Login แสดง ไอค่อน
            <Link to="/login">
              <button className="rounded-full border cursor-pointer border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 transition hover:border-pink-200 hover:text-pink-600">
                Login
              </button>
            </Link>
          )}

          {/* 🟢 ปุ่มออกจากระบบ: แสดงเฉพาะตอน login อยู่ */}
          {isLoggedIn && (
            <button
              onClick={handleLogout}
              title="ออกจากระบบ"
              className="rounded-full border cursor-pointer border-gray-200 p-2.5 text-xl text-gray-600 transition hover:border-red-200 hover:text-red-600"
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
