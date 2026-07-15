// back/controllers/orderController.js
import { v4 as uuidv4 } from 'uuid';
import { getAllCheckoutOrders, saveAllCheckoutOrders } from '../utils/jsonStore.js';

// เวอร์ชัน 1: ให้ Admin อ่าน/เขียนออเดอร์จากไฟล์ checkout_orders.json โดยตรง
// (ไฟล์เดียวกับที่ checkoutController.js ใช้บันทึกออเดอร์จริงตอนลูกค้า checkout)

export async function listOrders(req, res) {
  const orders = getAllCheckoutOrders()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(orders);
}

export async function createOrder(req, res) {
  const orders = getAllCheckoutOrders();
  const order = {
    orderId: req.body.orderId || `ORD-${Date.now()}-${uuidv4().slice(0, 6).toUpperCase()}`,
    userId: req.body.userId,
    items: req.body.items || [],
    total: Number(req.body.total) || 0,
    discount: Number(req.body.discount) || 0,
    shippingFee: Number(req.body.shippingFee) || 0,
    grandTotal: Number(req.body.grandTotal) || 0,
    status: req.body.status || 'Pending',
    paymentMethod: req.body.paymentMethod || 'Cash',
    shippingAddress: req.body.shippingAddress || '',
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  saveAllCheckoutOrders(orders);
  return res.status(201).json(order);
}

// 🟢 เพิ่มฟังก์ชันสำหรับอัปเดตคำสั่งซื้อ (สถานะ / หมายเหตุ / ขนส่ง / เลขพัสดุ / การชำระเงิน)
// ใช้ทั้งหน้า "คำสั่งซื้อ" (อัปเดตสถานะ) และหน้า "การจัดส่ง" (ระบุขนส่ง+เลขพัสดุ) ของ staff
export async function updateOrder(req, res) {
  try {
    const { orderId } = req.params;
    const { status, note, carrier, trackingNumber, paymentStatus, updatedBy } = req.body;

    const orders = getAllCheckoutOrders();
    const index = orders.findIndex((o) => o.orderId === orderId);

    if (index === -1) {
      return res.status(404).json({ ok: false, message: 'ไม่พบคำสั่งซื้อนี้ในระบบ' });
    }

    const now = new Date().toISOString();
    const existing = orders[index];

    const updated = { ...existing, updatedAt: now };

    // 🟢 บันทึกชื่อพนักงาน/แอดมินที่เป็นคนอัปเดตสถานะไว้ในประวัติ เพื่อให้ดูย้อนหลังได้ว่าใครทำรายการ
    if (status !== undefined && status !== existing.status) {
      updated.status = status;
      updated.statusHistory = [
        ...(existing.statusHistory || []),
        { status, note: note || '', date: now, updatedBy: updatedBy || 'ไม่ระบุ' },
      ];
    }
    if (carrier !== undefined) updated.carrier = carrier;
    if (trackingNumber !== undefined) updated.trackingNumber = trackingNumber;
    if (paymentStatus !== undefined) updated.paymentStatus = paymentStatus;
    // 🟢 เก็บชื่อผู้แก้ไขล่าสุดไว้ด้วย เผื่อกรณีแก้แค่ขนส่ง/เลขพัสดุโดยไม่เปลี่ยนสถานะ
    if (updatedBy !== undefined) updated.lastUpdatedBy = updatedBy;

    orders[index] = updated;
    saveAllCheckoutOrders(orders);

    return res.status(200).json({ ok: true, order: updated });
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ ok: false, message: 'เซิร์ฟเวอร์เกิดข้อผิดพลาด' });
  }
}

// 🟢 เพิ่มฟังก์ชันสำหรับลบคำสั่งซื้อ
export async function deleteOrder(req, res) {
  try {
    const { orderId } = req.params;
    let orders = getAllCheckoutOrders();
    
    // จำจำนวนเดิมไว้ก่อน เพื่อเช็คว่าหาเจอและลบออกไปจริงไหม
    const initialLength = orders.length;
    
    // กรองเอา orderId ที่ตรงกับคำสั่งขอลบออกไป
    orders = orders.filter((order) => order.orderId !== orderId);
    
    if (orders.length === initialLength) {
      return res.status(404).json({ ok: false, message: 'ไม่พบคำสั่งซื้อนี้ในระบบ' });
    }
    
    // บันทึกข้อมูลที่เหลือกลับลงไปในไฟล์ JSON
    saveAllCheckoutOrders(orders);
    
    return res.status(200).json({ ok: true, message: 'ลบคำสั่งซื้อสำเร็จ' });
  } catch (error) {
    console.error("Error deleting order:", error);
    return res.status(500).json({ ok: false, message: 'เซิร์ฟเวอร์เกิดข้อผิดพลาด' });
  }
}