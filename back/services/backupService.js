// services/backupService.js
// ระบบสำรองข้อมูล (Backup) — รวมไฟล์ข้อมูลทั้งหมดใน back/data (users, products, categories,
// checkout_orders, ฯลฯ) มาเขียนเป็นไฟล์ JSON ชุดเดียว เก็บไว้ในเครื่อง (back/backups)
// พร้อมฟังก์ชันดูรายการ/ลบไฟล์เก่า
//
// หมายเหตุ: หลังจากย้ายบัญชีผู้ใช้ออกจาก Firebase มาเก็บใน back/data/users.json แล้ว
// ระบบ backup นี้จะอ่านทุกไฟล์ .json ใน back/data โดยอัตโนมัติ (ไม่ต้องแก้โค้ดเพิ่มเวลามีไฟล์ข้อมูลใหม่)

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { getAllUsers, saveAllUsers, getAllCheckoutOrders, saveAllCheckoutOrders } from "../utils/jsonStore.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const BACKUP_DIR = path.join(__dirname, "..", "backups");
const DATA_DIR = path.join(__dirname, "..", "data");

// จำนวนไฟล์ backup สูงสุดที่เก็บไว้ (กันดิสก์เต็ม) — ลบไฟล์เก่าสุดทิ้งเมื่อเกิน
const MAX_BACKUPS = 30;

const PREFIX = "backup-";
const EXT = ".json";

// แปลงเวลาปัจจุบันเป็นชื่อไฟล์ที่ปลอดภัย เช่น backup-2026-07-15T10-30-00-000Z.json
function buildFileName(date = new Date()) {
  const iso = date.toISOString().replace(/[:.]/g, "-");
  return `${PREFIX}${iso}${EXT}`;
}

async function ensureBackupDir() {
  await fs.mkdir(BACKUP_DIR, { recursive: true });
}

// ==========================================
// สำรองข้อมูลทั้งหมดจาก back/data/*.json → ไฟล์ backup รวมไฟล์เดียว
// ==========================================
export async function runBackup() {
  await ensureBackupDir();

  await fs.mkdir(DATA_DIR, { recursive: true });
  const entries = await fs.readdir(DATA_DIR);
  const jsonFiles = entries.filter((name) => name.endsWith(".json"));

  const data = {};
  for (const fileName of jsonFiles) {
    const key = fileName.replace(/\.json$/, "");
    try {
      const raw = await fs.readFile(path.join(DATA_DIR, fileName), "utf-8");
      data[key] = JSON.parse(raw);
    } catch (err) {
      data[key] = null; // ไฟล์อ่านไม่ได้/parse ไม่ได้ ก็ยังบันทึก backup ต่อไปได้ ไม่ให้ทั้งชุดพัง
    }
  }

  const fileName = buildFileName();
  const filePath = path.join(BACKUP_DIR, fileName);

  const payload = {
    createdAt: new Date().toISOString(),
    source: "local-data (back/data)",
    data,
  };

  await fs.writeFile(filePath, JSON.stringify(payload, null, 2), "utf-8");

  await pruneOldBackups();

  const stat = await fs.stat(filePath);
  return {
    fileName,
    size: stat.size,
    createdAt: payload.createdAt,
  };
}

// ==========================================
// ลบไฟล์ backup เก่าที่เกินจำนวนสูงสุดที่กำหนด (เก็บไฟล์ล่าสุดไว้)
// ==========================================
async function pruneOldBackups() {
  const files = await listBackupFiles();
  if (files.length <= MAX_BACKUPS) return;

  const toDelete = files
    .sort((a, b) => a.createdAt - b.createdAt) // เก่าสุดก่อน
    .slice(0, files.length - MAX_BACKUPS);

  await Promise.all(
    toDelete.map((f) => fs.unlink(path.join(BACKUP_DIR, f.fileName)).catch(() => {}))
  );
}

