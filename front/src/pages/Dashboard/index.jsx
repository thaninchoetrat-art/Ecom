import React, { useState } from 'react';
import Sidebar from './Sidebar';
import OverviewView from './OverviewView';
import ProductsView from './ProductsView';
import CategoriesView from './CategoriesView';
import MembersView from './MembersView';

export default function Dashboard() {
  const [activeMenu, setActiveMenu] = useState('overview');

  // 💾 ส่วนข้อมูลหลัก (Central States)
  const [products, setProducts] = useState([
    { id: 1, name: 'Luxe Diamond Watch', price: 25000, stock: 10, category: 'Accessories' },
    { id: 2, name: 'Premium Leather Wallet', price: 4500, stock: 4, category: 'Leather' }
  ]);

  const [categories, setCategories] = useState([
    { id: 1, name: 'Accessories', count: 10 },
    { id: 2, name: 'Leather', count: 4 },
    { id: 3, name: 'Cosmetics', count: 0 }
  ]);

  const [members, setMembers] = useState([
    { id: 'M001', name: 'คุณสมชาย ดีใจ', email: 'somchai@email.com', phone: '081-234-5678', joinDate: '01/10/2025', totalSpend: 29500, status: 'Active' },
    { id: 'M002', name: 'คุณลิซ่า พรีเมียม', email: 'lisa.p@email.com', phone: '089-999-8888', joinDate: '15/02/2026', totalSpend: 155000, status: 'VIP' },
    { id: 'M003', name: 'คุณรินรดา งดงาม', email: 'rinrada@email.com', phone: '086-555-4321', joinDate: '20/05/2026', totalSpend: 0, status: 'Pending' }
  ]);

  // 📜 ชุดข้อมูลจำลองฝั่งออเดอร์ลูกค้า (Orders State)
  const [orders, setOrders] = useState([
    { id: 'ORD-9981', customerName: 'คุณลิซ่า พรีเมียม', total: 25000, date: '08/07/2026', status: 'กำลังเตรียมจัดส่ง', tracking: '' },
    { id: 'ORD-9982', customerName: 'คุณสมชาย ดีใจ', total: 4500, date: '09/07/2026', status: 'จัดส่งแล้ว', tracking: 'TH123456789' }
  ]);

  // 📝 States ควบคุม Popup Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null); // ตัวแปรเก็บสินค้าที่กำลังกดแก้ไข

  // ฟอร์มแอดสินค้า/หมวดหมู่
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('');
  const [newCategory, setNewCategory] = useState('Accessories');
  const [newCatName, setNewCatName] = useState('');

  // ฟังก์ชันบันทึกการ "แก้ไขสินค้า"
  const handleUpdateProduct = (e) => {
    e.preventDefault();
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null); // ปิด Popup แก้ไข
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newName || !newPrice || !newStock) return alert("กรุณากรอกข้อมูลให้ครบถ้วน");
    setProducts([...products, { id: Date.now(), name: newName, price: Number(newPrice), stock: Number(newStock), category: newCategory }]);
    setIsModalOpen(false); setNewName(''); setNewPrice(''); setNewStock('');
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName) return alert("กรุณากรอกชื่อหมวดหมู่");
    setCategories([...categories, { id: Date.now(), name: newCatName, count: 0 }]);
    setIsCatModalOpen(false); setNewCatName('');
  };

  // ฟังก์ชันเปลี่ยนสถานะออเดอร์
  const handleShipOrder = (orderId) => {
    const trackingNo = prompt("กรุณากรอกเลขพัสดุ (Tracking Number):", "TH" + Math.floor(Math.random() * 100000000));
    if (trackingNo === null) return; // กดยกเลิก
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'จัดส่งแล้ว', tracking: trackingNo } : o));
  };

  const handleLogout = () => {
    localStorage.removeItem("is_logged_in");
    localStorage.removeItem("user_token");
    alert("ออกจากระบบเรียบร้อยแล้ว!");
    window.location.reload();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', background: 'linear-gradient(135deg, #ffe4e6 0%, #ffffff 100%)', color: '#374151', fontFamily: 'sans-serif', overflow: 'hidden', position: 'fixed', top: 0, left: 0, zIndex: 9999 }}>

      <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu} handleLogout={handleLogout} />

      <div style={{ flex: 1, padding: '32px', overflowY: 'auto', backgroundColor: 'transparent' }}>

        {/* 📊 หน้าภาพรวม - อัปเดตส่งค่า Props ข้อมูลจริงเข้าทำงานร่วมกัน */}
        {activeMenu === 'overview' && (
          <OverviewView
            memberCount={members.length}
            productCount={products.length}
            categoryCount={categories.length}
            orderCount={orders.length}
          />
        )}

        {activeMenu === 'products' && <ProductsView products={products} setProducts={setProducts} setIsModalOpen={setIsModalOpen} setEditingProduct={setEditingProduct} />}
        {activeMenu === 'categories' && <CategoriesView categories={categories} setCategories={setCategories} products={products} setIsCatModalOpen={setIsCatModalOpen} />}
        {activeMenu === 'members' && <MembersView members={members} setSelectedMember={setSelectedMember} />}

        {/* 📜 หน้าแสดงรายการสั่งซื้อออเดอร์ลูกค้าแบบสมบูรณ์ */}
        {activeMenu === 'orders' && (
          <div style={{ maxWidth: '1024px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#db2777', marginBottom: '4px' }}>📜 รายการสั่งซื้อของลูกค้า</h1>
            <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '24px' }}>ตรวจสอบ จัดการเปลี่ยนสถานะการจัดส่ง และกรอกเลขพัสดุออเดอร์สินค้า</p>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '16px', border: '1px solid #fbcfe8', overflow: 'hidden' }}>
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#fff1f2', color: '#6b7280', fontSize: '12px', borderBottom: '1px solid #fbcfe8' }}>
                    <th style={{ padding: '16px' }}>เลขที่ออเดอร์</th>
                    <th style={{ padding: '16px' }}>ชื่อลูกค้า</th>
                    <th style={{ padding: '16px' }}>วันที่สั่งซื้อ</th>
                    <th style={{ padding: '16px' }}>ยอดสุทธิ</th>
                    <th style={{ padding: '16px' }}>สถานะ</th>
                    <th style={{ padding: '16px', textAlign: 'center' }}>การจัดการ</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '14px', color: '#4b5563' }}>
                  {orders.map((order) => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #fbcfe8' }}>
                      <td style={{ padding: '16px', fontWeight: 'bold', color: '#db2777' }}>{order.id}</td>
                      <td style={{ padding: '16px', color: '#111827' }}>{order.customerName}</td>
                      <td style={{ padding: '16px' }}>{order.date}</td>
                      <td style={{ padding: '16px', fontWeight: 'bold', color: '#111827' }}>฿{order.total.toLocaleString()}</td>
                      <td style={{ padding: '16px' }}>
                        <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', backgroundColor: order.status === 'จัดส่งแล้ว' ? '#f0fdf4' : '#fffbeb', color: order.status === 'จัดส่งแล้ว' ? '#16a34a' : '#d97706' }}>
                          {order.status}
                        </span>
                        {order.tracking && <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>📦 {order.tracking}</div>}
                      </td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        {order.status === 'กำลังเตรียมจัดส่ง' ? (
                          <button onClick={() => handleShipOrder(order.id)} style={{ fontSize: '12px', color: '#fff', background: 'linear-gradient(to right, #ec4899, #f43f5e)', padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                            🚚 กดจัดส่งสินค้า
                          </button>
                        ) : (
                          <span style={{ color: '#9ca3af', fontSize: '12px' }}>เสร็จสิ้น</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ==================== POPUP MODALS ZONE ==================== */}

      {/* ✏️ Popup Modal: แก้ไขข้อมูลสินค้า */}
      {editingProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #fbcfe8', width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#db2777', marginTop: 0, marginBottom: '16px' }}>✏️ แก้ไขข้อมูลสินค้า</h2>
            <form onSubmit={handleUpdateProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>ชื่อสินค้า</label>
                <input type="text" value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} style={{ width: '100%', border: '1px solid #fbcfe8', borderRadius: '12px', padding: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>หมวดหมู่</label>
                <select value={editingProduct.category} onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })} style={{ width: '100%', border: '1px solid #fbcfe8', borderRadius: '12px', padding: '10px', fontSize: '14px', backgroundColor: '#fff' }}>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>ราคา (บาท)</label>
                  <input type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })} style={{ width: '100%', border: '1px solid #fbcfe8', borderRadius: '12px', padding: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>สต็อก</label>
                  <input type="number" value={editingProduct.stock} onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })} style={{ width: '100%', border: '1px solid #fbcfe8', borderRadius: '12px', padding: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button type="button" onClick={() => setEditingProduct(null)} style={{ flex: 1, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>ยกเลิก</button>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(to right, #ec4899, #f43f5e)', color: '#fff', fontWeight: 'bold', padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>อัปเดตข้อมูล</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🧾 Popup: เพิ่มสินค้าใหม่ */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #fbcfe8', width: '100%', maxWidth: '400px', padding: '24px', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#db2777', marginTop: 0, marginBottom: '16px' }}>➕ เพิ่มสินค้าใหม่เข้าระบบ</h2>
            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>ชื่อสินค้า</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} style={{ width: '100%', border: '1px solid #fbcfe8', borderRadius: '12px', padding: '10px', fontSize: '14px', boxSizing: 'border-box' }} placeholder="ชื่อสินค้า" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>เลือกหมวดหมู่</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} style={{ width: '100%', border: '1px solid #fbcfe8', borderRadius: '12px', padding: '10px', fontSize: '14px', backgroundColor: '#fff' }}>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>ราคา (บาท)</label>
                  <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} style={{ width: '100%', border: '1px solid #fbcfe8', borderRadius: '12px', padding: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>สต็อก</label>
                  <input type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} style={{ width: '100%', border: '1px solid #fbcfe8', borderRadius: '12px', padding: '10px', fontSize: '14px', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>ยกเลิก</button>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(to right, #ec4899, #f43f5e)', color: '#fff', fontWeight: 'bold', padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>บันทึก</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🧾 Popup: เพิ่มหมวดหมู่ใหม่ */}
      {isCatModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #fbcfe8', width: '100%', maxWidth: '360px', padding: '24px', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#db2777', marginTop: 0, marginBottom: '16px' }}>🏷️ เพิ่มหมวดหมู่ใหม่</h2>
            <form onSubmit={handleAddCategory} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>ชื่อหมวดหมู่</label>
                <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} style={{ width: '100%', border: '1px solid #fbcfe8', borderRadius: '12px', padding: '10px', fontSize: '14px', boxSizing: 'border-box' }} placeholder="เช่น Shoes, Clothes" />
              </div>
              <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                <button type="button" onClick={() => setIsCatModalOpen(false)} style={{ flex: 1, backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', padding: '10px', borderRadius: '12px', cursor: 'pointer' }}>ยกเลิก</button>
                <button type="submit" style={{ flex: 1, background: 'linear-gradient(to right, #ec4899, #f43f5e)', color: '#fff', fontWeight: 'bold', padding: '10px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>สร้างหมวดหมู่</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ℹ️ Popup: ข้อมูลสมาชิก */}
      {selectedMember && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 10000, backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #fbcfe8', width: '100%', maxWidth: '420px', padding: '28px', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: '#fff1f2', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 12px auto', fontSize: '28px' }}>👤</div>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', margin: 0 }}>{selectedMember.name}</h2>
              <span style={{ fontSize: '12px', color: '#db2777', fontWeight: 'bold', backgroundColor: '#fdf2f8', padding: '2px 8px', borderRadius: '6px', marginTop: '4px', display: 'inline-block' }}>ID: {selectedMember.id}</span>
            </div>
            <div style={{ borderTop: '1px solid #f3e8ff', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280' }}>📧 อีเมล:</span><span style={{ fontWeight: '500', color: '#111827' }}>{selectedMember.email}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280' }}>📞 เบอร์โทรศัพท์:</span><span style={{ fontWeight: '500', color: '#111827' }}>{selectedMember.phone}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280' }}>📅 วันที่สมัครสมาชิก:</span><span style={{ fontWeight: '500', color: '#111827' }}>{selectedMember.joinDate}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #f3e8ff', paddingTop: '12px' }}><span style={{ color: '#6b7280', fontWeight: 'bold' }}>🛍️ ยอดซื้อสะสมทั้งหมด:</span><span style={{ fontWeight: 'bold', color: '#db2777', fontSize: '16px' }}>฿{selectedMember.totalSpend.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#6b7280' }}>⚡ สถานะบัญชี:</span><span style={{ fontWeight: 'bold', color: selectedMember.status === 'VIP' ? '#db2777' : '#16a34a' }}>{selectedMember.status}</span></div>
            </div>
            <button onClick={() => setSelectedMember(null)} style={{ width: '100%', marginTop: '24px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', color: '#374151', padding: '10px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>ปิดหน้าต่าง</button>
          </div>
        </div>
      )}

    </div>
  );
}