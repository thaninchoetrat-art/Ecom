import React, { useState } from 'react';
import * as S from './profileStyles';

export default function ProfileAddress() {
  // 1. ดึงข้อมูลที่อยู่เก่าจาก localStorage (ถ้ามี)
  const [addressData, setAddressData] = useState(() => {
    const savedAddress = localStorage.getItem("user_profile_address");
    return savedAddress ? JSON.parse(savedAddress) : {
      receiverName: '',
      phone: '',
      detail: '',
      province: '',
      district: '',
      postalCode: ''
    };
  });

  const handleChange = (e) => {
    setAddressData({ ...addressData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 2. บันทึกข้อมูลที่อยู่ลง localStorage
    localStorage.setItem("user_profile_address", JSON.stringify(addressData));
    alert("🎉 บันทึกที่อยู่จัดส่งสินค้าเรียบร้อยแล้ว!");
  };

  return (
    <>
      <S.HeaderSection>
        <S.PageTitle>ที่อยู่ของฉัน</S.PageTitle>
        <S.PageSubTitle>จัดการที่อยู่สำหรับการจัดส่งสินค้าของคุณให้ถูกต้อง</S.PageSubTitle>
      </S.HeaderSection>

      <S.FormContainer>
        <S.InputsBlock onSubmit={handleSubmit}>
          
          <S.FormGroup>
            <S.Label>ชื่อผู้รับ</S.Label>
            <S.InputField 
              type="text" 
              name="receiverName" 
              value={addressData.receiverName} 
              onChange={handleChange} 
              placeholder="ชื่อ-นามสกุล ผู้รับสินค้า"
              required
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>เบอร์โทรศัพท์</S.Label>
            <S.InputField 
              type="text" 
              name="phone" 
              value={addressData.phone} 
              onChange={handleChange} 
              placeholder="เบอร์โทรศัพท์ผู้รับสินค้า"
              required
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>ที่อยู่ (บ้านเลขที่, ซอย, ถนน)</S.Label>
            <S.InputField 
              type="text" 
              name="detail" 
              value={addressData.detail} 
              onChange={handleChange} 
              placeholder="เช่น 123/45 ม.6 ซอยสุขุมวิท..."
              required
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>จังหวัด</S.Label>
            <S.InputField 
              type="text" 
              name="province" 
              value={addressData.province} 
              onChange={handleChange} 
              placeholder="กรอกจังหวัด"
              required
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>เขต / อำเภอ</S.Label>
            <S.InputField 
              type="text" 
              name="district" 
              value={addressData.district} 
              onChange={handleChange} 
              placeholder="กรอกเขตหรืออำเภอ"
              required
            />
          </S.FormGroup>

          <S.FormGroup>
            <S.Label>รหัสไปรษณีย์</S.Label>
            <S.InputField 
              type="text" 
              name="postalCode" 
              value={addressData.postalCode} 
              onChange={handleChange} 
              placeholder="กรอกรหัสไปรษณีย์ 5 หลัก"
              maxLength="5"
              required
            />
          </S.FormGroup>

          <S.SaveButton type="submit">บันทึกที่อยู่</S.SaveButton>
        </S.InputsBlock>
      </S.FormContainer>
    </>
  );
}