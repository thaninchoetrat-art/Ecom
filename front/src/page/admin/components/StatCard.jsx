// front/src/page/admin/components/StatCard.jsx
// การ์ดสรุปตัวเลข 1 ค่า (ไอคอน + label + value) ใช้เฉพาะใน AdminDashboard.jsx
// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - StatCard() — บรรทัด 6

const StatCard = ({ icon, label, value, trend, trendUp, tone = "pink" }) => {
  const toneMap = {
    pink: "bg-pink-50 text-pink-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white !p-6 shadow-sm transition hover:shadow-md">
      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneMap[tone]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <div className="mt-1 flex items-end gap-2">
          <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
          {trend && (
            <span
              className={`mb-0.5 text-xs font-semibold ${
                trendUp ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatCard;