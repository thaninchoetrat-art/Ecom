import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiUser } from "react-icons/fi";
import Modal from "./components/Modal";
import StatusBadge from "./components/StatusBadge";
import { fetchAccounts, createAccount, updateAccount, deleteAccount } from "./services/staffAccountService";

const EMPTY_FORM = { name: "", email: "", phone: "", role: "Customer", status: "active", password: "" };
const ROLES = ["Customer", "Staff", "Admin"];

const MembersManage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingEmail, setEditingEmail] = useState(null); // null = สร้างใหม่, มีค่า = แก้ไข
  const [form, setForm] = useState(EMPTY_FORM);

  const loadData = async () => {
    setLoading(true);
    try {
      const accounts = await fetchAccounts();
      setMembers(accounts);
    } catch (err) {
      Swal.fire({ icon: "error", title: "โหลดข้อมูลไม่สำเร็จ", text: err.message, confirmButtonColor: "#ec4899" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      const matchSearch = !search || m.name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase());
      const matchRole = !roleFilter || m.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [members, search, roleFilter]);

  const openCreate = () => {
    setEditingEmail(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (m) => {
    setEditingEmail(m.email);
    setForm({ name: m.name || "", email: m.email, phone: m.phone || "", role: m.role || "Customer", status: m.status || "active", password: "" });
    setModalOpen(true);
  };

  const handleDelete = async (m) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "ลบบัญชีนี้?",
      text: `บัญชี ${m.email} จะถูกลบออกจากระบบถาวร`,
      showCancelButton: true,
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteAccount(m.email);
      await loadData();
      Swal.fire({ icon: "success", title: "ลบบัญชีแล้ว", confirmButtonColor: "#ec4899", timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "ลบบัญชีไม่สำเร็จ", text: err.message, confirmButtonColor: "#ec4899" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      Swal.fire({ icon: "warning", title: "กรุณากรอกชื่อและอีเมล", confirmButtonColor: "#ec4899" });
      return;
    }

    setSaving(true);
    try {
      if (editingEmail) {
        await updateAccount(editingEmail, { name: form.name, phone: form.phone, role: form.role, status: form.status });
      } else {
        if (!form.password || form.password.length < 6) {
          Swal.fire({ icon: "warning", title: "กรุณาตั้งรหัสผ่านอย่างน้อย 6 ตัวอักษร", confirmButtonColor: "#ec4899" });
          setSaving(false);
          return;
        }
        await createAccount(form);
      }
      setModalOpen(false);
      await loadData();
      Swal.fire({ icon: "success", title: editingEmail ? "แก้ไขบัญชีสำเร็จ" : "สร้างบัญชีสำเร็จ", confirmButtonColor: "#ec4899", timer: 1300, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "บันทึกไม่สำเร็จ", text: err.message, confirmButtonColor: "#ec4899" });
    } finally {
      setSaving(false);
    }
  };

  return (
    /* ปรับปรุง: เพิ่ม !p-6 md:!p-8 !mx-auto !max-w-7xl ที่กล่องนอกสุดของหน้าสมาชิก */
    <div className="flex w-full flex-col gap-6 !p-6 md:!p-8 !mx-auto !max-w-7xl">
      <div className="flex flex-col gap-3 rounded-2xl border border-gray-100 bg-white !p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <div className="relative flex-1 sm:max-w-xs">
            <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="ค้นหาชื่อ / อีเมล" className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 !pl-10 pr-3 text-sm outline-none focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100" />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none">
            <option value="">ทุกสิทธิ์การใช้งาน</option>
            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <button onClick={openCreate} className="flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-600">
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
                <tr key={m.email} className="text-gray-700 hover:bg-pink-50/30">
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
                  <td className="!px-6 !py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${m.role === "Admin" ? "bg-violet-50 text-violet-600" : m.role === "Staff" ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"}`}>{m.role || "Customer"}</span></td>
                  <td className="!px-6 !py-4"><StatusBadge label={m.status === "active" ? "ใช้งานอยู่" : "ระงับการใช้งาน"} color={m.status === "active" ? "green" : "red"} /></td>
                  <td className="!px-6 !py-4 text-gray-500">{m.createdAt ? dayjs(m.createdAt).format("D MMM YYYY") : "-"}</td>
                  <td className="!px-6 !py-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(m)} className="rounded-lg p-2 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"><FiEdit2 size={15} /></button>
                      <button onClick={() => handleDelete(m)} className="rounded-lg p-2 text-gray-400 transition hover:bg-red-50 hover:text-red-600"><FiTrash2 size={15} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="!px-6 !py-10 text-center text-gray-400">ยังไม่มีสมาชิก</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={6} className="!px-6 !py-10 text-center text-gray-400">กำลังโหลด...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingEmail ? `แก้ไขสมาชิก: ${editingEmail}` : "เพิ่มสมาชิกใหม่"}>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">ชื่อ-นามสกุล</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">อีเมล</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={!!editingEmail}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 disabled:bg-gray-100 disabled:text-gray-400"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">เบอร์โทร</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>
          {!editingEmail && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-gray-500">รหัสผ่าน (อย่างน้อย 6 ตัวอักษร)</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                required
              />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">สิทธิ์การใช้งาน</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setForm({ ...form, role: r })}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                    form.role === r ? "border-pink-500 bg-pink-50 text-pink-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">สถานะ</label>
            <div className="grid grid-cols-2 gap-2">
              {[["active", "ใช้งานอยู่"], ["suspended", "ระงับการใช้งาน"]].map(([val, label]) => (
                <button
                  type="button"
                  key={val}
                  onClick={() => setForm({ ...form, status: val })}
                  className={`rounded-lg border px-2 py-2 text-xs font-semibold transition ${
                    form.status === val ? "border-pink-500 bg-pink-50 text-pink-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
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
              disabled={saving}
              className="rounded-xl bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-pink-200 hover:bg-pink-600 disabled:opacity-60"
            >
              {saving ? "กำลังบันทึก..." : editingEmail ? "บันทึกการแก้ไข" : "สร้างบัญชี"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default MembersManage;
