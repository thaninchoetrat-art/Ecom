// front/src/page/admin/services/inventoryService.js
// 🟢 จัดการสต็อกสินค้า + ประวัติการเคลื่อนไหว (เก็บ log ใน localStorage คีย์ my_inventory_logs)
// adjustStock: ปรับสต็อกเอง (actor: Staff), logAutoDeduction: บันทึกอัตโนมัติตอนลูกค้าสั่งซื้อ
// (actor: Customer) ใช้โดย InventoryManage.jsx และ dashboardService.js (getLowStockProducts)
// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - uid() — บรรทัด 27
// - readKey() — บรรทัด 29
// - writeKey() — บรรทัด 39
// - fetchInventoryLogs() — บรรทัด 44
// - saveInventoryLogs() — บรรทัด 45
// - adjustStock() — บรรทัด 47
// - logAutoDeduction() — บรรทัด 81
// - getLowStockProducts() — บรรทัด 101

import { fetchProducts, updateProduct } from "../../products/productService";

const KEYS = { LOGS: "my_inventory_logs" };

export const LOW_STOCK_THRESHOLD = 5;

export const MOVEMENT_TYPES = {
  in: { label: "รับเข้าสต็อก", sign: 1 },
  out: { label: "ตัดออกจากสต็อก", sign: -1 },
  adjust: { label: "ปรับยอดสต็อก", sign: 0 },
};

const uid = () => `LOG-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const readKey = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`อ่านข้อมูล ${key} ไม่สำเร็จ`, err);
    return fallback;
  }
};

const writeKey = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  return data;
};

export const fetchInventoryLogs = () => readKey(KEYS.LOGS, []);
export const saveInventoryLogs = (data) => writeKey(KEYS.LOGS, data);

export const adjustStock = ({ productId, type, qty, reason }) => {
  const products = fetchProducts();
  const product = products.find((p) => p.productId === productId);
  if (!product) return null;

  const currentStock = Number(product.stock) || 0;
  let newStock = currentStock;

  if (type === "in") newStock = currentStock + Number(qty);
  else if (type === "out") newStock = Math.max(0, currentStock - Number(qty));
  else if (type === "adjust") newStock = Math.max(0, Number(qty));

  updateProduct(productId, { stock: newStock });

  const log = {
    id: uid(),
    productId,
    productName: product.productName,
    type,
    qty: type === "adjust" ? newStock - currentStock : Number(qty),
    stockBefore: currentStock,
    stockAfter: newStock,
    reason: reason || "-",
    date: new Date().toISOString(),

    actor: "Staff",
  };

  const logs = fetchInventoryLogs();
  saveInventoryLogs([log, ...logs]);

  return { newStock, log };
};

export const logAutoDeduction = ({ productId, productName, qty, stockBefore, stockAfter, orderId }) => {
  const log = {
    id: uid(),
    productId,
    productName,
    type: "out",
    qty: Number(qty),
    stockBefore,
    stockAfter,
    reason: orderId ? `หักสต็อกจากคำสั่งซื้อ ${orderId}` : "หักสต็อกจากคำสั่งซื้อ",
    date: new Date().toISOString(),
    actor: "Customer",
  };

  const logs = fetchInventoryLogs();
  saveInventoryLogs([log, ...logs]);

  return log;
};

export const getLowStockProducts = (threshold = LOW_STOCK_THRESHOLD) =>
  fetchProducts()
    .filter((p) => Number(p.stock) <= threshold)
    .sort((a, b) => Number(a.stock) - Number(b.stock));
