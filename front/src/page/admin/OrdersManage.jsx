import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { FiSearch, FiEye, FiTrash2 } from "react-icons/fi";
import Modal from "./components/Modal";
import StatusBadge from "./components/StatusBadge";
import { fetchOrders, deleteOrder, updateOrderStatus, ORDER_STATUS } from "./services/orderService";

const currency = (n) => `฿${Number(n || 0).toLocaleString("th-TH")}`;

const OrdersManage = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState(null);
  const [noteInput, setNoteInput] = useState("");

  const loadData = () => setOrders(fetchOrders());
  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch = !search || o.orderId.toLowerCase().includes(search.toLowerCase()) || o.customerName?.toLowerCase().includes(search.toLowerCase());
      const matchStatus = !statusFilter || o.status === statusFilter;
      return matchSearch && matchStatus;
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, search, statusFilter]);

  // ฟังก์ชันแก้ไขปัญหาระบบลบคำสั่งซื้อ
  const handleDelete = async (order) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "ลบคำสั่งซื้อนี้?",
      text: `คำสั่งซื้อ ${order.orderId} จะถูกลบออกจากระบบถาวร`,
      showCancelButton: true,
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
    });
    
    if (result.isConfirmed) {
      deleteOrder(order.orderId); // ลบข้อมูลใน Local Storage
      loadData(); // ดึงข้อมูลชุดใหม่มาอัปเดตหน้าจอทันที (แก้ไข UI ค้าง)
      Swal.fire({ icon: "success", title: "ลบคำสั่งซื้อแล้ว", confirmButtonColor: "#ec4899", timer: 1200, showConfirmButton: false });
    }
  };

  const handleUpdateStatus = (order, status) => {
    updateOrderStatus(order.orderId, status, noteInput || `อัปเดตสถานะเป็น ${ORDER_STATUS[status]?.label}`);
    loadData();
    setSelected((prev) => (prev ? fetchOrders().find((o) => o.orderId === prev.orderId) : null));
    setNoteInput("");
    Swal.fire({ icon: "success", title: "อัปเดตสถานะแล้ว", confirmButtonColor: "#ec4899", timer: 1200, showConfirmButton: false });
  };

  return (
    <div className="flex w-full flex-col gap-6 !p-6 md:!p-8 !mx-auto !max-w-7xl">
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white !p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหารหัสคำสั่งซื้อ / ชื่อลูกค้า" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 !pl-10 pr-3 text-sm outline-none focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100">
            <option value="">ทุกสถานะ</option>
            {Object.entries(ORDER_STATUS).map(([key, v]) => <option key={key} value={key}>{v.label}</option>)}
          </select>
        </div>
        <div className="text-sm text-gray-400">ทั้งหมด {filtered.length} คำสั่งซื้อ</div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-xs uppercase text-gray-400">
                <th className="!px-6 !py-4 font-medium">รหัสคำสั่งซื้อ</th>
                <th className="!px-6 !py-4 font-medium">ลูกค้า</th>
                <th className="!px-6 !py-4 font-medium">รายการ</th>
                <th className="!px-6 !py-4 font-medium">ยอดรวม</th>
                <th className="!px-6 !py-4 font-medium">การชำระเงิน</th>
                <th className="!px-6 !py-4 font-medium">สถานะ</th>
                <th className="!px-6 !py-4 font-medium">วันที่สั่งซื้อ</th>
                <th className="!px-6 !py-4 text-right font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((o) => {
                const meta = ORDER_STATUS[o.status] || { label: o.status, color: "gray" };
                return (
                  <tr key={o.orderId} className="text-gray-700 hover:bg-pink-50/30">
                    <td className="!px-6 !py-4 font-semibold text-gray-900">{o.orderId}</td>
                    <td className="!px-6 !py-4">{o.customerName}</td>
                    <td className="!px-6 !py-4">{(o.items || []).length} รายการ</td>
                    <td className="!px-6 !py-4 font-semibold">{currency(o.total)}</td>
                    <td className="!px-6 !py-4"><StatusBadge label={o.paymentStatus === "paid" ? "ชำระแล้ว" : "ยังไม่ชำระ"} color={o.paymentStatus === "paid" ? "green" : "amber"} /></td>
                    <td className="!px-6 !py-4"><StatusBadge label={meta.label} color={meta.color} /></td>
                    <td className="!px-6 !py-4 text-gray-500">{dayjs(o.createdAt).format("D MMM YYYY HH:mm")}</td>
                    <td className="!px-6 !py-4">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => { setSelected(o); setNoteInput(""); }} className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"><FiEye size={15} /></button>
                        {/* เรียกใช้ฟังก์ชัน handleDelete เพื่อให้ยืนยันการลบและอัปเดตหน้าจอทันที */}
                        <button onClick={() => handleDelete(o)} className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"><FiTrash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="!px-6 !py-10 text-center text-gray-400">ไม่พบคำสั่งซื้อ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* เพิ่มคืนค่าระบบเปิดดูรายละเอียด (Modal) ที่หลุดหายไปก่อนหน้า */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected ? `รายละเอียดคำสั่งซื้อ ${selected.orderId}` : ""} width="max-w-2xl">
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-400">ลูกค้า</p>
                <p className="font-medium text-gray-800">{selected.customerName}</p>
                <p className="text-xs text-gray-500">{selected.customerEmail}</p>
                <p className="text-xs text-gray-500">{selected.customerPhone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">ที่อยู่จัดส่ง</p>
                <p className="text-gray-700">{selected.shippingAddress || "-"}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-gray-400">รายการสินค้า</p>
              <div className="divide-y divide-gray-100 rounded-xl border border-gray-100">
                {(selected.items || []).map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <span className="text-gray-700">{it.productName} <span className="text-gray-400">x{it.qty}</span></span>
                    <span className="font-medium text-gray-800">{currency(it.price * it.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-col items-end gap-1 text-sm text-gray-600">
                <span>ค่าจัดส่ง: {currency(selected.shippingFee)}</span>
                <span className="text-base font-bold text-gray-900">ยอดรวม: {currency(selected.total)}</span>
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase text-gray-400">ประวัติสถานะ</p>
              <div className="flex flex-col gap-2">
                {(selected.statusHistory || []).slice().reverse().map((h, idx) => {
                  const meta = ORDER_STATUS[h.status] || { label: h.status, color: "gray" };
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <StatusBadge label={meta.label} color={meta.color} />
                        <span className="text-gray-400">{h.note}</span>
                      </div>
                      <span className="text-gray-400">{dayjs(h.date).format("D MMM HH:mm")}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-gray-100 p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-gray-400">อัปเดตสถานะคำสั่งซื้อ</p>
              <input value={noteInput} onChange={(e) => setNoteInput(e.target.value)} placeholder="หมายเหตุ (ไม่บังคับ)" className="mb-3 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100" />
              <div className="flex flex-wrap gap-2">
                {Object.entries(ORDER_STATUS).map(([key, v]) => (
                  <button key={key} onClick={() => handleUpdateStatus(selected, key)} disabled={selected.status === key} className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${selected.status === key ? "cursor-not-allowed bg-gray-100 text-gray-400" : "bg-pink-50 text-pink-600 hover:bg-pink-500 hover:text-white"}`}>{v.label}</button>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersManage;