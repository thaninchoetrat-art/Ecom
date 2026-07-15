import React from "react";

export default function CartSummary({ totalItems, totalPrice, onCheckout }) {
  const shippingFee = totalPrice > 0 && totalPrice < 499 ? 50 : 0;
  const grandTotal = totalPrice + shippingFee;

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800">สรุปคำสั่งซื้อ</h3>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>สินค้าทั้งหมด ({totalItems} ชิ้น)</span>
          <span>฿{totalPrice.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-gray-500">
          <span>ค่าจัดส่ง</span>
          <span>
            {shippingFee === 0 ? (
              <span className="font-semibold text-emerald-500">ฟรี</span>
            ) : (
              `฿${shippingFee}`
            )}
          </span>
        </div>

        {shippingFee > 0 && (
          <p className="rounded-lg bg-pink-50 px-3 py-2 text-xs text-pink-500">
            ซื้อเพิ่มอีก ฿{(499 - totalPrice).toLocaleString()} รับส่งฟรีทันที!
          </p>
        )}
      </div>

      <div className="my-4 border-t border-dashed border-gray-200" />

      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-700">ยอดชำระทั้งหมด</span>
        <span className="text-2xl font-black text-pink-600">
          ฿{grandTotal.toLocaleString()}
        </span>
      </div>

      <button
        onClick={onCheckout}
        disabled={totalItems === 0}
        className="mt-6 w-full rounded-xl bg-pink-500 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-pink-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
      >
        สั่งซื้อสินค้า ({totalItems})
      </button>
    </div>
  );
}
