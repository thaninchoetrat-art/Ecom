import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { FiSearch, FiPackage, FiClock, FiAlertTriangle, FiPlus, FiTrash2 } from "react-icons/fi";
import Modal from "./components/Modal";
import { fetchProducts, addProduct, deleteProduct, fetchCategories, isCompanyProduct } from "../products/productService";
import {
  fetchInventoryLogs,
  adjustStock,
  LOW_STOCK_THRESHOLD,
  MOVEMENT_TYPES,
} from "./services/inventoryService";

const EMPTY_PRODUCT_FORM = { productName: "", categoryId: "", brand: "", price: "", discountPrice: "", stock: "", image: "", description: "" };

const InventoryManage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [target, setTarget] = useState(null);
  const [form, setForm] = useState({ type: "in", qty: "", reason: "" });

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_PRODUCT_FORM);
  const [saving, setSaving] = useState(false);

  const loadData = () => {
    // 🟢 คลังสินค้าของ staff จัดการเฉพาะสินค้าของบริษัทเอง (source: company) เท่านั้น
    // ไม่รวมสินค้าที่ลูกค้าลงขายเอง (source: customer) แยกออกจากกันชัดเจน
    setProducts(fetchProducts().filter(isCompanyProduct));
    setCategories(fetchCategories());
    setLogs(fetchInventoryLogs());
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.productName?.toLowerCase().includes(search.toLowerCase());
      const matchLow = !onlyLowStock || Number(p.stock) <= LOW_STOCK_THRESHOLD;
      return matchSearch && matchLow;
    });
  }, [products, search, onlyLowStock]);

  const openAdjust = (product) => {
    setTarget(product);
    setForm({ type: "in", qty: "", reason: "" });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.qty || Number(form.qty) < 0) {
      Swal.fire({ icon: "warning", title: "กรุณาระบุจำนวนให้ถูกต้อง", confirmButtonColor: "#ec4899" });
      return;
    }
    adjustStock({
      productId: target.productId,
      type: form.type,
      qty: form.qty,
      reason: form.reason,
    });
    setModalOpen(false);
    loadData();
    Swal.fire({ icon: "success", title: "ปรับสต็อกสำเร็จ", confirmButtonColor: "#ec4899", timer: 1300, showConfirmButton: false });
  };

  const handleDeleteProduct = async (product) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "ลบสินค้านี้?",
      text: `${product.productName || "สินค้านี้"} จะถูกลบออกจากระบบถาวร (รวมถึงสต็อกด้วย)`,
      showCancelButton: true,
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
    });
    if (!result.isConfirmed) return;
    deleteProduct(product.productId);
    loadData();
    Swal.fire({ icon: "success", title: "ลบสินค้าแล้ว", confirmButtonColor: "#ec4899", timer: 1200, showConfirmButton: false });
  };

  const openAddProduct = () => {
    setAddForm(EMPTY_PRODUCT_FORM);
    setAddModalOpen(true);
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!addForm.productName || !addForm.price) {
      Swal.fire({ icon: "warning", title: "กรุณากรอกชื่อสินค้าและราคา", confirmButtonColor: "#ec4899" });
      return;
    }
    setSaving(true);
    try {
      // 🟢 สินค้าที่ staff ลงในหน้าคลังนี้ ถือเป็นสินค้าของบริษัทเสมอ (source: company)
      addProduct({ ...addForm, source: "company" });
      setAddModalOpen(false);
      loadData();
      Swal.fire({ icon: "success", title: "เพิ่มสินค้าใหม่สำเร็จ", confirmButtonColor: "#ec4899", timer: 1300, showConfirmButton: false });
    } finally {
      setSaving(false);
    }
  };

  const lowStockCount = products.filter((p) => Number(p.stock) <= LOW_STOCK_THRESHOLD).length;
  const outOfStockCount = products.filter((p) => Number(p.stock) === 0).length;

  return (
    <div className="flex w-full flex-col gap-6 !p-6 md:!p-8 !mx-auto !max-w-7xl">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white !p-5 shadow-sm">
          <p className="text-xs text-gray-400">สินค้าของบริษัททั้งหมด</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{products.length}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 !p-5 shadow-sm">
          <p className="text-xs text-amber-600">ใกล้หมดสต็อก (≤ {LOW_STOCK_THRESHOLD})</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{lowStockCount}</p>
        </div>
        <div className="rounded-2xl border border-red-100 bg-red-50 !p-5 shadow-sm">
          <p className="text-xs text-red-500">สินค้าหมดสต็อก</p>
          <p className="mt-1 text-2xl font-bold text-red-500">{outOfStockCount}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white !p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาสินค้า"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 !pl-10 pr-3 text-sm outline-none focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100"
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={onlyLowStock}
              onChange={(e) => setOnlyLowStock(e.target.checked)}
              className="h-4 w-4 accent-pink-500"
            />
            แสดงเฉพาะสินค้าใกล้หมด
          </label>
        </div>
        <button
          onClick={openAddProduct}
          className="flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-600"
        >
          <FiPlus size={16} /> เพิ่มสินค้าใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm xl:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-xs uppercase text-gray-400">
                  <th className="!px-6 !py-4 font-medium">สินค้า</th>
                  <th className="!px-6 !py-4 font-medium">สต็อกคงเหลือ</th>
                  <th className="!px-6 !py-4 font-medium">สถานะ</th>
                  <th className="!px-6 !py-4 text-right font-medium">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((p) => {
                  const stock = Number(p.stock) || 0;
                  const isOut = stock === 0;
                  const isLow = !isOut && stock <= LOW_STOCK_THRESHOLD;
                  return (
                    <tr key={p.productId} className="text-gray-700 hover:bg-pink-50/30">
                      <td className="!px-6 !py-4 font-medium text-gray-900">{p.productName || "-"}</td>
                      <td className="!px-6 !py-4">{stock} ชิ้น</td>
                      <td className="!px-6 !py-4">
                        {isOut ? (
                          <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                            <FiAlertTriangle size={12} /> หมดสต็อก
                          </span>
                        ) : isLow ? (
                          <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600">
                            <FiAlertTriangle size={12} /> ใกล้หมด
                          </span>
                        ) : (
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600">
                            ปกติ
                          </span>
                        )}
                      </td>
                      <td className="!px-6 !py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openAdjust(p)}
                            className="flex items-center gap-1.5 rounded-lg bg-pink-50 px-3 py-1.5 text-xs font-semibold text-pink-600 hover:bg-pink-500 hover:text-white"
                          >
                            <FiPackage size={13} /> ปรับสต็อก
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p)}
                            className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                            title="ลบสินค้า"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="!px-6 !py-10 text-center text-gray-400">
                      ไม่พบสินค้า
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white !p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-base font-bold text-gray-900">
            <FiClock className="text-pink-500" /> ประวัติการเคลื่อนไหวล่าสุด
          </h3>
          <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-1">
            {logs.length === 0 && <p className="text-sm text-gray-400">ยังไม่มีประวัติการปรับสต็อก</p>}
            {logs.slice(0, 20).map((log) => (
              <div key={log.id} className="rounded-xl border border-gray-100 !p-4 text-xs">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-semibold text-gray-800">{log.productName}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-bold ${log.type === "in"
                        ? "bg-emerald-50 text-emerald-600"
                        : log.type === "out"
                          ? "bg-red-50 text-red-600"
                          : "bg-blue-50 text-blue-600"
                      }`}
                  >
                    {MOVEMENT_TYPES[log.type]?.label}
                  </span>
                </div>
                <p className="text-gray-500">
                  {log.stockBefore} → {log.stockAfter} ชิ้น {log.reason && `· ${log.reason}`}
                </p>
                <p className="mt-1 text-gray-400">{dayjs(log.date).format("D MMM YYYY HH:mm")}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ปรับสต็อกสินค้าที่มีอยู่แล้ว */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={target ? `ปรับสต็อก: ${target.productName}` : ""}
      >
        {target && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-gray-500">
              สต็อกปัจจุบัน:{" "}
              <span className="font-bold text-gray-800">{target.stock ?? 0} ชิ้น</span>
            </p>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">ประเภทการปรับ</label>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(MOVEMENT_TYPES).map(([key, v]) => (
                  <button
                    type="button"
                    key={key}
                    onClick={() => setForm({ ...form, type: key })}
                    className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${form.type === key
                        ? "border-pink-500 bg-pink-50 text-pink-600"
                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">
                {form.type === "adjust" ? "จำนวนสต็อกใหม่" : "จำนวน"}
              </label>
              <input
                type="number"
                min="0"
                required
                value={form.qty}
                onChange={(e) => setForm({ ...form, qty: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">เหตุผล / หมายเหตุ</label>
              <input
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="เช่น รับสินค้าเข้าคลัง, สินค้าชำรุด"
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
            <div className="mt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="rounded-xl bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-pink-200 hover:bg-pink-600"
              >
                บันทึกการปรับสต็อก
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* เพิ่มสินค้าใหม่ (ของบริษัทเอง) */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)} title="เพิ่มสินค้าใหม่ (ของบริษัท)" width="max-w-xl">
        <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">ชื่อสินค้า</label>
            <input
              value={addForm.productName}
              onChange={(e) => setAddForm({ ...addForm, productName: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">หมวดหมู่</label>
              <select
                value={addForm.categoryId}
                onChange={(e) => setAddForm({ ...addForm, categoryId: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              >
                <option value="">ไม่ระบุ</option>
                {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">แบรนด์</label>
              <input
                value={addForm.brand}
                onChange={(e) => setAddForm({ ...addForm, brand: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">ราคา</label>
              <input
                type="number"
                min="0"
                value={addForm.price}
                onChange={(e) => setAddForm({ ...addForm, price: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">ราคาส่วนลด</label>
              <input
                type="number"
                min="0"
                value={addForm.discountPrice}
                onChange={(e) => setAddForm({ ...addForm, discountPrice: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">สต็อกเริ่มต้น</label>
              <input
                type="number"
                min="0"
                value={addForm.stock}
                onChange={(e) => setAddForm({ ...addForm, stock: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">ลิงก์รูปภาพ</label>
            <input
              value={addForm.image}
              onChange={(e) => setAddForm({ ...addForm, image: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">รายละเอียดสินค้า</label>
            <textarea
              value={addForm.description}
              onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setAddModalOpen(false)}
              className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-pink-200 hover:bg-pink-600 disabled:opacity-60"
            >
              {saving ? "กำลังบันทึก..." : "เพิ่มสินค้า"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InventoryManage;
