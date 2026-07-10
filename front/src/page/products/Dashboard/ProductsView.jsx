import React from 'react';

export default function ProductsView({ products, setProducts, setIsModalOpen, setEditingProduct }) {

  // ฟังก์ชันเมื่อกดปุ่มแก้ไข
  const handleEditClick = (prod) => {
    setEditingProduct(prod); // ส่งข้อมูลสินค้าที่จะแก้กลับไปให้ไฟล์หลักเปิด Modal
  };

  return (
    <div style={{ maxWidth: '1024px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#db2777', margin: 0 }}>📦 จัดการรายการสินค้า</h1>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>คุณสามารถ เพิ่ม แก้ไข หรือลบข้อมูลสินค้าในร้านได้จากที่นี่</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} style={{ background: 'linear-gradient(to right, #ec4899, #f43f5e)', color: '#fff', fontWeight: 'bold', padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>+ เพิ่มสินค้าใหม่</button>
      </div>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '16px', border: '1px solid #fbcfe8', overflow: 'hidden' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#fff1f2', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #fbcfe8' }}>
              <th style={{ padding: '16px' }}>ชื่อสินค้า</th>
              <th style={{ padding: '16px' }}>หมวดหมู่</th>
              <th style={{ padding: '16px' }}>ราคา</th>
              <th style={{ padding: '16px' }}>คงเหลือในสต็อก</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px', color: '#4b5563' }}>
            {products.map((prod) => (
              <tr key={prod.id} style={{ borderBottom: '1px solid #fbcfe8' }}>
                <td style={{ padding: '16px', color: '#111827', fontWeight: '500' }}>{prod.name}</td>
                <td style={{ padding: '16px' }}>{prod.category}</td>
                <td style={{ padding: '16px', color: '#db2777', fontWeight: 'bold' }}>฿{prod.price.toLocaleString()}</td>
                <td style={{ padding: '16px' }}>
                  <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', backgroundColor: prod.stock > 5 ? '#fff1f2' : '#fef2f2', color: prod.stock > 5 ? '#e11d48' : '#ef4444', fontWeight: prod.stock > 5 ? 'normal' : 'bold' }}>
                    {prod.stock} ชิ้น {prod.stock <= 5 && '(ใกล้หมด!)'}
                  </span>
                </td>
                <td style={{ padding: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button onClick={() => handleEditClick(prod)} style={{ fontSize: '12px', color: '#db2777', backgroundColor: '#fdf2f8', padding: '6px 12px', borderRadius: '8px', border: '1px solid #fbcfe8', cursor: 'pointer', fontWeight: 'bold' }}>แก้ไข</button>
                  <button onClick={() => setProducts(products.filter(p => p.id !== prod.id))} style={{ fontSize: '12px', color: '#ef4444', backgroundColor: '#fef2f2', padding: '6px 12px', borderRadius: '8px', border: '1px solid #fee2e2', cursor: 'pointer' }}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}