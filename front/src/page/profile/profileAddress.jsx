import React, { useState } from 'react';
import * as S from './profileStyles';
import styled from 'styled-components'; // เพิ่ม import นี้เข้าไป

// สร้าง Wrapper ขึ้นมาใหม่เพื่อคุม Layout โดยเฉพาะ
const FormWrapper = styled.form`
  display: grid;
  grid-template-columns: 150px 1fr;
  gap: 20px;
  align-items: center;
  width: 100%;
`;

// 🟢 เดิมคีย์ "user_profile_address" เป็นคีย์กลางใช้ร่วมกันทุกบัญชีบนเบราว์เซอร์เครื่องเดียวกัน
// (คอมโพเนนต์นี้มีสเตทของตัวเอง ไม่ได้ใช้ props ที่หน้า profile/index.jsx ส่งมาเลย)
// ทำให้ที่อยู่ของบัญชีหนึ่งไปโผล่ในอีกบัญชีได้ ตอนนี้แยกคีย์ตามอีเมลบัญชีที่ login อยู่แทน
function getAddressStorageKey() {
  const email = localStorage.getItem("local_user_email");
  return email ? `user_profile_address_${email}` : "user_profile_address_guest";
}

export default function ProfileAddress() {
  const [addressData, setAddressData] = useState(() => {
    const savedAddress = localStorage.getItem(getAddressStorageKey());
    return savedAddress ? JSON.parse(savedAddress) : {
      receiverName: '', phone: '', detail: '', province: '', district: '', postalCode: ''
    };
  });

  const handleChange = (e) => setAddressData({ ...addressData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem(getAddressStorageKey(), JSON.stringify(addressData));
    alert("🎉 บันทึกที่อยู่จัดส่งสินค้าเรียบร้อยแล้ว!");
  };

  const handleDelete = () => {
    if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลที่อยู่นี้?")) {
      localStorage.removeItem(getAddressStorageKey());
      setAddressData({ receiverName: '', phone: '', detail: '', province: '', district: '', postalCode: '' });
      alert("🗑️ ลบข้อมูลที่อยู่เรียบร้อยแล้ว");
    }
  };

  return (
    <>
      <S.HeaderSection>
        <S.PageTitle>ที่อยู่ของฉัน</S.PageTitle>
        <S.PageSubTitle>จัดการที่อยู่สำหรับการจัดส่งสินค้าของคุณให้ถูกต้อง</S.PageSubTitle>
      </S.HeaderSection>

      <S.FormContainer>
        {/* ใช้ FormWrapper ใหม่ที่เราสร้างขึ้นแทน S.InputsBlock เดิม */}
        <FormWrapper onSubmit={handleSubmit}>

          {[
            { label: "ชื่อผู้รับ", name: "receiverName", placeholder: "ชื่อ-นามสกุล" },
            { label: "เบอร์โทรศัพท์", name: "phone", placeholder: "เบอร์โทรศัพท์" },
            { label: "ที่อยู่", name: "detail", placeholder: "บ้านเลขที่, ซอย, ถนน" },
            { label: "จังหวัด", name: "province", placeholder: "จังหวัด" },
            { label: "เขต / อำเภอ", name: "district", placeholder: "เขตหรืออำเภอ" },
            { label: "รหัสไปรษณีย์", name: "postalCode", placeholder: "รหัสไปรษณีย์ 5 หลัก" }
          ].map((field) => (
            <React.Fragment key={field.name}>
              <S.Label style={{ textAlign: 'right', fontWeight: 'bold' }}>{field.label}</S.Label>
              <S.InputField type="text" name={field.name} value={addressData[field.name]} onChange={handleChange} placeholder={field.placeholder} required />
            </React.Fragment>
          ))}

          {/* ส่วนของปุ่มให้ขยายเต็ม 2 คอลัมน์ */}
          <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px', maxWidth: '400px', marginInline: 'auto', width: '100%' }}>
            <S.SaveButton type="submit">บันทึกที่อยู่</S.SaveButton>
            <button type="button" onClick={handleDelete} style={{ background: "#ff4d4f", color: "white", padding: "12px", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "16px", fontWeight: "bold" }}>
              ลบที่อยู่
            </button>
          </div>
        </FormWrapper>
      </S.FormContainer>
    </>
  );
}
