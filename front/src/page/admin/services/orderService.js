// orderService.js
// จัดการข้อมูล "คำสั่งซื้อ" และ "สถานะการจัดส่ง" ด้วย Local Storage

import { fetchProducts, fetchMembers } from "../../products/productService";

const KEYS = { ORDERS: "my_orders" };

export const ORDER_STATUS = {
  pending: { label: "รอดำเนินการ", color: "amber" },
  processing: { label: "กำลังเตรียมสินค้า", color: "blue" },
  packed: { label: "แพ็คสินค้าแล้ว", color: "indigo" },
  shipping: { label: "กำลังจัดส่ง", color: "purple" },
  delivered: { label: "จัดส่งสำเร็จ", color: "green" },
  cancelled: { label: "ยกเลิกคำสั่งซื้อ", color: "red" },
};

export const SHIPPING_STEPS = ["processing", "packed", "shipping", "delivered"];

const uid = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`.toUpperCase();

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

/* ------------------------------ ข้อมูลตัวอย่าง ------------------------------ */

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const buildSeedOrders = () => {
  const products = fetchProducts();
  const members = fetchMembers();

  const fallbackItems = [
    { productId: "demo-1", productName: "เซรั่มวิตามินซี", price: 590, image: "" },
    { productId: "demo-2", productName: "ลิปสติกแมทท์", price: 350, image: "" },
    { productId: "demo-3", productName: "น้ำหอมโรลออน", price: 420, image: "" },
    { productId: "demo-4", productName: "แชมพูสมุนไพร", price: 260, image: "" },
  ];

  const productPool =
    products && products.length > 0
      ? products.map((p) => ({
          productId: p.productId,
          productName: p.productName || "สินค้า",
          price: p.discountPrice || p.price || 0,
          image: p.image || "",
        }))
      : fallbackItems;

  const namePool =
    members && members.length > 0
      ? members.map((m) => ({ name: m.name || "ลูกค้า", email: m.email || "" }))
      : [
          { name: "นภัสสร ใจดี", email: "napat@example.com" },
          { name: "ธนกร รักเรียน", email: "thanakorn@example.com" },
          { name: "ปิยะดา แสงทอง", email: "piyada@example.com" },
          { name: "วรรณวิภา ศรีสุข", email: "wanwipa@example.com" },
        ];

  const statuses = ["pending", "processing", "packed", "shipping", "delivered", "delivered", "cancelled"];
  const now = Date.now();

  return Array.from({ length: 8 }).map((_, idx) => {
    const itemCount = 1 + Math.floor(Math.random() * 2);
    const items = Array.from({ length: itemCount }).map(() => {
      const src = randomFrom(productPool);
      const qty = 1 + Math.floor(Math.random() * 3);
      return { ...src, qty };
    });
    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const shippingFee = subtotal > 990 ? 0 : 50;
    const total = subtotal + shippingFee;
    const status = statuses[idx % statuses.length];
    const customer = randomFrom(namePool);
    const daysAgo = idx * 2 + 1;
    const createdAt = new Date(now - daysAgo * 86400000).toISOString();

    return {
      orderId: uid("ORD"),
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: "08" + Math.floor(10000000 + Math.random() * 89999999),
      shippingAddress: "123/45 ถ.สุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110",
      items,
      subtotal,
      shippingFee,
      total,
      paymentMethod: randomFrom(["โอนเงิน", "บัตรเครดิต", "เก็บเงินปลายทาง"]),
      paymentStatus: status === "cancelled" ? "unpaid" : status === "pending" ? "unpaid" : "paid",
      status,
      carrier: status === "shipping" || status === "delivered" ? randomFrom(["Kerry Express", "Flash Express", "ไปรษณีย์ไทย"]) : "",
      trackingNumber: status === "shipping" || status === "delivered" ? uid("TH") : "",
      statusHistory: [{ status: "pending", note: "สร้างคำสั่งซื้อ", date: createdAt }],
      createdAt,
      updatedAt: createdAt,
    };
  });
};

/* --------------------------------- Orders --------------------------------- */

export const fetchOrders = () => {
  const existing = readKey(KEYS.ORDERS, null);
  if (existing === null) {
    return writeKey(KEYS.ORDERS, buildSeedOrders());
  }
  return existing;
};

export const saveOrders = (data) => writeKey(KEYS.ORDERS, data);

export const addOrder = (order) => {
  const orders = fetchOrders();
  const now = new Date().toISOString();
  const newOrder = {
    orderId: uid("ORD"),
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    shippingAddress: "",
    items: [],
    subtotal: 0,
    shippingFee: 0,
    total: 0,
    paymentMethod: "โอนเงิน",
    paymentStatus: "unpaid",
    status: "pending",
    carrier: "",
    trackingNumber: "",
    statusHistory: [{ status: "pending", note: "สร้างคำสั่งซื้อ", date: now }],
    createdAt: now,
    updatedAt: now,
    ...order,
  };
  saveOrders([newOrder, ...orders]);
  return newOrder;
};

export const updateOrder = (orderId, updates) => {
  const orders = fetchOrders();
  let updated = null;
  const next = orders.map((o) => {
    if (o.orderId === orderId) {
      updated = { ...o, ...updates, orderId, updatedAt: new Date().toISOString() };
      return updated;
    }
    return o;
  });
  saveOrders(next);
  return updated;
};

export const deleteOrder = (orderId) => {
  const orders = fetchOrders();
  const next = orders.filter((o) => o.orderId !== orderId);
  saveOrders(next);
  return next;
};

// อัปเดตสถานะคำสั่งซื้อ / สถานะการจัดส่ง พร้อมบันทึกประวัติ
export const updateOrderStatus = (orderId, status, note = "", extra = {}) => {
  const orders = fetchOrders();
  const now = new Date().toISOString();
  let updated = null;
  const next = orders.map((o) => {
    if (o.orderId === orderId) {
      const history = [...(o.statusHistory || []), { status, note, date: now }];
      updated = {
        ...o,
        ...extra,
        status,
        paymentStatus: status === "cancelled" ? o.paymentStatus : status === "pending" ? o.paymentStatus : "paid",
        statusHistory: history,
        updatedAt: now,
      };
      return updated;
    }
    return o;
  });
  saveOrders(next);
  return updated;
};
