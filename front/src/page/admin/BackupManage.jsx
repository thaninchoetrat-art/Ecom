// front/src/page/admin/BackupManage.jsx
// 🟢 หน้าสำรอง/กู้คืนข้อมูล (path: /admin/backup) — เฉพาะ Admin เท่านั้น
// เรียกใช้ admin/services/backupService.js ซึ่งยิงไปที่ back/controllers/backupController.js
// ฟังก์ชันหลัก: fetchBackups, runBackupNow, downloadBackup, deleteBackup,
// restoreBackup (กู้คืนทั้งหมด), previewBackup + restoreSelected (กู้คืนเฉพาะรายการที่เลือก)
// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - formatSize() — บรรทัด 27
// - BackupManage() — บรรทัด 41
// - loadData() — บรรทัด 57
// - handleRunBackup() — บรรทัด 76
// - handleDownload() — บรรทัด 89
// - handleRestore() — บรรทัด 100
// - openSelectModal() — บรรทัด 130
// - closeSelectModal() — บรรทัด 146
// - toggleUserKey() — บรรทัด 153
// - toggleOrderId() — บรรทัด 157
// - handleConfirmRestoreSelected() — บรรทัด 161
// - handleDelete() — บรรทัด 201

import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import { FiDatabase, FiDownload, FiRefreshCw, FiTrash2, FiRotateCcw, FiList } from "react-icons/fi";
import Modal from "./components/Modal";
import { fetchBackups, runBackupNow, downloadBackup, deleteBackup, restoreBackup, previewBackup, restoreSelected } from "./services/backupService";

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};


const ORIGIN_TABS = [
  { key: "all", label: "ทั้งหมด" },
  { key: "staff", label: "Staff" },
  { key: "customer", label: "Customer" },
];

