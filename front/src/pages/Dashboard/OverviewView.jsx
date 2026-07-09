import React from 'react';

// 📥 อัปเกรดให้รับ Props ข้อมูลจริงจากไฟล์หลัก เพื่อนำมานับจำนวน
export default function OverviewView({ memberCount, productCount, categoryCount, orderCount }) {
  return (
    <div style={{ maxWidth: '1024px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#db2777', margin: 0 }}>📊 ภาพรวมระบบ (Overview)</h1>
      <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 24px 0' }}>ยินดีต้อนรับกลับเข้าสู่ระบบจัดการร้านค้าพรีเมียม นี่คือข้อมูลสรุปของร้านคุณในปัจจุบัน</p>

      {/* Grid การ์ดแสดงสถิติ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '16px', border: '1px solid #fbcfe8', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>🛍️ ยอดรวมการสั่งซื้อ</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginTop: '8px' }}>
            {orderCount} <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 'normal' }}>ออเดอร์</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '16px', border: '1px solid #fbcfe8', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>📦 สินค้าทั้งหมดในระบบ</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#db2777', marginTop: '8px' }}>
            {productCount} <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 'normal' }}>รายการ</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '16px', border: '1px solid #fbcfe8', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>🏷️ หมวดหมู่สินค้า</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginTop: '8px' }}>
            {categoryCount} <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 'normal' }}>หมวดหมู่</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '16px', border: '1px solid #fbcfe8', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>👥 ลูกค้าที่เป็นสมาชิก</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', marginTop: '8px' }}>
            {memberCount} <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: 'normal' }}>รายชื่อ</span>
          </div>
        </div>

      </div>

      {/* กล่องต้อนรับสไตล์พรีเมียมมินิมอล */}
      <div style={{ background: 'linear-gradient(to right, #fdf2f8, #fff1f2)', borderRadius: '20px', border: '1px solid #fbcfe8', padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <h3 style={{ margin: '0 0 8px 0', color: '#db2777', fontSize: '18px', fontWeight: 'bold' }}>✨ ส่วนประกอบหน้า Admin UI เสร็จสมบูรณ์แล้ว!</h3>
        <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: '1.6', maxWidth: '600px' }}>
          โครงสร้างหน้าต่างเมนูทั้งหมดได้รับการแยกโมดูล (Component Split) เป็นสัดส่วนเรียบร้อย ข้อมูลเชื่อมโยงผ่าน Central State พร้อมสำหรับให้นักพัฒนาฝั่ง Back-end นำไปผูกกับฐานข้อมูลหรือ REST API ต่อได้ทันที
        </p>
      </div>
    </div>
  );
}