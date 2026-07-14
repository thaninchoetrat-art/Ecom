import React from 'react';
import * as S from './profileStyles';

export default function ProfileSidebar({ username, avatar, activeTab, setActiveTab }) {
  
  // 🎨 ฟังก์ชันคำนวณดีไซน์ปุ่มเมนูให้สวยงามเหมือนสไตล์เดิมของคุณ แต่กดติดแน่นอน 100%
  const getButtonStyle = (tabName) => ({
    width: '100%',
    textAlign: 'left',
    padding: '14px 16px',
    background: activeTab === tabName ? 'rgba(219, 39, 119, 0.15)' : 'transparent',
    color: activeTab === tabName ? '#db2777' : '#ffffff',
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
    fontWeight: activeTab === tabName ? '600' : '400',
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

      {/* เปลี่ยนมาใช้ div ครอบปุ่มตรง ๆ เพื่อเลี่ยงบั๊กจาก Styled Component ชั้นนอก */}
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

        {/* 🌟 ย้ายมาอยู่ตรงนี้แล้วครับ: ล่างการซื้อของฉัน */}
        <button style={getButtonStyle('manage_products')} onClick={() => setActiveTab('manage_products')}>
          🛠️ จัดการสินค้า
        </button>
        
        <button style={getButtonStyle('shipping')} onClick={() => setActiveTab('shipping')}>
          🚚 ดูการจัดส่งสินค้า
        </button>

      </div>
    </S.Sidebar>
  );
}