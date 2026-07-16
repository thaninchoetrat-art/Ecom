import React from "react";
import { FiTruck, FiCreditCard } from "react-icons/fi";
import { BsBank, BsQrCode } from "react-icons/bs";

const METHODS = [
  {
    id: "cod",
    label: "เก็บเงินปลายทาง",
    desc: "ชำระเงินสดกับพนักงานส่งสินค้า",
    icon: FiTruck,
  },
  {
    id: "bank_transfer",
    label: "โอนเงินผ่านธนาคาร",
    desc: "โอนเข้าบัญชีแล้วกดยืนยันการชำระเงิน",
    icon: BsBank,
  },
  {
    id: "promptpay",
    label: "พร้อมเพย์ (PromptPay)",
    desc: "สแกน QR Code เพื่อชำระเงิน",
    icon: BsQrCode,
  },
  {
    id: "card",
    label: "บัตรเครดิต / เดบิต",
    desc: "ชำระผ่านบัตรทันที (จำลองระบบ)",
    icon: FiCreditCard,
  },
];

// เว้นวรรคหมายเลขบัตรทุก 4 หลัก เช่น 1234 5678 9012 3456
function formatCardNumber(rawValue) {
  const digits = rawValue.replace(/[^0-9]/g, "").slice(0, 16);
  return digits.replace(/(.{4})(?=.)/g, "$1 ");
}

// พิมพ์แค่ตัวเลข MMYY แล้วใส่ "/" ให้อัตโนมัติ เช่น 0928 -> 09/28
function formatExpiry(rawValue) {
  const digits = rawValue.replace(/[^0-9]/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function CheckoutPaymentMethod({
  selected,
  onSelect,
  cardInfo,
  onCardInfoChange,
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800">วิธีการชำระเงิน</h2>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {METHODS.map((method) => {
          const Icon = method.icon;
          const isActive = selected === method.id;
          return (
            <button
              type="button"
              key={method.id}
              onClick={() => onSelect(method.id)}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                isActive
                  ? "border-pink-400 bg-pink-50 ring-2 ring-pink-100"
                  : "border-gray-200 hover:border-pink-200 hover:bg-pink-50/40"
              }`}
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  isActive ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                <Icon size={18} />
              </span>
              <span>
                <span className="block text-sm font-semibold text-gray-800">
                  {method.label}
                </span>
                <span className="block text-xs text-gray-400">{method.desc}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* รายละเอียดเพิ่มเติมตามวิธีชำระเงินที่เลือก */}
      {selected === "bank_transfer" && (
        <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-700">บัญชีสำหรับโอนเงิน</p>
          <p className="mt-1">ธนาคารกสิกรไทย เลขที่บัญชี 123-4-56789-0</p>
          <p>ชื่อบัญชี: บริษัท ช้อปนี้ จำกัด</p>
          <p className="mt-2 text-xs text-gray-400">
            หลังโอนเงินแล้ว กรุณากดปุ่ม "แจ้งว่าชำระเงินแล้ว" ในขั้นตอนถัดไป
          </p>
        </div>
      )}

      {selected === "promptpay" && (
        <div className="mt-5 rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          <p className="font-semibold text-gray-700">ชำระผ่านพร้อมเพย์</p>
          <p className="mt-1 text-xs text-gray-400">
            กด "ยืนยันสั่งซื้อ" ด้านล่าง ระบบจะแสดง QR Code ให้สแกนเพื่อชำระเงิน
            (มีเวลาสแกน 10 นาที)
          </p>
        </div>
      )}

      {selected === "card" && (
        <div className="mt-5 grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              ชื่อบนบัตร
            </label>
            <input
              type="text"
              value={cardInfo.holderName}
              onChange={(e) => onCardInfoChange({ ...cardInfo, holderName: e.target.value })}
              placeholder="ชื่อ-นามสกุล ตามบัตร"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-gray-600">
              หมายเลขบัตร
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={cardInfo.cardNumber}
              onChange={(e) =>
                onCardInfoChange({
                  ...cardInfo,
                  cardNumber: formatCardNumber(e.target.value),
                })
              }
              placeholder="XXXX XXXX XXXX XXXX"
              maxLength={19}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm tracking-widest outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">วันหมดอายุ</label>
            <input
              type="text"
              inputMode="numeric"
              value={cardInfo.expiry}
              onChange={(e) => onCardInfoChange({ ...cardInfo, expiry: formatExpiry(e.target.value) })}
              placeholder="MM/YY"
              maxLength={5}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-600">CVV</label>
            <input
              type="password"
              inputMode="numeric"
              value={cardInfo.cvv}
              onChange={(e) =>
                onCardInfoChange({ ...cardInfo, cvv: e.target.value.replace(/[^0-9]/g, "").slice(0, 3) })
              }
              placeholder="XXX"
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
          <p className="text-xs text-gray-400 sm:col-span-2">
            {/* ระบบจำลองการชำระเงิน จะไม่มีการส่งหมายเลขบัตรแบบเต็มไปเก็บที่เซิร์ฟเวอร์ */}
          </p>
        </div>
      )}
    </div>
  );
}
