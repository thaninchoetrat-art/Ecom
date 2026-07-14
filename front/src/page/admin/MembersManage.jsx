import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUser } from "react-icons/fi";
import Modal from "./components/Modal";
import StatusBadge from "./components/StatusBadge";
import { fetchMembers, addMember, updateMember, deleteMember } from "../products/productService";

const EMPTY_FORM = { name: "", email: "", phone: "", role: "Customer", status: "active" };

const MembersManage = () => {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadData = () => setMembers(fetchMembers());
  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchSearch = !search || m.name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase());
      const matchRole = !roleFilter || m.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [members, search, roleFilter]);

  return (
    /* ปรับปรุง: เพิ่ม !p-6 md:!p-8 !mx-auto !max-w-7xl ที่กล่องนอกสุดของหน้าสมาชิก */
    <div className="flex w-full flex-col gap-6 !p-6 md:!p-8 !mx-auto !max-w-7xl">
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white !p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาชื่อ / อีเมล" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 !pl-10 pr-3..." />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none">
            <option value="">ทุกสิทธิ์การใช้งาน</option>
            <option value="Customer">Customer</option>
            <option value="Admin">Admin</option>
          </select>
        </div>
        <button onClick={() => { setEditingId(null); setForm(EMPTY_FORM); setModalOpen(true); }} className="flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-600">
          <FiPlus size={16} /> เพิ่มสมาชิก
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-xs uppercase text-gray-400">
                <th className="!px-6 !py-4 font-medium">สมาชิก</th>
                <th className="!px-6 !py-4 font-medium">เบอร์โทร</th>
                <th className="!px-6 !py-4 font-medium">สิทธิ์การใช้งาน</th>
                <th className="!px-6 !py-4 font-medium">สถานะ</th>
                <th className="!px-6 !py-4 font-medium">วันที่สมัคร</th>
                <th className="!px-6 !py-4 text-right font-medium">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((m) => (
                <tr key={m.id} className="text-gray-700 hover:bg-pink-50/30">
                  <td className="!px-6 !py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pink-100 text-pink-500"><FiUser size={15} /></div>
                      <div>
                        <p className="font-medium text-gray-900">{m.name || "-"}</p>
                        <p className="text-xs text-gray-400">{m.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="!px-6 !py-4">{m.phone || "-"}</td>
                  <td className="!px-6 !py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m.role === "Admin" ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"}`}>{m.role || "Customer"}</span></td>
                  <td className="!px-6 !py-4"><StatusBadge label={m.status === "active" ? "ใช้งานอยู่" : "ระงับการใช้งาน"} color={m.status === "active" ? "green" : "red"} /></td>
                  <td className="!px-6 !py-4 text-gray-500">{m.joinedAt ? dayjs(m.joinedAt).format("D MMM YYYY") : "-"}</td>
                  <td className="!px-6 !py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => { setEditingId(m.id); setForm(m); setModalOpen(true); }} className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"><FiEdit2 size={15} /></button>
                      <button onClick={() => deleteMember(m.id)} className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"><FiTrash2 size={15} /></button>
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

export default MembersManage;