import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage } from "react-icons/fi";
import Modal from "./components/Modal";
import { fetchProducts, addProduct, updateProduct, deleteProduct, fetchCategories, uploadProductImage } from "../products/productService";

const EMPTY_FORM = { productName: "", categoryId: "", brand: "", price: "", discountPrice: "", stock: "", image: "", description: "" };
const currency = (n) => `฿${Number(n || 0).toLocaleString("th-TH")}`;

const ProductsManage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadData = () => {
    setProducts(fetchProducts());
    setCategories(fetchCategories());
  };

  useEffect(() => { loadData(); }, []);

  const categoryName = (id) => categories.find((c) => c.categoryId === id)?.categoryName || "ไม่ระบุหมวดหมู่";

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = !search || p.productName?.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !categoryFilter || p.categoryId === categoryFilter;
      return matchSearch && matchCategory;
    });
  }, [products, search, categoryFilter]);

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditingId(p.productId);
    setForm({ ...EMPTY_FORM, ...p });
    setModalOpen(true);
  };

  const handleDelete = async (p) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "ลบสินค้านี้?",
      text: `${p.productName || "สินค้านี้"} จะถูกลบออกจากระบบถาวร`,
      showCancelButton: true,
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
    });
    if (!result.isConfirmed) return;
    deleteProduct(p.productId);
    loadData();
    Swal.fire({ icon: "success", title: "ลบสินค้าแล้ว", confirmButtonColor: "#ec4899", timer: 1200, showConfirmButton: false });
  };

  const handleImageFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      Swal.fire({ icon: "warning", title: "กรุณาเลือกไฟล์รูปภาพเท่านั้น", confirmButtonColor: "#ec4899" });
      e.target.value = "";
      return;
    }

    setUploadingImage(true);
    try {
      const imageUrl = await uploadProductImage(file);
      setForm((f) => ({ ...f, image: imageUrl }));
    } catch (err) {
      Swal.fire({ icon: "error", title: "อัปโหลดรูปไม่สำเร็จ", text: err.message, confirmButtonColor: "#ec4899" });
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.productName || !form.price) {
      Swal.fire({ icon: "warning", title: "กรุณากรอกชื่อสินค้าและราคา", confirmButtonColor: "#ec4899" });
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        updateProduct(editingId, form);
      } else {
        addProduct(form);
      }
      setModalOpen(false);
      loadData();
      Swal.fire({ icon: "success", title: editingId ? "แก้ไขสินค้าสำเร็จ" : "เพิ่มสินค้าสำเร็จ", confirmButtonColor: "#ec4899", timer: 1300, showConfirmButton: false });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 !p-6 md:!p-8 !mx-auto !max-w-7xl">
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white !p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาชื่อสินค้า / แบรนด์" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 !pl-10 pr-3 text-sm outline-none focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100" />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none">
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
          </select>
        </div>
        <button onClick={openCreate} className="flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-600">
          <FiPlus size={16} /> เพิ่มสินค้า
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-xs uppercase text-gray-400">
                <th className="!px-6 !py-4 font-medium">สินค้า</th>
                <th className="!px-6 !py-4 font-medium">หมวดหมู่</th>
                <th className="!px-6 !py-4 font-medium">แบรนด์</th>
                <th className="!px-6 !py-4 font-medium">ราคา</th>
                <th className="!px-6 !py-4 font-medium">สต็อก</th>
                <th className="!px-6 !py-4 text-right font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p.productId} className="text-gray-700 hover:bg-pink-50/30">
                  <td className="!px-6 !py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100">
                        {p.image ? <img src={p.image} alt={p.productName} className="h-full w-full object-cover" /> : <FiImage className="text-gray-300" />}
                      </div>
                      <span className="max-w-[180px] truncate font-medium text-gray-900">{p.productName || "ไม่มีชื่อ"}</span>
                    </div>
                  </td>
                  <td className="!px-6 !py-4">{categoryName(p.categoryId)}</td>
                  <td className="!px-6 !py-4">{p.brand || "-"}</td>
                  <td className="!px-6 !py-4">
                    {p.discountPrice > 0 && p.discountPrice < p.price ? (
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 line-through">{currency(p.price)}</span>
                        <span className="font-semibold text-pink-600">{currency(p.discountPrice)}</span>
                      </div>
                    ) : <span className="font-semibold text-gray-800">{currency(p.price)}</span>}
                  </td>
                  <td className="!px-6 !py-4">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${Number(p.stock) === 0 ? "bg-red-50 text-red-600" : Number(p.stock) <= 5 ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}>
                      {p.stock ?? 0} ชิ้น
                    </span>
                  </td>
                  <td className="!px-6 !py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"><FiEdit2 size={15} /></button>
                      <button onClick={() => handleDelete(p)} className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="!px-6 !py-10 text-center text-gray-400">ยังไม่มีสินค้า</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"} width="max-w-xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">ชื่อสินค้า</label>
            <input
              value={form.productName}
              onChange={(e) => setForm({ ...form, productName: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">หมวดหมู่</label>
              <select
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              >
                <option value="">ไม่ระบุ</option>
                {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">แบรนด์</label>
              <input
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
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
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">ราคาส่วนลด</label>
              <input
                type="number"
                min="0"
                value={form.discountPrice}
                onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">สต็อก</label>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">รูปภาพสินค้า</label>
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                {form.image ? (
                  <img src={form.image} alt="ตัวอย่างรูปสินค้า" className="h-full w-full object-cover" />
                ) : (
                  <FiImage className="text-gray-300" size={22} />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFile}
                  disabled={uploadingImage}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-pink-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-pink-600 hover:file:bg-pink-100 disabled:opacity-60"
                />
                <p className="mt-1 text-xs text-gray-400">
                  {uploadingImage ? "กำลังอัปโหลดรูป..." : "รองรับไฟล์ JPG, PNG"}
                </p>
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">รายละเอียดสินค้า</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
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
              disabled={saving || uploadingImage}
              className="rounded-xl bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-pink-200 hover:bg-pink-600 disabled:opacity-60"
            >
              {saving ? "กำลังบันทึก..." : editingId ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProductsManage;
