// ==========================================================================
// checkoutService.js
// เรียก API ของระบบ "สั่งซื้อสินค้า และชำระเงิน" (backend: /api/checkout)
// แยกไว้เป็นไฟล์ของตัวเอง ไม่ยุ่งกับ cartService.js / productService.js เดิม
// ==========================================================================
import { getAllProducts, saveProducts } from "../products/productService";
import { logAutoDeduction } from "../admin/services/inventoryService";

const BACKEND_URL = "http://localhost:4000/api/checkout";

// ==========================================================================
// ตรวจสอบสต็อกสินค้าจริงก่อนยืนยันคำสั่งซื้อ
// คืนค่าเป็น array ของรายการที่ "สต็อกไม่พอ" พร้อมจำนวนคงเหลือจริง
// (ใช้ป้องกันกรณีสต็อกถูกเปลี่ยน/ซื้อไปแล้วระหว่างที่สินค้าอยู่ในตะกร้า)
// ==========================================================================
export function checkStockAvailability(items) {
  const products = getAllProducts();
  const shortages = [];

  (items || []).forEach((item) => {
    const product = products.find((p) => p.productId === item.productId);
    const available =
      product && product.stock !== undefined && product.stock !== null
        ? Number(product.stock)
        : null;

    if (available !== null && Number(item.quantity) > available) {
      shortages.push({
        productId: item.productId,
        name: item.name,
        available,
      });
    }
  });

  return shortages;
}

// ==========================================================================
// หักสต็อกสินค้าจริงหลังสั่งซื้อสำเร็จ ไม่ให้ติดลบ (อย่างน้อยคือ 0 = สินค้าหมด)
// ==========================================================================
export function deductStockAfterOrder(items, orderId) {
  const products = getAllProducts();

  const updatedProducts = products.map((product) => {
    const purchased = (items || []).find(
      (item) => item.productId === product.productId
    );

    if (!purchased || product.stock === undefined || product.stock === null) {
      return product;
    }

    const stockBefore = Number(product.stock);
    const remaining = Math.max(0, stockBefore - Number(purchased.quantity));

    // 🟢 บันทึกลงประวัติคลังสินค้าว่าลูกค้าเป็นคนทำให้สต็อกลด (แยกจากการปรับสต็อกโดย Staff)
    logAutoDeduction({
      productId: product.productId,
      productName: product.productName,
      qty: stockBefore - remaining,
      stockBefore,
      stockAfter: remaining,
      orderId,
    });

    return { ...product, stock: remaining };
  });

  saveProducts(updatedProducts);
}

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.ok === false) {
    throw new Error(data.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
  }
  return data;
}

export async function createOrder(payload) {
  const response = await fetch(`${BACKEND_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(response);
}

export async function getOrder(orderId) {
  const response = await fetch(`${BACKEND_URL}/orders/${orderId}`);
  return handleResponse(response);
}

export async function getOrdersByUser(userId) {
  const response = await fetch(`${BACKEND_URL}/orders/user/${userId}`);
  return handleResponse(response);
}

export async function confirmPayment(orderId) {
  const response = await fetch(`${BACKEND_URL}/orders/${orderId}/confirm-payment`, {
    method: "POST",
  });
  return handleResponse(response);
}

export async function cancelOrder(orderId) {
  const response = await fetch(`${BACKEND_URL}/orders/${orderId}/cancel`, {
    method: "POST",
  });
  return handleResponse(response);
}

// รหัสผู้ใช้สำหรับผูกกับคำสั่งซื้อ: ใช้อีเมลของผู้ใช้ที่ล็อกอินอยู่ (ไม่ซ้ำกันแน่นอน ต่างจากชื่อที่อาจซ้ำกันได้)
// ถ้ายังไม่ล็อกอิน จะสร้างรหัสผู้เยี่ยมชม (guest id) แบบสุ่มแล้วจำไว้ใน localStorage ของตัวเอง
// 🟢 เดิมใช้ local_user_name ซึ่งซ้ำกันได้ระหว่างบัญชี ทำให้ "การซื้อของฉัน" / "ดูการจัดส่งสินค้า"
// ในหน้าโปรไฟล์กรองแยกรายบัญชีไม่ได้แม่นยำ เปลี่ยนมาใช้อีเมลแทน
export function getCheckoutUserId() {
  const loggedInEmail = localStorage.getItem("local_user_email");
  if (loggedInEmail) return loggedInEmail;

  const GUEST_KEY = "checkout_guest_id";
  let guestId = localStorage.getItem(GUEST_KEY);
  if (!guestId) {
    guestId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(GUEST_KEY, guestId);
  }
  return guestId;
}
