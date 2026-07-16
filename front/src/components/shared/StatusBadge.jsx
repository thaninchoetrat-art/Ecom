// 🟢 ย้ายมาจาก admin/components/StatusBadge.jsx และ staff/components/StatusBadge.jsx
// (โค้ดเดิมเหมือนกันทุกตัวอักษรทั้งสองที่ เลยรวมไว้ที่เดียวให้ Admin/Staff ใช้ร่วมกัน)
const COLOR_MAP = {
  amber: "bg-amber-50 text-amber-600 ring-amber-200",
  blue: "bg-blue-50 text-blue-600 ring-blue-200",
  indigo: "bg-indigo-50 text-indigo-600 ring-indigo-200",
  purple: "bg-purple-50 text-purple-600 ring-purple-200",
  green: "bg-emerald-50 text-emerald-600 ring-emerald-200",
  red: "bg-red-50 text-red-600 ring-red-200",
  gray: "bg-gray-100 text-gray-600 ring-gray-200",
  pink: "bg-pink-50 text-pink-600 ring-pink-200",
};

const StatusBadge = ({ label, color = "gray" }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${
      COLOR_MAP[color] || COLOR_MAP.gray
    }`}
  >
    <span className="h-1.5 w-1.5 rounded-full bg-current" />
    {label}
  </span>
);

export default StatusBadge;
