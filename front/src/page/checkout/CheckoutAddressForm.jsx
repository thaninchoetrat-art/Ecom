import React from "react";

const FIELDS = [
  { name: "receiverName", label: "ชื่อผู้รับ", placeholder: "ชื่อ-นามสกุล ผู้รับสินค้า" },
  { name: "phone", label: "เบอร์โทรศัพท์", placeholder: "เบอร์โทรศัพท์ผู้รับสินค้า" },
  { name: "detail", label: "ที่อยู่ (บ้านเลขที่, ซอย, ถนน)", placeholder: "เช่น 123/45 ม.6 ซอยสุขุมวิท..." },
  { name: "province", label: "จังหวัด", placeholder: "กรอกจังหวัด" },
  { name: "district", label: "เขต / อำเภอ", placeholder: "กรอกเขตหรืออำเภอ" },
  { name: "postalCode", label: "รหัสไปรษณีย์", placeholder: "กรอกรหัสไปรษณีย์ 5 หลัก", maxLength: 5 },
];

export default function CheckoutAddressForm({ address, onChange }) {
  const handleChange = (e) => {
    onChange({ ...address, [e.target.name]: e.target.value });
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-gray-800">ที่อยู่จัดส่งสินค้า</h2>
      <p className="mt-1 text-sm text-gray-400">
        กรอกข้อมูลผู้รับให้ครบถ้วนเพื่อความถูกต้องในการจัดส่ง
      </p>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <div key={field.name} className={field.name === "detail" ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-sm font-medium text-gray-600">
              {field.label}
            </label>
            <input
              type="text"
              name={field.name}
              value={address[field.name] || ""}
              onChange={handleChange}
              placeholder={field.placeholder}
              maxLength={field.maxLength}
              required
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
