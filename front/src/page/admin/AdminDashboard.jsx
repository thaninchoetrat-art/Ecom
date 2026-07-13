import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
  FiBox,
  FiAlertTriangle,
  FiArrowUpRight,
} from "react-icons/fi";
import StatCard from "./components/StatCard";
import StatusBadge from "./components/StatusBadge";
import { computeDashboardStats } from "./services/dashboardService";
import { ORDER_STATUS } from "./services/orderService";

const currency = (n) => `฿${Number(n || 0).toLocaleString("th-TH")}`;

const COLOR_HEX = {
  amber: "#f59e0b",
  blue: "#3b82f6",
  indigo: "#6366f1",
  purple: "#a855f7",
  green: "#10b981",
  red: "#ef4444",
  gray: "#9ca3af",
  pink: "#ec4899",
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    setStats(computeDashboardStats());
  }, []);

  const maxMonthly = useMemo(() => {
    if (!stats) return 1;
    return Math.max(1, ...stats.monthlySales.map((m) => m.total));
  }, [stats]);

  if (!stats) return null;

  const statusEntries = Object.entries(stats.statusCounts);
  const totalStatusCount = statusEntries.reduce((s, [, c]) => s + c, 0) || 1;

  return (
    /* ปรับปรุง: เพิ่ม !p-6 md:!p-8 !mx-auto !max-w-7xl ที่กล่องนอกสุดของแดชบอร์ด */
    <div className="flex w-full flex-col gap-6 !p-6 md:!p-8 !mx-auto !max-w-7xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<FiDollarSign size={20} />} label="ยอดขายรวม" value={currency(stats.totalRevenue)} tone="pink" />
        <StatCard icon={<FiShoppingBag size={20} />} label="คำสั่งซื้อทั้งหมด" value={stats.totalOrders.toLocaleString()} tone="violet" />
        <StatCard icon={<FiUsers size={20} />} label="สมาชิกทั้งหมด" value={stats.totalCustomers.toLocaleString()} tone="emerald" />
        <StatCard icon={<FiBox size={20} />} label="สินค้าในระบบ" value={stats.totalProducts.toLocaleString()} tone="amber" />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white !p-6 shadow-sm xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-gray-900">ยอดขายรายเดือน</h3>
              <p className="text-xs text-gray-400">ปี {new Date().getFullYear() + 543}</p>
            </div>
          </div>
          <div className="flex h-56 items-end gap-2 sm:gap-3">
            {stats.monthlySales.map((m) => (
              <div key={m.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-44 w-full items-end justify-center">
                  <div
                    className="w-full max-w-[26px] rounded-t-md bg-gradient-to-t from-pink-500 to-pink-300 transition-all duration-500"
                    style={{ height: `${Math.max(4, (m.total / maxMonthly) * 100)}%` }}
                    title={currency(m.total)}
                  />
                </div>
                <span className="text-[11px] text-gray-400">{m.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white !p-6 shadow-sm">
          <h3 className="mb-5 text-base font-bold text-gray-900">สัดส่วนสถานะคำสั่งซื้อ</h3>
          <div className="flex flex-col gap-4">
            {statusEntries.length === 0 && <p className="text-sm text-gray-400">ยังไม่มีคำสั่งซื้อ</p>}
            {statusEntries.map(([status, count]) => {
              const meta = ORDER_STATUS[status] || { label: status, color: "gray" };
              const pct = Math.round((count / totalStatusCount) * 100);
              return (
                <div key={status}>
                  <div className="mb-1.5 flex items-center justify-between text-xs">
                    <StatusBadge label={meta.label} color={meta.color} />
                    <span className="font-semibold text-gray-500">{count} รายการ ({pct}%)</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: COLOR_HEX[meta.color] || COLOR_HEX.gray }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white !p-6 shadow-sm xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-gray-900">คำสั่งซื้อล่าสุด</h3>
            <Link to="/admin/orders" className="flex items-center gap-1 text-xs font-semibold text-pink-500 hover:text-pink-600">
              ดูทั้งหมด <FiArrowUpRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                  <th className="!pb-3 !pt-2 font-medium">รหัส</th>
                  <th className="!pb-3 !pt-2 font-medium">ลูกค้า</th>
                  <th className="!pb-3 !pt-2 font-medium">ยอดรวม</th>
                  <th className="!pb-3 !pt-2 font-medium">สถานะ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.map((o) => {
                  const meta = ORDER_STATUS[o.status] || { label: o.status, color: "gray" };
                  return (
                    <tr key={o.orderId} className="text-gray-700">
                      <td className="!py-3.5 font-medium text-gray-900">{o.orderId}</td>
                      <td className="!py-3.5">{o.customerName}</td>
                      <td className="!py-3.5 font-semibold">{currency(o.total)}</td>
                      <td className="!py-3.5"><StatusBadge label={meta.label} color={meta.color} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white !p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-base font-bold text-gray-900">
              <FiAlertTriangle className="text-amber-500" /> สินค้าใกล้หมด
            </h3>
            <Link to="/admin/inventory" className="text-xs font-semibold text-pink-500 hover:text-pink-600">จัดการ</Link>
          </div>
          <div className="flex flex-col gap-3">
            {stats.lowStockProducts.length === 0 && <p className="text-sm text-gray-400">สต็อกสินค้าอยู่ในระดับปกติ</p>}
            {stats.lowStockProducts.slice(0, 6).map((p) => (
              <div key={p.productId} className="flex items-center justify-between text-sm py-0.5">
                <span className="truncate text-gray-700">{p.productName || "ไม่มีชื่อ"}</span>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-bold ${Number(p.stock) === 0 ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>
                  เหลือ {p.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white !p-6 shadow-sm">
        <h3 className="mb-4 text-base font-bold text-gray-900">สินค้าขายดี</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.topProducts.map((p, idx) => (
            <div key={idx} className="rounded-xl border border-gray-100 !p-5 transition hover:border-pink-200 hover:bg-pink-50/40">
              <p className="mb-1 text-xs font-semibold text-pink-500">อันดับ {idx + 1}</p>
              <p className="mb-2 truncate text-sm font-semibold text-gray-800">{p.productName}</p>
              <p className="text-xs text-gray-400">ขายแล้ว {p.qty} ชิ้น</p>
              <p className="text-xs text-gray-400">รายได้ {currency(p.revenue)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;