import React from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";

export default function CartItem({ item, onIncrement, onDecrement, onRemove }) {
  const subtotal = item.price * item.quantity;
  const hasStockLimit = item.stock !== undefined && item.stock !== null;
  const atMax = hasStockLimit && item.quantity >= item.stock;

  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 py-5 sm:flex-row sm:items-center">
      {/* รูปภาพและชื่อสินค้า */}
      <div className="flex flex-1 items-center gap-4">
        <img
          src={item.image}
          alt={item.name}
          className="h-20 w-20 shrink-0 rounded-lg object-cover border border-gray-100"
        />
        <div className="min-w-0">
          <p className="line-clamp-2 font-semibold text-gray-800">{item.name}</p>
          <p className="mt-1 text-sm text-gray-400">
            ฿{item.price.toLocaleString()} / ชิ้น
          </p>
        </div>
      </div>

      {/* ตัวควบคุมจำนวน +/- */}
      <div className="flex items-center justify-between gap-6 sm:justify-center">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center rounded-full border border-gray-200">
            <button
              onClick={() => onDecrement(item.productId)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
              aria-label="ลดจำนวน"
            >
              <FiMinus size={14} />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-gray-800">
              {item.quantity}
            </span>
            <button
              onClick={() => onIncrement(item.productId)}
              disabled={atMax}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
                atMax
                  ? "cursor-not-allowed text-gray-300"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="เพิ่มจำนวน"
            >
              <FiPlus size={14} />
            </button>
          </div>
          {atMax && (
            <p className="whitespace-nowrap text-[11px] font-medium text-pink-500">
              เหลือ {item.stock} ชิ้น เพิ่มไม่ได้แล้ว
            </p>
          )}
        </div>

        {/* ราคารวมต่อรายการ */}
        <p className="w-24 text-right font-bold text-pink-600 sm:w-28">
          ฿{subtotal.toLocaleString()}
        </p>

        {/* ปุ่มลบสินค้า */}
        <button
          onClick={() => onRemove(item.productId)}
          className="rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
          aria-label="ลบสินค้า"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </div>
  );
}
