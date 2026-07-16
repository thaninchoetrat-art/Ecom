import React from 'react';
import * as S from './profileStyles';
import { fetchCategories } from "../products/productService";

export default function ProfileProducts({ newProduct, handleProductChange, handleProductSubmit }) {
  const categories = fetchCategories() || [];

  // 📸 ฟังก์ชันบีบอัดรูปภาพก่อนเก็บลง State เพื่อแก้ปัญหา localStorage เต็ม
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          // สร้าง Canvas เพื่อลดขนาดรูป
          const canvas = document.createElement('canvas');
          const maxSize = 400; // กำหนดความกว้างสูงสุดของรูป (px) - ยิ่งน้อยยิ่งเซฟพื้นที่
          let width = img.width;
          let height = img.height;

          // คำนวณอัตราส่วนเพื่อไม่ให้รูปบิดเบี้ยว
          if (width > height) {
            if (width > maxSize) { height *= maxSize / width; width = maxSize; }
          } else {
            if (height > maxSize) { width *= maxSize / height; height = maxSize; }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // บีบอัดรูปเป็น JPEG คุณภาพ 0.6 (60%) เพื่อลดขนาดไฟล์ลงอย่างมาก
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);

          // ส่งค่าที่บีบอัดแล้วกลับไปที่หน้าหลัก
          handleProductChange({
            target: {
              name: 'image',
              value: compressedBase64
            }
          });
        };
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <S.HeaderSection>
        <S.PageTitle>ระบบจัดการสินค้า</S.PageTitle>
        <S.PageSubTitle>เพิ่มและอัปเดตข้อมูลสินค้าเครื่องสำอางเข้าสู่หน้าร้านของคุณ</S.PageSubTitle>
      </S.HeaderSection>
      <S.FormContainer>
        {/* 🟢 แก้ไขตรงนี้: บังคับให้ InputsBlock ทำงานเป็นแท็ก HTML <form> เพื่อให้ปุ่ม Submit ทำงานได้ */}
        <S.InputsBlock as="form" onSubmit={handleProductSubmit}>
          
          {/* แถวที่ 1: ชื่อสินค้า และ ชื่อแบรนด์ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <S.FormGroup>
              <S.Label>ชื่อสินค้า</S.Label>
              <S.InputField 
                type="text" 
                name="title" 
                value={newProduct.title || ''} 
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
                min="0"
                value={newProduct.price || ''}
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
                min="0"
                value={newProduct.salePrice || ''}
                onChange={handleProductChange}
                placeholder="499"
              />
            </S.FormGroup>
            <S.FormGroup>
              <S.Label>จำนวนในสต็อก (ชิ้น)</S.Label>
              <S.InputField
                type="number"
                name="stock"
                min="0"
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
                name="categoryId" 
                value={newProduct.categoryId || ''}
                onChange={handleProductChange}
                style={{ background: '#ffffff', color: '#111827', border: '1px solid #ffd1d7', padding: '12px', borderRadius: '12px', outline: 'none', width: '100%', fontWeight: '500' }}
                required
              >
                <option value="">-- เลือกหมวดหมู่สินค้า --</option>
                {categories.map((cat) => (
                  <option key={cat.categoryId} value={cat.categoryId}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>อัปโหลดรูปภาพสินค้าหลัก</S.Label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileChange}
                /* 🟢 แก้ไขตรงนี้: ลบ padding ที่เขียนซ้ำกัน 2 ตัวออกแล้ว */
                style={{ color: '#1f2937', fontWeight: '500', cursor: 'pointer', border:'1px solid #ffd1d7', borderRadius: '12px', padding: '12px' }}
              />
              {newProduct.image && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img 
                    src={newProduct.image} 
                    alt="Preview" 
                    style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ffd1d7' }} 
                  />
                  <span style={{ fontSize: '12px', color: '#ec4899', fontWeight: '600' }}>รูปภาพถูกบีบอัดและพร้อมบันทึก!</span>
                </div>
              )}
            </S.FormGroup>
          </div>

          <S.FormGroup>
            <S.Label>รายละเอียด / คำอธิบายสรรพคุณสินค้า</S.Label>
            <textarea 
              name="description"
              value={newProduct.description || ''}
              onChange={handleProductChange}
              placeholder="ระบุวิธีใช้ ส่วนผสมหลัก หรือจุดเด่นของสินค้า..."
              rows="4"
              style={{ background: '#ffffff', color: '#111827', border: '1px solid #ffd1d7', padding: '12px', borderRadius: '12px', outline: 'none', resize: 'vertical', width: '100%', fontWeight: '500' }}
            />
          </S.FormGroup>

          {/* ปุ่มส่งฟอร์ม */}
          <S.SaveButton type="submit">➕ บันทึกและนำสินค้าขึ้นหน้าร้าน</S.SaveButton>
        </S.InputsBlock>
      </S.FormContainer>
    </>
  );
}