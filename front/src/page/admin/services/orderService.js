// src/page/admin/services/orderService.js
// 🗺️ แผนที่ฟังก์ชันในไฟล์นี้ (เลขบรรทัดหลังแทรกคอมเมนต์นี้):
// - isStaffPlacedOrder() — บรรทัด 27
// - paymentMethodLabel() — บรรทัด 37
// - normalizeOrder() — บรรทัด 41
// - items() — บรรทัด 45
// - fetchOrders() — บรรทัด 92
// - deleteOrder() — บรรทัด 145
// - updateOrderStatus() — บรรทัด 163


const BACKEND_URL = "http://localhost:4000/api/orders";

export const ORDER_STATUS = {
  pending: { label: "รอดำเนินการ", color: "amber" },
  confirmed: { label: "ยืนยันคำสั่งซื้อ", color: "blue" },
  processing: { label: "กำลังเตรียมสินค้า", color: "blue" },
  packed: { label: "แพ็คสินค้าแล้ว", color: "indigo" },
  shipping: { label: "กำลังจัดส่ง", color: "purple" },
  delivered: { label: "จัดส่งสำเร็จ", color: "green" },
  cancelled: { label: "ยกเลิกคำสั่งซื้อ", color: "red" },
};

export const SHIPPING_STEPS = ["confirmed", "processing", "packed", "shipping", "delivered"];

// 🟢 แยกคำสั่งซื้อตามคนที่ทำรายการ: Staff/Admin ซื้อเอง VS Customer สั่งเอง (ใช้ร่วมกันทั้งหน้าคำสั่งซื้อและหน้าจัดส่ง)
export const isStaffPlacedOrder = (o) => o.placedByRole === "Staff" || o.placedByRole === "Admin";

// 🟢 ชื่อวิธีชำระเงินภาษาไทย ใช้แสดงในหน้าคำสั่งซื้อ/จัดส่งของแอดมิน (ให้ตรงกับตัวเลือกในหน้า checkout)
export const PAYMENT_METHOD_LABELS = {
  cod: "เก็บเงินปลายทาง",
  bank_transfer: "โอนเงินผ่านธนาคาร",
  promptpay: "พร้อมเพย์ (PromptPay)",
  card: "บัตรเครดิต / เดบิต",
};

export const paymentMethodLabel = (method) => PAYMENT_METHOD_LABELS[method] || method || "ไม่ระบุ";

let cache = [];

function normalizeOrder(o) {
  const addr = o.shippingAddress || {};

  // 🟢 คำนวณความถูกต้องของรายการสินค้า
  const items = (o.items || []).map((it) => ({
    productId: it.productId,
    productName: it.name || it.productName,
    price: Number(it.price) || 0,
    qty: Number(it.quantity || it.qty) || 1,
    image: it.image,
    // 🟢 ที่มาของสินค้า/ผู้ขาย: ถ้า source เป็น "customer" แปลว่าสินค้านี้เป็นของที่สมาชิกโพสต์ขายเอง
    // (ไม่ใช่ของบริษัท) เลยต้องโชว์ว่ารายการนี้ซื้อมาจากใคร
    source: it.source || "company",
    sellerEmail: it.sellerEmail || "",
    sellerName: it.sellerName || "",
  }));

  // 🟢 คำนวณยอดเงินใหม่ (เผื่อยอดรวมถูกแยกไปบรรทัดอื่นแล้วสูญหาย)
  const calculatedSubtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const subtotal = o.subtotal || calculatedSubtotal;
  const shippingFee = o.shippingFee || 0;
  const total = o.grandTotal || o.total || (subtotal + shippingFee);

  return {
    orderId: o.orderId,
    customerName: addr.receiverName || o.customerName || o.userId || "ไม่ระบุชื่อ",
    customerEmail: (o.userId || "").includes("@") ? o.userId : "",
    customerPhone: addr.phone || o.customerPhone || "-",
    shippingAddress: [addr.detail, addr.district, addr.province, addr.postalCode]
      .filter(Boolean)
      .join(" ") || o.address || "-",
    items,
    subtotal,
    shippingFee,
    total,
    paymentMethod: o.paymentMethod || "-",
    paymentStatus: o.paymentStatus === "paid" ? "paid" : "unpaid",
    status: o.status || "pending",
    statusHistory: o.statusHistory || [
      { status: o.status || "pending", note: "สร้างคำสั่งซื้อ", date: o.createdAt || new Date().toISOString() },
    ],
    carrier: o.carrier || "",
    trackingNumber: o.trackingNumber || "",
    lastUpdatedBy: o.lastUpdatedBy || "",
    // 🟢 สิทธิ์ของคนที่กดสั่งซื้อ: Customer = ลูกค้าสั่งเอง, Staff/Admin = พนักงาน/แอดมิน login แล้วมาซื้อเอง
    placedByRole: o.placedByRole || "Customer",
    createdAt: o.createdAt || new Date().toISOString(),
    updatedAt: o.updatedAt || o.createdAt || new Date().toISOString(),
  };
}

