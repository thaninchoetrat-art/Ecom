import React from 'react';
import * as S from './profileStyles';

export default function ProfileForm({ profileData, handleChange, handleSubmit }) {
  return (
    <S.InputsBlock onSubmit={handleSubmit}>
      {/* 1. ชื่อผู้ใช้ (ดึงจากระบบ แก้ไขไม่ได้) */}
      <S.FormGroup>
        <S.Label>ชื่อผู้ใช้</S.Label>
        <span style={{ color: '#fff', fontSize: '16px', paddingLeft: '10px' }}>
          {profileData.username}
        </span>
      </S.FormGroup>

      {/* 2. ชื่อ-นามสกุล */}
      <S.FormGroup>
        <S.Label>ชื่อ-นามสกุล</S.Label>
        <S.InputField
          type="text"
          name="fullName"
          value={profileData.fullName || ''}
          onChange={handleChange}
          placeholder="กรอกชื่อจริงของคุณ"
        />
      </S.FormGroup>

      {/* 3. อีเมล (เปิดให้พิมพ์แก้ไขได้จริง และเซฟลงเครื่องได้) */}
      <S.FormGroup>
        <S.Label>อีเมล</S.Label>
        <S.InputField
          type="email"
          name="email"
          value={profileData.email || ''}
          onChange={handleChange}
          placeholder="เช่น your-email@gmail.com"
          required
        />
      </S.FormGroup>

      {/* 4. หมายเลขโทรศัพท์ */}
      <S.FormGroup>
        <S.Label>หมายเลขโทรศัพท์</S.Label>
        <S.InputField
          type="text"
          name="phone"
          value={profileData.phone || ''}
          onChange={handleChange}
          placeholder="กรอกเบอร์โทรศัพท์"
        />
      </S.FormGroup>

      {/* 5. เพศ */}
      <S.FormGroup>
        <S.Label>เพศ</S.Label>
        <div style={{ display: 'flex', gap: '20px', color: '#fff', paddingTop: '5px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="gender"
              value="male"
              checked={profileData.gender === 'male'}
              onChange={handleChange}
            />
            ชาย
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="gender"
              value="female"
              checked={profileData.gender === 'female'}
              onChange={handleChange}
            />
            หญิง
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="gender"
              value="other"
              checked={profileData.gender === 'other'}
              onChange={handleChange}
            />
            อื่นๆ
          </label>
        </div>
      </S.FormGroup>

      {/* 6. วัน/เดือน/ปี เกิด */}
      <S.FormGroup>
        <S.Label>วัน/เดือน/ปี เกิด</S.Label>
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* วัน */}
          <select
            name="birthDay"
            value={profileData.birthDay || ''}
            onChange={handleChange}
            style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #333', padding: '10px', borderRadius: '8px', flex: 1, outline: 'none' }}
          >
            <option value="">วันที่</option>
            {[...Array(31)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>

          {/* เดือน */}
          <select
            name="birthMonth"
            value={profileData.birthMonth || ''}
            onChange={handleChange}
            style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #333', padding: '10px', borderRadius: '8px', flex: 1, outline: 'none' }}
          >
            <option value="">เดือน</option>
            {['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'].map((month, idx) => (
              <option key={idx} value={idx + 1}>{month}</option>
            ))}
          </select>

          {/* ปี */}
          <select
            name="birthYear"
            value={profileData.birthYear || ''}
            onChange={handleChange}
            style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #333', padding: '10px', borderRadius: '8px', flex: 1, outline: 'none' }}
          >
            <option value="">ปี</option>
            {[...Array(80)].map((_, i) => {
              const year = new Date().getFullYear() + 543 - i; // แสดงเป็น ปี พ.ศ.
              return <option key={year} value={year}>{year}</option>;
            })}
          </select>
        </div>
      </S.FormGroup>

      {/* ปุ่มกดบันทึก */}
      <S.SaveButton type="submit">บันทึก</S.SaveButton>
    </S.InputsBlock>
  );
}