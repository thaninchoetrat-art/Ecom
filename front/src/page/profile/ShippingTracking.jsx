import React, { useEffect, useState } from 'react';
import * as S from './profileStyles';
import { getOrdersByUser, getCheckoutUserId } from "../checkout/checkoutService";

const STATUS_LABEL = {
  pending: "รอดำเนินการ",
  confirmed: "ยืนยันคำสั่งซื้อ",
  processing: "กำลังเตรียมสินค้า",
  packed: "แพ็คสินค้าแล้ว",
  shipping: "กำลังจัดส่ง",
  delivered: "จัดส่งสำเร็จ",
  cancelled: "ยกเลิกคำสั่งซื้อ",
  awaiting_payment: "รอการยืนยันการชำระเงิน",
};

export default function ShippingTracking() {
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyOrders = async () => {
      try {
        // 🟢 เดิมดึงคำสั่งซื้อ "ทั้งหมดในระบบ" มาแสดง ไม่ได้กรองเป็นของบัญชีตัวเองเลย
        // (ลูกค้าคนหนึ่งเห็นพัสดุของลูกค้าคนอื่นได้หมด) ตอนนี้เปลี่ยนมาเรียก API
        // ที่กรองมาจาก backend เฉพาะออเดอร์ของ user คนที่ login อยู่เท่านั้น
        const userId = getCheckoutUserId();
        const { orders } = await getOrdersByUser(userId);
        const filtered = (orders || []).filter((o) => o.status !== "cancelled");
        setMyOrders(filtered);
      } catch (err) {
        console.error("โหลดข้อมูลจัดส่งไม่สำเร็จ", err);
      } finally {
        setLoading(false);
      }
    };

    loadMyOrders();
  }, []);

  return (
    <>
      <S.HeaderSection>
        <S.PageTitle>ดูการจัดส่งสินค้า</S.PageTitle>
        <S.PageSubTitle>ติดตามสถานะพัสดุและรถขนส่งสินค้าของคุณ</S.PageSubTitle>
      </S.HeaderSection>

      <div className="mt-6 space-y-4">
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : myOrders.length === 0 ? (
          <div style={{ padding: "20px", background: "#f9f9f9", borderRadius: "8px", border: "1px solid #eee" }}>
            🚛 ยังไม่มีสินค้าที่กำลังจัดส่งในขณะนี้
          </div>
        ) : (
          myOrders.map((order) => (
            <div key={order.orderId} style={{ padding: "20px", background: "#fff", border: "1px solid #ffd1d7", borderRadius: "12px", marginBottom: "10px" }}>
              <p><strong>หมายเลขคำสั่งซื้อ:</strong> {order.orderId}</p>
              <p><strong>สถานะ:</strong> {STATUS_LABEL[order.status] || order.status}</p>
              <p><strong>ผู้รับ:</strong> {order.shippingAddress?.receiverName || "ไม่ระบุชื่อ"}</p>
              <p><strong>ขนส่ง:</strong> {order.carrier || "รอระบุ"}</p>
              <p><strong>เลขพัสดุ:</strong> {order.trackingNumber || "รอระบุ"}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}
