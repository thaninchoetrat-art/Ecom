import React from 'react';

export default function Sidebar({ activeMenu, setActiveMenu, handleLogout }) {
  return (
    <div style={{ width: '260px', minWidth: '260px', backgroundColor: 'rgba(255, 255, 255, 0.75)', borderRight: '1px solid #fecdd3', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px', boxSizing: 'border-box', backdropFilter: 'blur(12px)' }}>
      <div style={{ flexGrow: 1 }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#db2777', marginBottom: '32px', trackingWidest: '0.1em', borderBottom: '1px solid #fbcfe8', paddingBottom: '16px', textAlign: 'center' }}>
          🌸 LUXE ADMIN
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            { id: 'overview', label: '📊 ภาพรวมระบบ' },
            { id: 'products', label: '📦 จัดการสินค้า' },
            { id: 'categories', label: '🏷️ หมวดหมู่สินค้า' },
            { id: 'members', label: '👥 ระบบสมาชิก' },
            { id: 'orders', label: '📜 ออเดอร์ลูกค้า' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px',
                background: activeMenu === item.id ? 'linear-gradient(to right, #ec4899, #f43f5e)' : 'transparent',
                color: activeMenu === item.id ? '#fff' : '#6b7280',
                fontWeight: activeMenu === item.id ? 'bold' : 'normal'
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', border: 'none', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
        🚪 ออกจากระบบ
      </button>
    </div>
  );
}