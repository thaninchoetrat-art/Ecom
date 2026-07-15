import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiShoppingCart, FiArrowLeft } from "react-icons/fi";
import { CartContext } from "./CartContext"; // แก้ไข Path ให้ดึงจากโฟลเดอร์เดียวกัน
import CartItem from "./CartItem";           // แก้ไข Path ให้ดึงจากโฟลเดอร์เดียวกัน
import CartSummary from "./CartSummary";     // แก้ไข Path ให้ดึงจากโฟลเดอร์เดียวกัน

export default function Cart() {
  const navigate = useNavigate();
  const { items, increment, decrement, removeItem, totalItems, totalPrice } =
    useContext(CartContext) || {
      items: [],
      totalItems: 0,
      totalPrice: 0,
    };

  // 🛒 กรณีตะกร้าว่าง
  if (!items || items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-24">
        <FiShoppingCart size={56} className="text-gray-300" />
        <h2 className="mt-4 text-xl font-bold text-gray-700">
          ตะกร้าสินค้าของคุณว่างเปล่า
        </h2>
        <p className="mt-2 text-gray-400">
          เลือกซื้อสินค้าที่ถูกใจแล้วกลับมาที่นี่ได้เลย
        </p>
        <Link
          to="/" // แก้ไขจาก /home เป็น / เพื่อให้ตรงกับ Route หน้าแรกใน App.jsx
          className="mt-6 flex items-center gap-2 rounded-xl bg-pink-500 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-pink-600"
        >
          <FiArrowLeft />
          เลือกซื้อสินค้าต่อ
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 flex items-center gap-3 text-2xl font-black text-gray-800">
        <FiShoppingCart className="text-pink-500" />
        ตะกร้าสินค้าของฉัน
        <span className="text-base font-medium text-gray-400">
          ({totalItems} ชิ้น)
        </span>
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* รายการสินค้าในตะกร้า */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-100 bg-white px-6 shadow-sm">
            {items.map((item) => (
              <CartItem
                key={item.productId}
                item={item}
                onIncrement={increment}
                onDecrement={decrement}
                onRemove={removeItem}
              />
            ))}
          </div>

          <Link
            to="/" // แก้ไขจาก /home เป็น / เพื่อให้กดกลับหน้าร้านค้าได้ถูกต้อง
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-pink-500 hover:text-pink-600"
          >
            <FiArrowLeft />
            เลือกซื้อสินค้าเพิ่มเติม
          </Link>
        </div>

        {/* สรุปยอดคำสั่งซื้อ */}
        <div className="lg:col-span-1">
          <CartSummary
            totalItems={totalItems}
            totalPrice={totalPrice}
            onCheckout={handleCheckout}
          />
        </div>
      </div>
    </div>
  );
}