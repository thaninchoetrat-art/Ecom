# Checkout Module (ระบบสั่งซื้อสินค้า และชำระเงิน)

โมดูลนี้แยกไว้เป็นโฟลเดอร์ของตัวเอง (`back/modules/checkout/`) ไม่ได้แก้ไข
controller, route, หรือ model เดิมของโปรเจกต์เลย และมีไฟล์เก็บข้อมูลของตัวเอง
(`data/checkout_orders.json`) แยกจาก `orders.json` เดิมที่ `back/data/`

## ไฟล์ในโมดูลนี้
- `checkoutStore.js` — อ่าน/เขียนไฟล์ข้อมูลออเดอร์ของโมดูลนี้เอง
- `checkoutController.js` — ตรรกะสร้างออเดอร์ คำนวณยอด และจำลองการชำระเงิน
- `checkoutRoutes.js` — กำหนดเส้นทาง API ทั้งหมดของโมดูลนี้

## การเชื่อมเข้ากับเซิร์ฟเวอร์หลัก
มีการแก้ไข `back/server.js` เพียง 2 บรรทัด (import + app.use) เพื่อเปิดใช้งาน
เส้นทาง `/api/checkout` เท่านั้น ไม่มีการแก้ไขไฟล์อื่นใดนอกเหนือจากนี้

## API ทั้งหมด

| Method | Path | คำอธิบาย |
|---|---|---|
| POST | `/api/checkout/orders` | สร้างคำสั่งซื้อใหม่จากตะกร้าสินค้า |
| GET | `/api/checkout/orders/:orderId` | ดูรายละเอียดคำสั่งซื้อ |
| GET | `/api/checkout/orders/user/:userId` | ดูประวัติคำสั่งซื้อของผู้ใช้ |
| POST | `/api/checkout/orders/:orderId/confirm-payment` | ยืนยันว่าชำระเงินแล้ว (ใช้กับโอนเงิน/พร้อมเพย์) |
| POST | `/api/checkout/orders/:orderId/cancel` | ยกเลิกคำสั่งซื้อ |

### ตัวอย่าง Body ของ POST `/api/checkout/orders`
```json
{
  "userId": "guest",
  "items": [
    { "productId": "P001", "name": "น้ำหอม A", "price": 590, "quantity": 2, "image": "/img/a.jpg" }
  ],
  "shippingAddress": {
    "receiverName": "สมชาย ใจดี",
    "phone": "0812345678",
    "detail": "123/45 ซอยสุขุมวิท",
    "province": "กรุงเทพฯ",
    "district": "วัฒนา",
    "postalCode": "10110"
  },
  "paymentMethod": "cod",
  "discount": 0
}
```

## วิธีการชำระเงินที่รองรับ (จำลองเท่านั้น ไม่เชื่อมเกตเวย์จริง)
- `cod` — เก็บเงินปลายทาง: ยืนยันคำสั่งซื้อทันที
- `bank_transfer` — โอนเงินผ่านธนาคาร: รอเรียก `confirm-payment` หลังลูกค้าโอน
- `promptpay` — พร้อมเพย์ (QR): รอเรียก `confirm-payment` เช่นกัน
- `card` — บัตรเครดิต/เดบิต: จำลองอนุมัติทันที (ฝั่งหน้าบ้านส่งเฉพาะเลข 4 ตัวท้ายเท่านั้น ไม่ส่งเลขบัตรเต็ม)
