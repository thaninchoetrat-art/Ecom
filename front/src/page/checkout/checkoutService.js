// ==========================================================================
// checkoutService.js
// เรียก API ของระบบ "สั่งซื้อสินค้า และชำระเงิน" (backend: /api/checkout)
// แยกไว้เป็นไฟล์ของตัวเอง ไม่ยุ่งกับ cartService.js / productService.js เดิม
// ==========================================================================
const BACKEND_URL = "http://localhost:4000/api/checkout";

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

// รหัสผู้ใช้สำหรับผูกกับคำสั่งซื้อ: ใช้ชื่อผู้ใช้ที่ล็อกอินอยู่ ถ้ายังไม่ล็อกอิน
// จะสร้างรหัสผู้เยี่ยมชม (guest id) แบบสุ่มแล้วจำไว้ใน localStorage ของตัวเอง
export function getCheckoutUserId() {
  const loggedInName = localStorage.getItem("local_user_name");
  if (loggedInName) return loggedInName;

  const GUEST_KEY = "checkout_guest_id";
  let guestId = localStorage.getItem(GUEST_KEY);
  if (!guestId) {
    guestId = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    localStorage.setItem(GUEST_KEY, guestId);
  }
  return guestId;
}
