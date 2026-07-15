import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { FiPlus, FiSearch, FiUserCheck, FiShield } from "react-icons/fi";
import Modal from "./components/Modal";
import StatusBadge from "./components/StatusBadge";
import { fetchStaffAccounts, createStaffAccount } from "./services/staffAccountService";

const EMPTY_FORM = { name: "", email: "", password: "", role: "Staff" };

const StaffAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const loadData = async () => {
    setLoading(true);
    try {
      const accounts = await fetchStaffAccounts();
      setAccounts(accounts);
    } catch (err) {
      Swal.fire({ icon: "error", title: "โหลดข้อมูลไม่สำเร็จ", text: err.message, confirmButtonColor: "#ec4899" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    return accounts.filter((a) => {
      const q = search.toLowerCase();
      return !q || a.name?.toLowerCase().includes(q) || a.email?.toLowerCase().includes(q);
    });
  }, [accounts, search]);

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      Swal.fire({ icon: "warning", title: "กรุณากรอกข้อมูลให้ครบ", confirmButtonColor: "#ec4899" });
      return;
    }
    if (form.password.length < 6) {
      Swal.fire({ icon: "warning", title: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร", confirmButtonColor: "#ec4899" });
      return;
    }
    setSaving(true);
    try {
      await createStaffAccount(form);
      setModalOpen(false);
      await loadData();
      Swal.fire({ icon: "success", title: "สร้างบัญชีสำเร็จ", confirmButtonColor: "#ec4899", timer: 1300, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "สร้างบัญชีไม่สำเร็จ", text: err.message, confirmButtonColor: "#ec4899" });
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
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาชื่อ / อีเมล"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 !pl-10 pr-3 text-sm outline-none focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100"
            />
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-600"
        >
          <FiPlus size={16} /> สร้างบัญชีพนักงาน
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-xs uppercase text-gray-400">
                <th className="!px-6 !py-4 font-medium">ชื่อ</th>
                <th className="!px-6 !py-4 font-medium">อีเมล</th>
                <th className="!px-6 !py-4 font-medium">สิทธิ์การใช้งาน</th>
                <th className="!px-6 !py-4 font-medium">สร้างเมื่อ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((a) => (
                <tr key={a.email} className="text-gray-700 hover:bg-pink-50/30">
                  <td className="!px-6 !py-4">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${a.role === "Admin" ? "bg-violet-100 text-violet-600" : "bg-blue-100 text-blue-600"}`}>
                        {a.role === "Admin" ? <FiShield size={15} /> : <FiUserCheck size={15} />}
                      </div>
                      <span className="font-medium text-gray-900">{a.name || "-"}</span>
                    </div>
                  </td>
                  <td className="!px-6 !py-4">{a.email}</td>
                  <td className="!px-6 !py-4">
                    <StatusBadge label={a.role} color={a.role === "Admin" ? "purple" : "blue"} />
                  </td>
                  <td className="!px-6 !py-4 text-gray-500">{a.createdAt ? dayjs(a.createdAt).format("D MMM YYYY HH:mm") : "-"}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="!px-6 !py-10 text-center text-gray-400">ยังไม่มีบัญชีพนักงาน</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={4} className="!px-6 !py-10 text-center text-gray-400">กำลังโหลด...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="สร้างบัญชีพนักงานใหม่">
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
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              required
            />
          </div>
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
          <div>
            <label className="mb-1 block text-xs font-semibold text-gray-500">สิทธิ์การใช้งาน</label>
            <div className="grid grid-cols-2 gap-2">
              {["Staff", "Admin"].map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setForm({ ...form, role: r })}
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    form.role === r ? "border-pink-500 bg-pink-50 text-pink-600" : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {r === "Admin" ? "ผู้ดูแลระบบ" : "พนักงาน"}
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
              {saving ? "กำลังบันทึก..." : "สร้างบัญชี"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StaffAccounts;
