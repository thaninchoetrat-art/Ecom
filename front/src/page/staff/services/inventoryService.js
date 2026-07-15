// inventoryService.js
// ระบบตรวจสอบและจัดการคลังสินค้า (Stock Movement) ด้วย Local Storage

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

// ปรับสต็อกสินค้า พร้อมบันทึกประวัติการเคลื่อนไหว
// type: "in" | "out" | "adjust"
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
  };

  const logs = fetchInventoryLogs();
  saveInventoryLogs([log, ...logs]);

  return { newStock, log };
};

export const getLowStockProducts = (threshold = LOW_STOCK_THRESHOLD) =>
  fetchProducts()
    .filter((p) => Number(p.stock) <= threshold)
    .sort((a, b) => Number(a.stock) - Number(b.stock));
