// ==========================================================================
// checkoutController.js
// Logic ของระบบ "สั่งซื้อสินค้า และชำระเงิน" (Checkout & Payment)
//
// หมายเหตุ: ระบบชำระเงินในไฟล์นี้เป็นการ "จำลอง" (simulation) สำหรับใช้งาน
// ในโปรเจกต์การศึกษา ไม่ได้เชื่อมต่อกับผู้ให้บริการชำระเงินจริง และไม่มีการ
// เก็บข้อมูลบัตรฉบับเต็มไว้ที่ฝั่งเซิร์ฟเวอร์
// ==========================================================================
import { v4 as uuidv4 } from 'uuid';
import { getAllCheckoutOrders, saveAllCheckoutOrders } from './checkoutStore.js';

const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING_FEE = 50;

const VALID_PAYMENT_METHODS = ['cod', 'bank_transfer', 'promptpay', 'card'];

// วิธีชำระเงินที่ต้อง "รอ" ให้ลูกค้ายืนยันว่าโอนเงินแล้ว
const METHODS_REQUIRING_CONFIRMATION = ['bank_transfer', 'promptpay'];

function calculateTotals(items, discount = 0) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const shippingFee =
    subtotal > 0 && subtotal < FREE_SHIPPING_THRESHOLD ? STANDARD_SHIPPING_FEE : 0;
  const safeDiscount = Math.max(0, Number(discount) || 0);
  const grandTotal = Math.max(0, subtotal - safeDiscount + shippingFee);

  return { subtotal, shippingFee, discount: safeDiscount, grandTotal };
}

function normalizeItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];

  return rawItems
    .filter((item) => item && item.productId && Number(item.quantity) > 0)
    .map((item) => ({
      productId: item.productId,
      name: item.name || 'ไม่มีชื่อสินค้า',
      image: item.image || '/placeholder.png',
      price: Number(item.price) || 0,
      quantity: Number(item.quantity),
      subtotal: (Number(item.price) || 0) * Number(item.quantity),
    }));
}

function validateAddress(address) {
  if (!address || typeof address !== 'object') return false;
  const required = ['receiverName', 'phone', 'detail', 'province', 'district', 'postalCode'];
  return required.every((field) => String(address[field] || '').trim().length > 0);
}

// ==========================================================================
// POST /api/checkout/orders
// สร้างคำสั่งซื้อใหม่จากตะกร้าสินค้า พร้อมเริ่มขั้นตอนชำระเงิน
// ==========================================================================
export async function createCheckoutOrder(req, res) {
  const { userId, items, shippingAddress, paymentMethod, discount } = req.body;

  const normalizedItems = normalizeItems(items);
  if (normalizedItems.length === 0) {
    return res.status(400).json({ ok: false, message: 'ไม่มีสินค้าในตะกร้าสำหรับสั่งซื้อ' });
  }

  if (!validateAddress(shippingAddress)) {
    return res.status(400).json({ ok: false, message: 'กรุณากรอกที่อยู่จัดส่งให้ครบถ้วน' });
  }

  if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
    return res.status(400).json({ ok: false, message: 'วิธีการชำระเงินไม่ถูกต้อง' });
  }

  const totals = calculateTotals(normalizedItems, discount);
  const requiresConfirmation = METHODS_REQUIRING_CONFIRMATION.includes(paymentMethod);
  const now = new Date().toISOString();

  // - bank_transfer / promptpay: ต้องรอลูกค้ากดยืนยันว่าโอนเงินแล้ว
  // - card: จำลองอนุมัติวงเงินทันที ถือว่าชำระเงินแล้ว
  // - cod: ยืนยันคำสั่งซื้อได้ทันที แต่ยังไม่ถือว่าชำระเงิน (จ่ายปลายทางตอนรับสินค้า)
  let paymentStatus = 'pending';
  if (requiresConfirmation) paymentStatus = 'awaiting_payment';
  else if (paymentMethod === 'card') paymentStatus = 'paid';

  const order = {
    orderId: `ORD-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`,
    userId: userId || 'guest',
    items: normalizedItems,
    shippingAddress,
    paymentMethod,
    ...totals,
    paymentStatus,
    status: requiresConfirmation ? 'pending' : 'confirmed',
    paymentRef: paymentStatus === 'paid' ? `PAY-${uuidv4()}` : null,
    createdAt: now,
    updatedAt: now,
  };

  const orders = getAllCheckoutOrders();
  orders.push(order);
  saveAllCheckoutOrders(orders);

  return res.status(201).json({ ok: true, order });
}

// ==========================================================================
// GET /api/checkout/orders/:orderId
// ==========================================================================
export async function getCheckoutOrder(req, res) {
  const order = getAllCheckoutOrders().find((o) => o.orderId === req.params.orderId);
  if (!order) {
    return res.status(404).json({ ok: false, message: 'ไม่พบคำสั่งซื้อนี้' });
  }
  return res.json({ ok: true, order });
}

// ==========================================================================
// GET /api/checkout/orders/user/:userId
// ==========================================================================
export async function getCheckoutOrdersByUser(req, res) {
  const orders = getAllCheckoutOrders()
    .filter((o) => o.userId === req.params.userId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return res.json({ ok: true, orders });
}

// ==========================================================================
// POST /api/checkout/orders/:orderId/confirm-payment
// ใช้เมื่อลูกค้าเลือกโอนเงิน/พร้อมเพย์ แล้วกดปุ่ม "แจ้งว่าชำระเงินแล้ว"
// ==========================================================================
export async function confirmPayment(req, res) {
  const orders = getAllCheckoutOrders();
  const order = orders.find((o) => o.orderId === req.params.orderId);

  if (!order) {
    return res.status(404).json({ ok: false, message: 'ไม่พบคำสั่งซื้อนี้' });
  }

  if (order.paymentStatus === 'paid') {
    return res.json({ ok: true, order, message: 'คำสั่งซื้อนี้ชำระเงินเรียบร้อยแล้ว' });
  }

  if (order.status === 'cancelled') {
    return res.status(400).json({ ok: false, message: 'คำสั่งซื้อนี้ถูกยกเลิกไปแล้ว' });
  }

  // จำลองการตรวจสอบสลิป/ยอดโอนสำเร็จ
  order.paymentStatus = 'paid';
  order.status = 'confirmed';
  order.paymentRef = `PAY-${uuidv4()}`;
  order.updatedAt = new Date().toISOString();

  saveAllCheckoutOrders(orders);
  return res.json({ ok: true, order, message: 'ยืนยันการชำระเงินสำเร็จ' });
}

// ==========================================================================
// POST /api/checkout/orders/:orderId/cancel
// ==========================================================================
export async function cancelCheckoutOrder(req, res) {
  const orders = getAllCheckoutOrders();
  const order = orders.find((o) => o.orderId === req.params.orderId);

  if (!order) {
    return res.status(404).json({ ok: false, message: 'ไม่พบคำสั่งซื้อนี้' });
  }

  if (['shipped', 'completed'].includes(order.status)) {
    return res.status(400).json({ ok: false, message: 'ไม่สามารถยกเลิกคำสั่งซื้อที่จัดส่งแล้วได้' });
  }

  order.status = 'cancelled';
  order.updatedAt = new Date().toISOString();

  saveAllCheckoutOrders(orders);
  return res.json({ ok: true, order, message: 'ยกเลิกคำสั่งซื้อเรียบร้อยแล้ว' });
}
