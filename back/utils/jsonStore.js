import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, '..', 'data');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export function getDataFilePath(fileName) {
  return path.join(dataDir, `${fileName}.json`);
}

export function readJsonFile(fileName, fallback = []) {
  const filePath = getDataFilePath(fileName);

  if (!fs.existsSync(filePath)) {
    writeJsonFile(fileName, fallback);
    return fallback;
  }

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Failed to read ${fileName}.json`, error);
    return fallback;
  }
}

export function writeJsonFile(fileName, data) {
  const filePath = getDataFilePath(fileName);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  return filePath;
}

/* ===== ฟังก์ชันสำหรับ Checkout ===== */

export function getAllCheckoutOrders() {
  return readJsonFile('checkout_orders', []);
}

export function saveAllCheckoutOrders(orders) {
  writeJsonFile('checkout_orders', orders);
}

/* ===== ฟังก์ชันสำหรับบัญชีผู้ใช้ (users) — ย้ายมาจาก Firebase ===== */
// เก็บเป็น object คีย์ = อีเมลที่เข้ารหัส (แทน '.' ด้วย ',') เหมือนโครงสร้างเดิมใน Firebase
// เพื่อให้ authController.js แก้โค้ดน้อยที่สุด

export function getAllUsers() {
  return readJsonFile('users', {});
}

export function saveAllUsers(users) {
  writeJsonFile('users', users);
}