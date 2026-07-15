import React from 'react';
import * as S from './profileStyles';

export default function ProfileSidebar({ username, avatar, activeTab, setActiveTab }) {
  
  // 🚪 ฟังก์ชันเมื่อกด "ออกจากระบบ"
  const handleLogout = () => {
    // 1. ล้างข้อมูล Session / Token ทั้งหมดที่เก็บในเครื่อง
    localStorage.clear();
    sessionStorage.clear();

    // 2. ส่งตัวผู้ใช้กลับไปยังหน้าล็อกอิน (ปรับ path ตรง '/login' ได้ตามที่พี่ตั้งค่าไว้เลยครับ)
    window.location.href = '/login'; 
  };

  // 🎨 ปรับฟังก์ชันคำนวณดีไซน์สีปุ่มใหม่ ให้ชัดเจนบนพื้นหลังสว่าง/ชมพูพาสเทล
  const getButtonStyle = (tabName) => ({
    width: '100%',
    textAlign: 'left',
    padding: '14px 16px',
    /* 🔄 ตอนเลือก: ใช้ชมพูอ่อนพาสเทล | ตอนไม่เลือก: โปร่งแสง */
    background: activeTab === tabName ? '#ffe4e6' : 'transparent',
    /* 🔄 ตอนเลือก: สีชมพูเข้ม #db2777 | ตอนไม่เลือก: สีเทาเข้มสะดุดตา #4b5563 */
    color: activeTab === tabName ? '#db2777' : '#4b5563',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '15px',
    marginBottom: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.2s ease',
    outline: 'none',
    /* 🔄 ตอนเลือก: ตัวหนา 700 | ตอนไม่เลือก: หนาปานกลาง 600 ให้อ่านง่าย */
    fontWeight: activeTab === tabName ? '700' : '600',
  });

  return (
    <S.Sidebar>
      <S.UserSection>
        <S.AvatarThumb src={avatar} alt="Avatar" />
        <div>
          <S.UsernameText>{username}</S.UsernameText>
          <button 
            onClick={() => setActiveTab('profile')} 
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#db2777', 
              cursor: 'pointer', 
              fontSize: '13px', 
              padding: 0,
              textDecoration: 'underline'
            }}
          >
            ✏️ แก้ไขข้อมูลส่วนตัว
          </button>
        </div>
      </S.UserSection>

      {/* แถบเมนูด้านซ้าย */}
      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column' }}>
        
        <button style={getButtonStyle('profile')} onClick={() => setActiveTab('profile')}>
          👤 บัญชีของฉัน
        </button>
        
        <button style={getButtonStyle('address')} onClick={() => setActiveTab('address')}>
          📍 ที่อยู่
        </button>
        
        <button style={getButtonStyle('orders')} onClick={() => setActiveTab('orders')}>
          📦 การซื้อของฉัน
        </button>

        <button style={getButtonStyle('manage_products')} onClick={() => setActiveTab('manage_products')}>
          🛠️ จัดการสินค้า
        </button>
        
        <button style={getButtonStyle('shipping')} onClick={() => setActiveTab('shipping')}>
          🚚 ดูการจัดส่งสินค้า
        </button>

        {/* 🛑 เส้นคั่นกลางบาง ๆ ให้สไตล์ดูเป็นระเบียบขึ้น */}
        <hr style={{ border: 'none', borderTop: '1px solid #ffe4e6', margin: '12px 0' }} />

        {/* 🚪 ปุ่มออกจากระบบแบบใหม่ สีแดงมีระดับคัดแยกชัดเจน */}
        <button 
          onClick={handleLogout}
          style={{
            width: '100%',
            textAlign: 'left',
            padding: '14px 16px',
            background: 'transparent',
            color: '#ef4444', // สีส้มแดงเด่นชัดเจน
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'all 0.2s ease',
            outline: 'none',
            fontWeight: '600'
          }}
          // ทำเอฟเฟกต์โฮเวอร์ให้เปลี่ยนเป็นสีแดงพาสเทลจาง ๆ เวลาเมาส์ชี้
          onMouseEnter={(e) => e.target.style.background = '#fef2f2'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          🚪 ออกจากระบบ
        </button>

      </div>
    </S.Sidebar>
  );
}