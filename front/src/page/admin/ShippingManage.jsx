// front/src/page/admin/ShippingManage.jsx
// 🟢 หน้าจัดการการจัดส่ง (path: /admin/shipping)
// แสดงออเดอร์ที่พ้นสถานะ pending/cancelled แล้ว มีแท็บ ทั้งหมด/Staff/Customer
// จัดการบันทึกขนส่ง/เลขพัสดุ (handleSaveShipping) และเปลี่ยนสถานะออเดอร์โดยตรง
// (handleAdvanceStatus) ในหน้าเดียว — ใช้ orderService.js ไฟล์เดียวกับหน้าคำสั่งซื้อ
// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - currency() — บรรทัด 21
// - ShippingManage() — บรรทัด 30
// - loadData() — บรรทัด 39
// - handleSaveShipping() — บรรทัด 63
// - handleAdvanceStatus() — บรรทัด 78

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { FiSearch, FiTruck, FiCheck } from "react-icons/fi";
import Modal from "./components/Modal";
import StatusBadge from "./components/StatusBadge";
import { fetchOrders, updateOrderStatus, ORDER_STATUS, SHIPPING_STEPS, isStaffPlacedOrder } from "./services/orderService";

const currency = (n) => `฿${Number(n || 0).toLocaleString("th-TH")}`;

// 🟢 แยกรายการจัดส่งตามคนที่ทำรายการสั่งซื้อ: Staff/Admin ซื้อเอง VS Customer สั่งเอง
const ORIGIN_TABS = [
  { key: "all", label: "ทั้งหมด" },
  { key: "staff", label: "Staff" },
  { key: "customer", label: "Customer" },
];

const ShippingManage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [originTab, setOriginTab] = useState("all");
  const [selected, setSelected] = useState(null);
  const [carrier, setCarrier] = useState("");
  const [tracking, setTracking] = useState("");
  const [saving, setSaving] = useState(false);

  const loadData = async () => setOrders(await fetchOrders());
  useEffect(() => { loadData(); }, []);

  const shippableAll = useMemo(
    () => orders.filter((o) => o.status !== "pending" && o.status !== "cancelled"),
    [orders]
  );
  const staffCount = useMemo(() => shippableAll.filter(isStaffPlacedOrder).length, [shippableAll]);
  const customerCount = useMemo(() => shippableAll.filter((o) => !isStaffPlacedOrder(o)).length, [shippableAll]);

  const shippable = useMemo(() => {
    return shippableAll
      .filter((o) => {
        const matchSearch = !search || o.orderId.toLowerCase().includes(search.toLowerCase()) || o.customerName?.toLowerCase().includes(search.toLowerCase()) || o.trackingNumber?.toLowerCase().includes(search.toLowerCase());
        const matchOrigin =
          originTab === "all" ||
          (originTab === "staff" && isStaffPlacedOrder(o)) ||
          (originTab === "customer" && !isStaffPlacedOrder(o));
        return matchSearch && matchOrigin;
      })
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [shippableAll, search, originTab]);

  // 🟢 บันทึกบริษัทขนส่ง/เลขพัสดุ โดยไม่เปลี่ยนสถานะคำสั่งซื้อ
  const handleSaveShipping = async () => {
    setSaving(true);
    try {
      const updated = await updateOrderStatus(selected.orderId, selected.status, "", { carrier, trackingNumber: tracking });
      setOrders((prev) => prev.map((o) => (o.orderId === selected.orderId ? updated : o)));
      setSelected(updated);
      Swal.fire({ icon: "success", title: "บันทึกข้อมูลขนส่งแล้ว", confirmButtonColor: "#ec4899", timer: 1200, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: "error", title: "บันทึกไม่สำเร็จ", text: error.message, confirmButtonColor: "#ec4899" });
    } finally {
      setSaving(false);
    }
  };

  // 🟢 กดเปลี่ยนสถานะคำสั่งซื้อโดยตรงจากในหน้านี้เลย (พร้อมแนบขนส่ง/เลขพัสดุปัจจุบันไปด้วย)
  const handleAdvanceStatus = async (status) => {
    setSaving(true);
    try {
      const updated = await updateOrderStatus(selected.orderId, status, `อัปเดตสถานะเป็น ${ORDER_STATUS[status]?.label}`, { carrier, trackingNumber: tracking });
      setOrders((prev) => prev.map((o) => (o.orderId === selected.orderId ? updated : o)));
      setSelected(updated);
      Swal.fire({ icon: "success", title: "อัปเดตสถานะแล้ว", confirmButtonColor: "#ec4899", timer: 1200, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: "error", title: "อัปเดตสถานะไม่สำเร็จ", text: error.message, confirmButtonColor: "#ec4899" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 !p-6 md:!p-8 !mx-auto !max-w-7xl">
      {/* 🟢 แท็บแยกที่มาของคำสั่งซื้อ: Staff (ซื้อเอง) VS Customer (สั่งเอง) */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-gray-100 bg-white !p-2 shadow-sm">
        {ORIGIN_TABS.map((tab) => {
          const count = tab.key === "all" ? shippableAll.length : tab.key === "staff" ? staffCount : customerCount;
          const isActive = originTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setOriginTab(tab.key)}
              className={`flex items-center gap-2 rounded-xl !px-4 !py-2 text-sm font-semibold transition ${
                isActive ? "bg-pink-500 text-white shadow-sm" : "text-gray-500 hover:bg-pink-50 hover:text-pink-600"
              }`}
            >
              {tab.label}
              <span className={`rounded-full !px-2 text-xs font-bold ${isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white !p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหารหัสคำสั่งซื้อ / ลูกค้า / เลขพัสดุ" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 !pl-10 pr-3 text-sm outline-none focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100" />
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
                <div className="flex flex-col items-end gap-1.5">
                  <StatusBadge label={meta.label} color={meta.color} />
                  {isStaffPlacedOrder(o) ? (
                    <span className="rounded-full bg-violet-50 px-2 py-0.5 text-[10px] font-bold text-violet-600">Staff</span>
                  ) : (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Customer</span>
                  )}
                </div>
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
                {o.lastUpdatedBy && <p><span className="text-gray-400">อัปเดตล่าสุดโดย:</span> {o.lastUpdatedBy}</p>}
              </div>

              <button onClick={() => { setSelected(o); setCarrier(o.carrier || ""); setTracking(o.trackingNumber || ""); }} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-pink-50 py-2.5 px-4 text-xs font-semibold text-pink-600 transition hover:bg-pink-500 hover:text-white">
                <FiTruck size={14} /> จัดการการจัดส่ง
              </button>
            </div>
          );
        })}
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `จัดการการจัดส่ง: ${selected.orderId}` : ""}
        width="max-w-lg"
      >
        {selected && (
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">บริษัทขนส่ง</label>
              <input
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="เช่น Kerry, Flash, ไปรษณีย์ไทย"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">เลขพัสดุ</label>
              <input
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="หมายเลขติดตามพัสดุ"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveShipping}
              disabled={saving}
              className="rounded-xl border border-pink-200 bg-pink-50 px-4 py-2 text-sm font-semibold text-pink-600 hover:bg-pink-100 disabled:opacity-60"
            >
              บันทึกขนส่ง / เลขพัสดุ
            </button>

            <div className="border-t border-gray-100 pt-4">
              <p className="mb-2 text-xs font-semibold uppercase text-gray-400">อัปเดตสถานะคำสั่งซื้อ</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(ORDER_STATUS).map(([key, v]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleAdvanceStatus(key)}
                    disabled={saving || selected.status === key}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                      selected.status === key
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ShippingManage;