async function listBackupFiles() {
  await ensureBackupDir();
  const entries = await fs.readdir(BACKUP_DIR);
  const files = entries.filter((name) => name.startsWith(PREFIX) && name.endsWith(EXT));

  const stats = await Promise.all(
    files.map(async (fileName) => {
      const stat = await fs.stat(path.join(BACKUP_DIR, fileName));
      return { fileName, size: stat.size, createdAt: stat.mtime };
    })
  );

  return stats;
}

// ==========================================
// ดึงรายการไฟล์ backup ทั้งหมด (ใหม่ → เก่า) สำหรับหน้า Admin
// ==========================================
export async function listBackups() {
  const files = await listBackupFiles();
  return files
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((f) => ({
      fileName: f.fileName,
      size: f.size,
      createdAt: f.createdAt.toISOString(),
    }));
}

// ==========================================
// ตรวจสอบชื่อไฟล์ก่อนดาวน์โหลด กัน Path Traversal (เช่น ../../../etc/passwd)
// คืนค่า path เต็มถ้าถูกต้อง หรือ null ถ้าไม่ผ่านการตรวจสอบ
// ==========================================
export function resolveBackupFilePath(fileName) {
  const safe = /^backup-[0-9T:\-.]+Z\.json$/i.test(fileName) || /^backup-[\w\-.]+\.json$/i.test(fileName);
  if (!safe) return null;

  const filePath = path.join(BACKUP_DIR, fileName);
  if (path.dirname(filePath) !== BACKUP_DIR) return null; // กันหลุดออกนอกโฟลเดอร์ backups

  return filePath;
}

// ==========================================
// ลบไฟล์ backup ที่เลือกทิ้ง (ใช้ path ที่ผ่านการตรวจสอบจาก resolveBackupFilePath แล้วเท่านั้น)
// ==========================================
export async function deleteBackup(fileName) {
  const filePath = resolveBackupFilePath(fileName);
  if (!filePath) {
    const err = new Error("ชื่อไฟล์ไม่ถูกต้อง");
    err.status = 400;
    throw err;
  }

  try {
    await fs.unlink(filePath);
  } catch (err) {
    if (err.code === "ENOENT") {
      const notFound = new Error("ไม่พบไฟล์สำรองข้อมูลนี้");
      notFound.status = 404;
      throw notFound;
    }
    throw err;
  }
}

// ==========================================
// อ่าน + parse ไฟล์ backup ที่เลือก (ใช้ร่วมกันระหว่าง restoreBackup / previewBackup / restoreSelected)
// ==========================================
async function readBackupPayload(fileName) {
  const filePath = resolveBackupFilePath(fileName);
  if (!filePath) {
    const err = new Error("ชื่อไฟล์ไม่ถูกต้อง");
    err.status = 400;
    throw err;
  }

  let raw;
  try {
    raw = await fs.readFile(filePath, "utf-8");
  } catch (err) {
    if (err.code === "ENOENT") {
      const notFound = new Error("ไม่พบไฟล์สำรองข้อมูลนี้");
      notFound.status = 404;
      throw notFound;
    }
    throw err;
  }

  try {
    return JSON.parse(raw);
  } catch {
    const invalid = new Error("ไฟล์สำรองข้อมูลเสียหาย อ่านไม่ได้");
    invalid.status = 400;
    throw invalid;
  }
}

// ==========================================
// กู้คืนข้อมูลจากไฟล์ backup ที่เลือก — เขียนทับไฟล์ใน back/data/*.json ทั้งหมด
// ก่อนเขียนทับ จะสร้าง backup ของข้อมูลปัจจุบันไว้ก่อนเสมอ (safety net เผื่อกู้ผิดไฟล์)
// ==========================================
export async function restoreBackup(fileName) {
  const payload = await readBackupPayload(fileName);
  const data = payload.data || {};

  // สำรองข้อมูลปัจจุบันไว้ก่อนเขียนทับเสมอ กันพลาดกู้ผิดไฟล์แล้วข้อมูลปัจจุบันหาย
  const safetySnapshot = await runBackup();

  await fs.mkdir(DATA_DIR, { recursive: true });
  const restoredFiles = [];

  for (const [key, value] of Object.entries(data)) {
    if (value === null) continue; // ไฟล์ต้นฉบับตอน backup อ่าน/parse ไม่ได้ ข้ามไป ไม่เขียนทับด้วยค่าว่าง
    if (!/^[a-zA-Z0-9_-]+$/.test(key)) continue; // กันชื่อไฟล์แปลกปลอม

    const targetPath = path.join(DATA_DIR, `${key}.json`);
    await fs.writeFile(targetPath, JSON.stringify(value, null, 2), "utf-8");
    restoredFiles.push(`${key}.json`);
  }

  return {
    fileName,
    restoredFiles,
    restoredAt: new Date().toISOString(),
    safetySnapshotFileName: safetySnapshot.fileName,
  };
}

