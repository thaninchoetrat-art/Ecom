import React, { useEffect, useState } from 'react';
import * as S from './profileStyles';
import { fetchOrders } from "../staff/services/orderService";

export default function ShippingTracking() {
  console.log("ShippingTracking loaded!");
  const [myOrders, setMyOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyOrders = async () => {
      try {
        const allOrders = await fetchOrders();
        
        // 🟢 DEBUG: ดูข้อมูลทั้งหมดที่ได้จาก API ใน Console
        console.log("All Orders from API:", allOrders);
        
        // ทดลองไม่กรองด้วยชื่อก่อน เพื่อดูว่าข้อมูลโผล่ไหม
        // ถ้าข้อมูลโผล่ แสดงว่าเงื่อนไข o.customerName === currentUserName ผิดพลาด
        const filtered = allOrders.filter(o => o.status !== "cancelled");
        
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
              <p><strong>สถานะ:</strong> {order.status}</p>
              <p><strong>ชื่อลูกค้าในระบบ:</strong> {order.customerName || "ไม่ระบุชื่อ"}</p> {/* เช็คชื่อตรงนี้ */}
              <p><strong>ขนส่ง:</strong> {order.carrier || "รอระบุ"}</p>
              <p><strong>เลขพัสดุ:</strong> {order.trackingNumber || "รอระบุ"}</p>
            </div>
          ))
        )}
      </div>
    </>
  );
}