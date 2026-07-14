import React from 'react';
import * as S from './profileStyles';

export default function ProfileForm({ profileData, handleChange, handleSubmit }) {
  return (
    <S.InputsBlock onSubmit={handleSubmit}>
      {/* 1. ชื่อผู้ใช้ (ปรับปรุง: เปลี่ยนเป็นกล่อง Input ให้พิมพ์เขียนหรือแก้ไขเองได้แล้วครับ) */}
      <S.FormGroup>
        <S.Label>ชื่อผู้ใช้</S.Label>
        <S.InputField
          type="text"
          name="username"
          value={profileData.username || ''}
          onChange={handleChange}
          placeholder="กรอกชื่อผู้ใช้ของคุณ (เช่น nawamin)"
        />
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

      {/* 3. อีเมล */}
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
        <S.RadioGroup style={{ paddingTop: '5px' }}>
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
        </S.RadioGroup>
      </S.FormGroup>

      {/* 6. วัน/เดือน/ปี เกิด */}
      <S.FormGroup>
        <S.Label>วัน/เดือน/ปี เกิด</S.Label>
        <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '450px' }}>
          {/* วัน */}
          <select
            name="birthDay"
            value={profileData.birthDay || ''}
            onChange={handleChange}
            style={{ background: '#ffffff', color: '#111827', border: '1px solid #ffd1d7', padding: '10px', borderRadius: '12px', flex: 1, outline: 'none', fontWeight: '500' }}
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
            style={{ background: '#ffffff', color: '#111827', border: '1px solid #ffd1d7', padding: '10px', borderRadius: '12px', flex: 1, outline: 'none', fontWeight: '500' }}
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
            style={{ background: '#ffffff', color: '#111827', border: '1px solid #ffd1d7', padding: '10px', borderRadius: '12px', flex: 1, outline: 'none', fontWeight: '500' }}
          >
            <option value="">ปี</option>
            {[...Array(80)].map((_, i) => {
              // ดึงปีปัจจุบัน พ.ศ. คีย์เวิร์ดอ้างอิงจากโค้ดเดิม
              const year = new Date().getFullYear() + 543 - i;
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