import React from 'react';
import * as S from './profileStyles';

export default function ProfileProducts({ newProduct, handleProductChange, handleProductSubmit }) {
  return (
    <>
      <S.HeaderSection>
        <S.PageTitle>ระบบจัดการสินค้า</S.PageTitle>
        <S.PageSubTitle>เพิ่มและอัปเดตข้อมูลสินค้าเครื่องสำอางเข้าสู่หน้าร้านของคุณ</S.PageSubTitle>
      </S.HeaderSection>
      <S.FormContainer>
        <S.InputsBlock onSubmit={handleProductSubmit}>
          
          {/* แถวที่ 1: ชื่อสินค้า และ ชื่อแบรนด์ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <S.FormGroup>
              <S.Label>ชื่อสินค้า</S.Label>
              <S.InputField 
                type="text" 
                name="title" 
                value={newProduct.title} 
                onChange={handleProductChange} 
                placeholder="เช่น Matte Liquid Lipstick" 
                required 
              />
            </S.FormGroup>
            <S.FormGroup>
              <S.Label>ชื่อแบรนด์</S.Label>
              <S.InputField 
                type="text" 
                name="brand" 
                value={newProduct.brand || ''} 
                onChange={handleProductChange} 
                placeholder="เช่น 5 Paul Beauty" 
              />
            </S.FormGroup>
          </div>

          {/* แถวที่ 2: ราคาปกติ, ราคาลดพิเศษ และ จำนวนสินค้าในสต็อก */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <S.FormGroup>
              <S.Label>ราคาปกติ (บาท)</S.Label>
              <S.InputField 
                type="number" 
                name="price" 
                value={newProduct.price} 
                onChange={handleProductChange} 
                placeholder="590" 
                required 
              />
            </S.FormGroup>
            <S.FormGroup>
              <S.Label>ราคาลดพิเศษ (บาท)</S.Label>
              <S.InputField 
                type="number" 
                name="salePrice" 
                value={newProduct.salePrice || ''} 
                onChange={handleProductChange} 
                placeholder="499 (ปล่อยว่างได้)" 
              />
            </S.FormGroup>
            <S.FormGroup>
              <S.Label>จำนวนในสต็อก (ชิ้น)</S.Label>
              <S.InputField 
                type="number" 
                name="stock" 
                value={newProduct.stock || ''} 
                onChange={handleProductChange} 
                placeholder="100" 
                required 
              />
            </S.FormGroup>
          </div>

          {/* แถวที่ 3: หมวดหมู่สินค้า และ อัปโหลดรูปภาพ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
            <S.FormGroup>
              <S.Label>หมวดหมู่สินค้า</S.Label>
              <select 
                name="category"
                value={newProduct.category}
                onChange={handleProductChange}
                style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '8px', outline: 'none', width: '100%' }}
              >
                <option value="Cosmetic Collection">Cosmetic Collection</option>
                <option value="Skincare Collection">Skincare Collection</option>
                <option value="Perfume Collection">Perfume Collection</option>
              </select>
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>อัปโหลดรูปภาพสินค้าหลัก</S.Label>
              <input type="file" accept="image/*" style={{ color: '#fff', padding: '10px 0' }} />
            </S.FormGroup>
          </div>

          {/* แถวที่ 4: รายละเอียดสินค้า */}
          <S.FormGroup>
            <S.Label>รายละเอียด / คำอธิบายสรรพคุณสินค้า</S.Label>
            <textarea 
              name="description"
              value={newProduct.description}
              onChange={handleProductChange}
              placeholder="ระบุวิธีใช้ ส่วนผสมหลัก หรือจุดเด่นของสินค้า..."
              rows="4"
              style={{ background: '#1a1a1a', color: '#fff', border: '1px solid #333', padding: '12px', borderRadius: '8px', outline: 'none', resize: 'vertical' }}
            />
          </S.FormGroup>

          <S.SaveButton type="submit">➕ บันทึกและนำสินค้าขึ้นหน้าร้าน</S.SaveButton>
        </S.InputsBlock>
      </S.FormContainer>
    </>
  );
}