const BackupManage = () => {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [restoring, setRestoring] = useState(null);
  const [originTab, setOriginTab] = useState("all");

  const [selectModal, setSelectModal] = useState(null); 
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewData, setPreviewData] = useState({ users: [], orders: [] });
  const [selectedUserKeys, setSelectedUserKeys] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [restoringSelected, setRestoringSelected] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const backups = await fetchBackups();
      setBackups(backups);
    } catch (err) {
      Swal.fire({ icon: "error", title: "โหลดข้อมูลไม่สำเร็จ", text: err.message, confirmButtonColor: "#ec4899" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filteredBackups = useMemo(() => {
    if (originTab === "customer") return [];
    return backups;
  }, [backups, originTab]);

  const handleRunBackup = async () => {
    setRunning(true);
    try {
      await runBackupNow();
      await loadData();
      Swal.fire({ icon: "success", title: "สำรองข้อมูลสำเร็จ", confirmButtonColor: "#ec4899", timer: 1300, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "สำรองข้อมูลไม่สำเร็จ", text: err.message, confirmButtonColor: "#ec4899" });
    } finally {
      setRunning(false);
    }
  };

  const handleDownload = async (fileName) => {
    setDownloading(fileName);
    try {
      await downloadBackup(fileName);
    } catch (err) {
      Swal.fire({ icon: "error", title: "ดาวน์โหลดไม่สำเร็จ", text: err.message, confirmButtonColor: "#ec4899" });
    } finally {
      setDownloading(null);
    }
  };

  const handleRestore = async (fileName) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "กู้คืนข้อมูลจากไฟล์นี้?",
      html: `ข้อมูล<b>ปัจจุบันทั้งหมด</b>จะถูกเขียนทับด้วยข้อมูลใน <b>${fileName}</b><br/><span style="font-size:12px;color:#9ca3af">ระบบจะสำรองข้อมูลปัจจุบันไว้ก่อนอัตโนมัติ เผื่อกู้ผิดไฟล์สามารถย้อนกลับได้</span>`,
      showCancelButton: true,
      confirmButtonText: "ยืนยันกู้คืน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
    });
    if (!result.isConfirmed) return;

    setRestoring(fileName);
    try {
      const restoreResult = await restoreBackup(fileName);
      await loadData();
      Swal.fire({
        icon: "success",
        title: "กู้คืนข้อมูลสำเร็จ",
        text: `กู้คืน ${restoreResult.restoredFiles.length} ไฟล์ (สำรองข้อมูลเดิมไว้ที่ ${restoreResult.safetySnapshotFileName})`,
        confirmButtonColor: "#ec4899",
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "กู้คืนไม่สำเร็จ", text: err.message, confirmButtonColor: "#ec4899" });
    } finally {
      setRestoring(null);
    }
  };

  const openSelectModal = async (fileName) => {
    setSelectModal(fileName);
    setSelectedUserKeys([]);
    setSelectedOrderIds([]);
    setPreviewLoading(true);
    try {
      const preview = await previewBackup(fileName);
      setPreviewData({ users: preview.users || [], orders: preview.orders || [] });
    } catch (err) {
      Swal.fire({ icon: "error", title: "โหลดตัวอย่างข้อมูลไม่สำเร็จ", text: err.message, confirmButtonColor: "#ec4899" });
      setSelectModal(null);
    } finally {
      setPreviewLoading(false);
    }
  };

  const closeSelectModal = () => {
    setSelectModal(null);
    setPreviewData({ users: [], orders: [] });
    setSelectedUserKeys([]);
    setSelectedOrderIds([]);
  };

  const toggleUserKey = (key) => {
    setSelectedUserKeys((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const toggleOrderId = (orderId) => {
    setSelectedOrderIds((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]));
  };

  const handleConfirmRestoreSelected = async () => {
    const totalSelected = selectedUserKeys.length + selectedOrderIds.length;
    if (totalSelected === 0) {
      Swal.fire({ icon: "warning", title: "กรุณาเลือกอย่างน้อย 1 รายการ", confirmButtonColor: "#ec4899" });
      return;
    }

    const result = await Swal.fire({
      icon: "warning",
      title: "กู้คืนรายการที่เลือก?",
      html: `บัญชี <b>${selectedUserKeys.length}</b> รายการ และออเดอร์ <b>${selectedOrderIds.length}</b> รายการ จะถูกเขียนทับด้วยข้อมูลจาก <b>${selectModal}</b><br/><span style="font-size:12px;color:#9ca3af">ระบบจะสำรองข้อมูลปัจจุบันไว้ก่อนอัตโนมัติ</span>`,
      showCancelButton: true,
      confirmButtonText: "ยืนยันกู้คืน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
    });
    if (!result.isConfirmed) return;

    setRestoringSelected(true);
    try {
      const restoreResult = await restoreSelected(selectModal, {
        userKeys: selectedUserKeys,
        orderIds: selectedOrderIds,
      });
      closeSelectModal();
      await loadData();
      Swal.fire({
        icon: "success",
        title: "กู้คืนสำเร็จ",
        text: `บัญชี ${restoreResult.restoredUserKeys.length} รายการ, ออเดอร์ ${restoreResult.restoredOrderIds.length} รายการ (สำรองข้อมูลเดิมไว้ที่ ${restoreResult.safetySnapshotFileName})`,
        confirmButtonColor: "#ec4899",
      });
    } catch (err) {
      Swal.fire({ icon: "error", title: "กู้คืนไม่สำเร็จ", text: err.message, confirmButtonColor: "#ec4899" });
    } finally {
      setRestoringSelected(false);
    }
  };

  const handleDelete = async (fileName) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "ลบไฟล์สำรองข้อมูลนี้?",
      text: `${fileName} จะถูกลบออกถาวร กู้คืนไม่ได้`,
      showCancelButton: true,
      confirmButtonText: "ลบเลย",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#9ca3af",
    });
    if (!result.isConfirmed) return;

    setDeleting(fileName);
    try {
      await deleteBackup(fileName);
      await loadData();
      Swal.fire({ icon: "success", title: "ลบไฟล์แล้ว", confirmButtonColor: "#ec4899", timer: 1200, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "ลบไม่สำเร็จ", text: err.message, confirmButtonColor: "#ec4899" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex w-full flex-col gap-6 !p-6 md:!p-8 !mx-auto !max-w-7xl">
      {/* 🟢 แท็บแยกที่มา: Staff เท่านั้น (Customer ไม่มีสิทธิ์เข้าหน้านี้ จึงไม่มีไฟล์ในกลุ่มนี้) */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-gray-100 bg-white !p-2 shadow-sm">
        {ORIGIN_TABS.map((tab) => {
          const count = tab.key === "all" ? backups.length : tab.key === "staff" ? backups.length : 0;
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
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-100 text-pink-600">
            <FiDatabase size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">สำรองข้อมูลระบบ</h2>
            <p className="text-xs text-gray-400">สำรองข้อมูลทั้งหมดอัตโนมัติทุกวัน เวลา 03:00 น. และเก็บย้อนหลังสูงสุด 30 ไฟล์</p>
          </div>
        </div>
        <button
          onClick={handleRunBackup}
          disabled={running}
          className="flex items-center justify-center gap-2 rounded-xl bg-pink-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-pink-600 disabled:opacity-60"
        >
          <FiRefreshCw size={16} className={running ? "animate-spin" : ""} />
          {running ? "กำลังสำรองข้อมูล..." : "สำรองข้อมูลตอนนี้"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60 text-left text-xs uppercase text-gray-400">
                <th className="!px-6 !py-4 font-medium">ชื่อไฟล์</th>
                <th className="!px-6 !py-4 font-medium">วันที่สร้าง</th>
                <th className="!px-6 !py-4 font-medium">ขนาดไฟล์</th>
                <th className="!px-6 !py-4 font-medium">ที่มา</th>
                <th className="!px-6 !py-4 font-medium text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredBackups.map((b) => (
                <tr key={b.fileName} className="text-gray-700 hover:bg-pink-50/30">
                  <td className="!px-6 !py-4 font-medium text-gray-900">{b.fileName}</td>
                  <td className="!px-6 !py-4 text-gray-500">{dayjs(b.createdAt).format("D MMM YYYY HH:mm")}</td>
                  <td className="!px-6 !py-4 text-gray-500">{formatSize(b.size)}</td>
                  <td className="!px-6 !py-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-semibold text-violet-600">Staff</span>
                  </td>
                  <td className="!px-6 !py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openSelectModal(b.fileName)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <FiList size={13} />
                        เลือกกู้คืน
                      </button>
                      <button
                        onClick={() => handleRestore(b.fileName)}
                        disabled={restoring === b.fileName}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-amber-300 hover:bg-amber-50 hover:text-amber-600 disabled:opacity-60"
                      >
                        <FiRotateCcw size={13} />
                        {restoring === b.fileName ? "กำลังกู้คืน..." : "กู้คืนทั้งหมด"}
                      </button>
                      <button
                        onClick={() => handleDownload(b.fileName)}
                        disabled={downloading === b.fileName}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600 disabled:opacity-60"
                      >
                        <FiDownload size={13} />
                        {downloading === b.fileName ? "กำลังโหลด..." : "ดาวน์โหลด"}
                      </button>
                      <button
                        onClick={() => handleDelete(b.fileName)}
                        disabled={deleting === b.fileName}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
                      >
                        <FiTrash2 size={13} />
                        {deleting === b.fileName ? "กำลังลบ..." : "ลบ"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filteredBackups.length === 0 && (
                <tr>
                  <td colSpan={5} className="!px-6 !py-10 text-center text-gray-400">ยังไม่มีไฟล์สำรองข้อมูล</td>
                </tr>
              )}
              {loading && (
                <tr>
                  <td colSpan={5} className="!px-6 !py-10 text-center text-gray-400">กำลังโหลด...</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={selectModal !== null}
        onClose={closeSelectModal}
        title={`เลือกกู้คืนจาก ${selectModal || ""}`}
        width="max-w-2xl"
      >
        {previewLoading ? (
          <div className="!py-10 text-center text-sm text-gray-400">กำลังโหลดตัวอย่างข้อมูล...</div>
        ) : (
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase text-gray-400">
                บัญชีผู้ใช้ ({previewData.users.length})
              </h4>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-100">
                {previewData.users.length === 0 && (
                  <p className="!p-4 text-center text-sm text-gray-400">ไม่มีข้อมูลบัญชีในไฟล์นี้</p>
                )}
                {previewData.users.map((u) => (
                  <label
                    key={u.key}
                    className="flex cursor-pointer items-center gap-3 border-b border-gray-50 !px-4 !py-2.5 text-sm last:border-b-0 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedUserKeys.includes(u.key)}
                      onChange={() => toggleUserKey(u.key)}
                      className="h-4 w-4 accent-pink-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{u.name} <span className="text-xs text-gray-400">({u.role})</span></div>
                      <div className="text-xs text-gray-500">{u.email}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-xs font-bold uppercase text-gray-400">
                ออเดอร์ ({previewData.orders.length})
              </h4>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-gray-100">
                {previewData.orders.length === 0 && (
                  <p className="!p-4 text-center text-sm text-gray-400">ไม่มีข้อมูลออเดอร์ในไฟล์นี้</p>
                )}
                {previewData.orders.map((o) => (
                  <label
                    key={o.orderId}
                    className="flex cursor-pointer items-center gap-3 border-b border-gray-50 !px-4 !py-2.5 text-sm last:border-b-0 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.includes(o.orderId)}
                      onChange={() => toggleOrderId(o.orderId)}
                      className="h-4 w-4 accent-pink-500"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{o.orderId}</div>
                      <div className="text-xs text-gray-500">ลูกค้า: {o.userId} · สถานะ: {o.status} / {o.paymentStatus} · ฿{Number(o.grandTotal).toLocaleString("th-TH")}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeSelectModal}
                className="rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmRestoreSelected}
                disabled={restoringSelected}
                className="rounded-xl bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-pink-200 hover:bg-pink-600 disabled:opacity-60"
              >
                {restoringSelected ? "กำลังกู้คืน..." : `กู้คืนที่เลือก (${selectedUserKeys.length + selectedOrderIds.length})`}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BackupManage;