export const fetchOrders = async () => {
  try {
    const res = await fetch(BACKEND_URL);
    if (!res.ok) throw new Error("โหลดคำสั่งซื้อไม่สำเร็จ");
    const data = await res.json();

    // 🟢 1. จัดกลุ่มข้อมูลคำสั่งซื้อให้อิงจากเลข orderId เป็นหลัก
    const groupedOrders = {};

    (Array.isArray(data) ? data : []).forEach((o) => {
      const id = o.orderId;
      if (!id) return; // ถ้าไม่มีเลขคำสั่งซื้อให้ข้ามไป

      if (!groupedOrders[id]) {
        // ถ้าเพิ่งเจอ orderId นี้ครั้งแรก ให้สร้าง object เก็บไว้
        groupedOrders[id] = { ...o, items: Array.isArray(o.items) ? [...o.items] : [] };
      } else {
        const existing = groupedOrders[id];

        // 2. ถ้ารายการสินค้าถูกแยกบรรทัดมา เอามารวมกันในตะกร้าเดิม
        if (Array.isArray(o.items)) {
          existing.items.push(...o.items);
        }

        // 3. ผสานข้อมูลที่อยู่ (Shipping Address)
        if (o.shippingAddress) {
          existing.shippingAddress = {
            ...(existing.shippingAddress || {}),
            ...o.shippingAddress,
          };
        }

        // 4. ผสานข้อมูลอื่นๆ เช่น ชื่อ, เบอร์โทร (ถ้า existing ยังไม่มีข้อมูลนี้ ให้นำค่าที่แตกมาใหม่ไปเติม)
        Object.keys(o).forEach((key) => {
          if (key !== "items" && key !== "shippingAddress") {
            if (!existing[key] && o[key]) {
              existing[key] = o[key];
            }
          }
        });
      }
    });

    // 🟢 5. นำข้อมูลที่ถูกรวบเป็นก้อนเดียวแล้วไปจัดระเบียบส่งให้ UI
    cache = Object.values(groupedOrders).map(normalizeOrder);
    return cache;
  } catch (err) {
    console.error("fetchOrders error:", err);
    return cache;
  }
};

// 🟢 ปรับให้ฟังก์ชันกลายเป็น Async และยิง API แบบ DELETE
export const deleteOrder = async (orderId) => {
  try {
    const res = await fetch(`${BACKEND_URL}/${orderId}`, {
      method: 'DELETE',
    });

    if (!res.ok) throw new Error("ลบข้อมูลใน Database ไม่สำเร็จ");

    // อัปเดต Cache ฝั่งหน้าจอเมื่อลบสำเร็จ
    cache = cache.filter((o) => o.orderId !== orderId);
    return cache;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

// 🟢 แนบชื่อผู้ทำรายการ (จาก localStorage ที่ตั้งไว้ตอน login) ไปด้วยทุกครั้ง เพื่อรู้ว่าใครเป็นคนอัปเดต
export const updateOrderStatus = async (orderId, status, note = "", extra = {}) => {
  const updatedBy = localStorage.getItem("local_user_name") || "ไม่ระบุ";
  const res = await fetch(`${BACKEND_URL}/${orderId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, note, updatedBy, ...extra }),
  });
  const data = await res.json();
  if (!res.ok || !data.ok) throw new Error(data.message || "อัปเดตสถานะไม่สำเร็จ");

  const updated = normalizeOrder(data.order);
  cache = cache.map((o) => (o.orderId === orderId ? updated : o));
  return updated;
};
