import React from "react";

export default function CheckoutOrderSummary({
  items,
  subtotal,
  shippingFee,
  grandTotal,
  submitting,
  onSubmit,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-800">สรุปคำสั่งซื้อ</h3>

      <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={item.productId} className="flex items-center gap-3">
            <img
              src={item.image}
              alt={item.name}
              className="h-14 w-14 shrink-0 rounded-lg border border-gray-100 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-800">{item.name}</p>
              <p className="text-xs text-gray-400">
                {item.quantity} x ฿{item.price.toLocaleString()}
              </p>
            </div>
            <p className="text-sm font-bold text-pink-600">
              ฿{(item.price * item.quantity).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      <div className="my-4 border-t border-dashed border-gray-200" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-gray-500">
          <span>ยอดสินค้า</span>
          <span>฿{subtotal.toLocaleString()}</span>
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
      </div>

      <div className="my-4 border-t border-dashed border-gray-200" />

      <div className="flex items-center justify-between">
        <span className="font-semibold text-gray-700">ยอดชำระทั้งหมด</span>
        <span className="text-2xl font-black text-pink-600">
          ฿{grandTotal.toLocaleString()}
        </span>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="mt-6 w-full rounded-xl bg-pink-500 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-pink-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
      >
        {submitting ? "กำลังดำเนินการ..." : "ยืนยันสั่งซื้อ"}
      </button>
    </div>
  );
}
