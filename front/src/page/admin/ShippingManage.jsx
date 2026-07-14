import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { FiSearch, FiTruck, FiCheck } from "react-icons/fi";
import Modal from "./components/Modal";
import StatusBadge from "./components/StatusBadge";
import { fetchOrders, updateOrderStatus, updateOrder, ORDER_STATUS, SHIPPING_STEPS } from "./services/orderService";

const currency = (n) => `฿${Number(n || 0).toLocaleString("th-TH")}`;

const ShippingManage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [carrier, setCarrier] = useState("");
  const [tracking, setTracking] = useState("");

  const loadData = () => setOrders(fetchOrders());
  useEffect(() => { loadData(); }, []);

  const shippable = useMemo(() => {
    return orders.filter((o) => o.status !== "pending" && o.status !== "cancelled").filter((o) => {
      return !search || o.orderId.toLowerCase().includes(search.toLowerCase()) || o.customerName?.toLowerCase().includes(search.toLowerCase()) || o.trackingNumber?.toLowerCase().includes(search.toLowerCase());
    }).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [orders, search]);

  return (
    /* ปรับปรุง: เพิ่ม !p-6 md:!p-8 !mx-auto !max-w-7xl ที่กล่องนอกสุดของหน้าจัดส่ง */
    <div className="flex w-full flex-col gap-6 !p-6 md:!p-8 !mx-auto !max-w-7xl">
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white !p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหารหัสคำสั่งซื้อ / ลูกค้า / เลขพัสดุ" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 !pl-10 pr-3..." />
        </div>
        <div className="text-sm text-gray-400">ทั้งหมด {shippable.length} คำสั่งซื้อที่ต้องจัดส่ง</div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {shippable.map((o) => {
          const meta = ORDER_STATUS[o.status] || { label: o.status, color: "gray" };
          const stepIdx = SHIPPING_STEPS.indexOf(o.status);
          return (
            <div key={o.orderId} className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white !p-6 shadow-sm transition hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900 sm:text-base">{o.orderId}</p>
                  <p className="mt-0.5 text-xs text-gray-400">{o.customerName}</p>
                </div>
                <StatusBadge label={meta.label} color={meta.color} />
              </div>

              <div className="flex items-center gap-1 py-2">
                {SHIPPING_STEPS.map((step, idx) => (
                  <div key={step} className="flex flex-1 items-center gap-1">
                    <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${idx <= stepIdx ? "bg-pink-500 text-white" : "bg-gray-100 text-gray-400"}`}>
                      {idx <= stepIdx ? <FiCheck size={12} /> : idx + 1}
                    </div>
                    {idx < SHIPPING_STEPS.length - 1 && <div className={`h-0.5 flex-1 ${idx < stepIdx ? "bg-pink-500" : "bg-gray-100"}`} />}
                  </div>
                ))}
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                <p><span className="text-gray-400">ขนส่ง:</span> {o.carrier || "ยังไม่ระบุ"}</p>
                <p><span className="text-gray-400">เลขพัสดุ:</span> {o.trackingNumber || "ยังไม่ระบุ"}</p>
                <p><span className="text-gray-400">ยอดรวม:</span> <span className="font-semibold text-gray-900">{currency(o.total)}</span></p>
              </div>

              <button onClick={() => { setSelected(o); setCarrier(o.carrier || ""); setTracking(o.trackingNumber || ""); }} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-pink-50 py-2.5 px-4 text-xs font-semibold text-pink-600 transition hover:bg-pink-500 hover:text-white">
                <FiTruck size={14} /> จัดการการจัดส่ง
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShippingManage;