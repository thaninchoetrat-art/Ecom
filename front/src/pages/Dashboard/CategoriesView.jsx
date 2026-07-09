import React from 'react';

export default function CategoriesView({ categories, setCategories, products, setIsCatModalOpen }) {
  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#db2777', margin: 0 }}>🏷️ หมวดหมู่สินค้า</h1>
          <p style={{ fontSize: '12px', color: '#6b7280', margin: '4px 0 0 0' }}>จัดการประเภทและหมวดหมู่ของสินค้าในระบบ</p>
        </div>
        <button onClick={() => setIsCatModalOpen(true)} style={{ background: 'linear-gradient(to right, #ec4899, #f43f5e)', color: '#fff', fontWeight: 'bold', padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>+ เพิ่มหมวดหมู่</button>
      </div>
      <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '16px', border: '1px solid #fbcfe8', overflow: 'hidden' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#fff1f2', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #fbcfe8' }}>
              <th style={{ padding: '16px' }}>ชื่อหมวดหมู่</th>
              <th style={{ padding: '16px' }}>จำนวนสินค้าที่ผูกอยู่</th>
              <th style={{ padding: '16px', textAlign: 'center' }}>จัดการ</th>
            </tr>
          </thead>
          <tbody style={{ fontSize: '14px', color: '#4b5563' }}>
            {categories.map((cat) => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #fbcfe8' }}>
                <td style={{ padding: '16px', color: '#111827', fontWeight: '500' }}>{cat.name}</td>
                <td style={{ padding: '16px' }}>{products.filter(p => p.category === cat.name).length} รายการ</td>
                <td style={{ padding: '16px', textAlign: 'center' }}><button onClick={() => setCategories(categories.filter(c => c.id !== cat.id))} style={{ fontSize: '12px', color: '#ef4444', backgroundColor: '#fef2f2', padding: '6px 12px', borderRadius: '8px', border: '1px solid #fee2e2', cursor: 'pointer' }}>ลบ</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}