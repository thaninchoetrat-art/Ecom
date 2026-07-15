// controllers/backupController.js
// จัดการ Backup ข้อมูล — เฉพาะ Admin เท่านั้น (กันไว้ที่ route ด้วย verifyToken + requireRole('Admin'))

import fs from "fs";
import {
  runBackup,
  listBackups,
  resolveBackupFilePath,
  deleteBackup,
  restoreBackup,
  previewBackup,
  restoreSelected,
} from "../services/backupService.js";

// ==========================================
// 1. ดึงรายการไฟล์ backup ทั้งหมด (ใหม่ → เก่า)
// ==========================================
export async function getBackups(req, res, next) {
  try {
    const backups = await listBackups();
    res.status(200).json({ ok: true, backups });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// 2. สั่งสำรองข้อมูลทันที (Manual Backup) — ใช้เสริมนอกเหนือจากตารางเวลาอัตโนมัติ
// ==========================================
export async function triggerBackup(req, res, next) {
  try {
    const result = await runBackup();
    res.status(201).json({
      ok: true,
      message: `สำรองข้อมูลสำเร็จ: ${result.fileName}`,
      backup: result,
    });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// 3. ดาวน์โหลดไฟล์ backup ที่เลือก
// ==========================================
export async function downloadBackup(req, res, next) {
  try {
    const { fileName } = req.params;
    const filePath = resolveBackupFilePath(fileName);

    if (!filePath || !fs.existsSync(filePath)) {
      return res.status(404).json({ ok: false, message: "ไม่พบไฟล์สำรองข้อมูลนี้" });
    }

    res.download(filePath, fileName);
  } catch (error) {
    next(error);
  }
}

// ==========================================
// 4. ลบไฟล์ backup ที่เลือก
// ==========================================
export async function removeBackup(req, res, next) {
  try {
    const { fileName } = req.params;
    await deleteBackup(fileName);
    res.status(200).json({ ok: true, message: "ลบไฟล์สำรองข้อมูลสำเร็จ" });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ ok: false, message: error.message });
    }
    next(error);
  }
}

// ==========================================
// 5. กู้คืนข้อมูลจากไฟล์ backup ที่เลือก (เขียนทับข้อมูลปัจจุบันทั้งหมด)
// ==========================================
export async function restoreBackupHandler(req, res, next) {
  try {
    const { fileName } = req.params;
    const result = await restoreBackup(fileName);
    res.status(200).json({
      ok: true,
      message: `กู้คืนข้อมูลจาก ${fileName} สำเร็จ (${result.restoredFiles.length} ไฟล์)`,
      restore: result,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ ok: false, message: error.message });
    }
    next(error);
  }
}

// ==========================================
// 6. ดูตัวอย่างเนื้อหาในไฟล์ backup (รายชื่อบัญชี + รายการออเดอร์) สำหรับกู้คืนแบบเลือกรายการ
// ==========================================
export async function getBackupPreview(req, res, next) {
  try {
    const { fileName } = req.params;
    const preview = await previewBackup(fileName);
    res.status(200).json({ ok: true, preview });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ ok: false, message: error.message });
    }
    next(error);
  }
}

// ==========================================
// 7. กู้คืนแบบเลือกรายการ — เฉพาะบัญชีผู้ใช้ / ออเดอร์ที่เลือกเท่านั้น
// ==========================================
export async function restoreSelectedHandler(req, res, next) {
  try {
    const { fileName } = req.params;
    const { userKeys, orderIds } = req.body;
    const result = await restoreSelected(fileName, { userKeys, orderIds });

    res.status(200).json({
      ok: true,
      message: `กู้คืนสำเร็จ: บัญชี ${result.restoredUserKeys.length} รายการ, ออเดอร์ ${result.restoredOrderIds.length} รายการ`,
      restore: result,
    });
  } catch (error) {
    if (error.status) {
      return res.status(error.status).json({ ok: false, message: error.message });
    }
    next(error);
  }
}
