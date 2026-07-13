import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiImage } from "react-icons/fi";
import Modal from "./components/Modal";
import { fetchProducts, addProduct, updateProduct, deleteProduct, fetchCategories } from "../products/productService";

const EMPTY_FORM = { productName: "", categoryId: "", brand: "", price: "", discountPrice: "", stock: "", image: "", description: "" };
const currency = (n) => `฿${Number(n || 0).toLocaleString("th-TH")}`;

const ProductsManage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

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

  return (
    <div className="flex w-full flex-col gap-6 !p-6 md:!p-8 !mx-auto !max-w-7xl">
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white !p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาชื่อสินค้า / แบรนด์" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 !pl-10 pr-3..." />
          </div>
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none">
            <option value="">ทุกหมวดหมู่</option>
            {categories.map((c) => <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>)}
          </select>
        </div>
        <button onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); }} className="flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-600">
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
                      <button onClick={() => { setEditingId(p.productId); setForm(p); setModalOpen(true); }} className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"><FiEdit2 size={15} /></button>
                      <button onClick={() => deleteProduct(p.productId)} className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductsManage;