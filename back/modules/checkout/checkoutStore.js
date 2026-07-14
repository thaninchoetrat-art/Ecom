// ==========================================================================
// checkoutStore.js
// ที่เก็บข้อมูลออเดอร์ของโมดูล "สั่งซื้อสินค้า และชำระเงิน" (Checkout Module)
//
// ตั้งใจแยกเก็บข้อมูลเป็นไฟล์ของตัวเอง (checkout_orders.json) อยู่ภายใน
// โฟลเดอร์ของโมดูลนี้เท่านั้น เพื่อไม่ให้ไปยุ่งหรือพึ่งพาไฟล์ utils/models เดิม
// ของโปรเจกต์ (jsonStore.js, models/Order.js) ตามที่ต้องการให้แยกเป็นโฟลเดอร์
// ของตัวเองแบบสมบูรณ์
// ==========================================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'checkout_orders.json');

function ensureFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(ORDERS_FILE)) {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
  }
}

export function getAllCheckoutOrders() {
  ensureFile();
  try {
    const raw = fs.readFileSync(ORDERS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    console.error('[checkoutStore] อ่านไฟล์ checkout_orders.json ไม่สำเร็จ', err);
    return [];
  }
}

export function saveAllCheckoutOrders(orders) {
  ensureFile();
  fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
}