// ==========================================
// ดูตัวอย่างเนื้อหาในไฟล์ backup แบบสรุป — เอาไว้ให้ Admin เลือกเป็นรายบัญชี/รายออเดอร์
// แทนที่จะกู้คืนทั้งไฟล์ (ไม่ดึงข้อมูลอื่นมาแสดง เพื่อไม่ให้ response ใหญ่เกินจำเป็น)
// ==========================================
export async function previewBackup(fileName) {
  const payload = await readBackupPayload(fileName);
  const data = payload.data || {};

  const backupUsers = data.users || {};
  const users = Object.entries(backupUsers).map(([key, u]) => ({
    key,
    email: u?.email || key,
    name: u?.name || "-",
    role: u?.role || "Customer",
    status: u?.status || "active",
  }));

  const backupOrders = Array.isArray(data.checkout_orders) ? data.checkout_orders : [];
  const orders = backupOrders.map((o) => ({
    orderId: o?.orderId,
    userId: o?.userId || "-",
    status: o?.status || "-",
    paymentStatus: o?.paymentStatus || "-",
    grandTotal: o?.grandTotal ?? 0,
    createdAt: o?.createdAt || null,
  }));

  return {
    fileName,
    createdAt: payload.createdAt,
    users,
    orders,
  };
}

// ==========================================
// กู้คืนแบบเลือกรายการ — เอาเฉพาะบัญชีผู้ใช้ (userKeys) และ/หรือออเดอร์ (orderIds) ที่เลือก
// จากไฟล์ backup มา "เขียนทับเฉพาะรายการนั้น" ในข้อมูลปัจจุบัน โดยไม่แตะรายการอื่น
// ==========================================
export async function restoreSelected(fileName, { userKeys = [], orderIds = [] } = {}) {
  const payload = await readBackupPayload(fileName);
  const data = payload.data || {};

  const backupUsers = data.users || {};
  const backupOrders = Array.isArray(data.checkout_orders) ? data.checkout_orders : [];

  // สำรองข้อมูลปัจจุบันไว้ก่อนเขียนทับเสมอ กันพลาดกู้ผิดรายการแล้วของเดิมหาย
  const safetySnapshot = await runBackup();

  const restoredUserKeys = [];
  if (userKeys.length > 0) {
    const currentUsers = getAllUsers();
    for (const key of userKeys) {
      if (backupUsers[key]) {
        currentUsers[key] = backupUsers[key];
        restoredUserKeys.push(key);
      }
    }
    if (restoredUserKeys.length > 0) saveAllUsers(currentUsers);
  }

  const restoredOrderIds = [];
  if (orderIds.length > 0) {
    const currentOrders = getAllCheckoutOrders();
    for (const orderId of orderIds) {
      const backupOrder = backupOrders.find((o) => o?.orderId === orderId);
      if (!backupOrder) continue;

      const index = currentOrders.findIndex((o) => o?.orderId === orderId);
      if (index === -1) currentOrders.push(backupOrder);
      else currentOrders[index] = backupOrder;

      restoredOrderIds.push(orderId);
    }
    if (restoredOrderIds.length > 0) saveAllCheckoutOrders(currentOrders);
  }

  return {
    fileName,
    restoredUserKeys,
    restoredOrderIds,
    restoredAt: new Date().toISOString(),
    safetySnapshotFileName: safetySnapshot.fileName,
  };
}
