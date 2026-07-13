import { Link, NavLink } from "react-router-dom";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { useState, useContext, useEffect, useRef } from "react";
import { CartContext } from "../../page/cart/CartContext";

const menus = [
  // 1. แก้ไขตรงนี้: เปลี่ยน path จาก "/home" เป็น "/"
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

  // ✨ ทำให้ตัวเลขบนไอคอนตะกร้า "เด้ง" ทุกครั้งที่จำนวนสินค้าเปลี่ยนแปลง
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setBounce(true);
    const timer = setTimeout(() => setBounce(false), 400);
    return () => clearTimeout(timer);
  }, [totalItems]);

  return (
    <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/90 backdrop-blur-xl">

      <div className="w-full px-4 sm:px-6 lg:px-8">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between">

          {/* 2. แก้ไขตรงนี้: เปลี่ยน to จาก "/home" เป็น "/" เพื่อให้กดโลโก้แล้วกลับหน้าแรกได้ */}
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

          {/* Right */}
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
            <Link to="/profile">
              <button className="rounded-full border border-gray-200 p-2.5 text-xl text-gray-600 transition hover:border-pink-200 hover:text-pink-600">
                <FiUser />
              </button>
            </Link>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-full border border-gray-200 p-2.5 text-xl text-gray-600 lg:hidden"
            >
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

        </div>

      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t">
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