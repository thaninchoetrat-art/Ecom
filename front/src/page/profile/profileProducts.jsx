import React from 'react';
import * as S from './profileStyles';
import { fetchCategories } from "../products/productService";

export default function ProfileProducts({ newProduct, handleProductChange, handleProductSubmit }) {
  const categories = fetchCategories();

  const handleCustomChange = (e) => {
  const { name, value } = e.target;

  if (name === "categoryId") {
    // อัปเดต ID ก่อน
    handleProductChange({ target: { name: "categoryId", value: value } });

    // อัปเดตชื่อหมวดหมู่ตาม ID ที่เลือก
    const selectedCategory = categories.find(cat => String(cat.categoryId) === String(value));
    handleProductChange({ 
      target: { 
        name: "category", 
        value: selectedCategory ? selectedCategory.categoryName : "สินค้ามือ 2" 
      } 
    });
  } else {
    handleProductChange(e);
  }
};

  // 📸 ฟังก์ชันบีบอัดรูปภาพ
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxSize = 400;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxSize) { height *= maxSize / width; width = maxSize; }
          } else {
            if (height > maxSize) { width *= maxSize / height; height = maxSize; }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);

          handleProductChange({
            target: { name: 'image', value: compressedBase64 }
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
        <S.InputsBlock onSubmit={handleProductSubmit}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <S.FormGroup>
              <S.Label>ชื่อสินค้า</S.Label>
              <S.InputField 
                type="text" name="title" value={newProduct.title} onChange={handleProductChange} placeholder="เช่น Matte Liquid Lipstick" required 
              />
            </S.FormGroup>
            <S.FormGroup>
              <S.Label>ชื่อแบรนด์</S.Label>
              <S.InputField 
                type="text" name="brand" value={newProduct.brand || ''} onChange={handleProductChange} placeholder="เช่น 5 Paul Beauty" 
              />
            </S.FormGroup>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <S.FormGroup>
              <S.Label>ราคาปกติ (บาท)</S.Label>
              <S.InputField type="number" name="price" value={newProduct.price} onChange={handleProductChange} placeholder="590" required />
            </S.FormGroup>
            <S.FormGroup>
              <S.Label>ราคาลดพิเศษ (บาท)</S.Label>
              <S.InputField type="number" name="salePrice" value={newProduct.salePrice || ''} onChange={handleProductChange} placeholder="499" />
            </S.FormGroup>
            <S.FormGroup>
              <S.Label>จำนวนในสต็อก (ชิ้น)</S.Label>
              <S.InputField type="number" name="stock" value={newProduct.stock || ''} onChange={handleProductChange} placeholder="100" required />
            </S.FormGroup>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', alignItems: 'center' }}>
           <S.FormGroup>
              <S.Label>หมวดหมู่สินค้า</S.Label>
                              <select 
                  name="categoryId"
                  value={newProduct.categoryId || ""}
                  onChange={handleCustomChange}
                >
                  <option value="">-- เลือกหมวดหมู่สินค้า --</option>
                  {categories.map((cat) => (
                    // ตรวจสอบว่า cat.categoryId คือ "1" หรือ "2" จริงๆ
                    <option key={cat.categoryId} value={cat.categoryId}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
            </S.FormGroup>

            <S.FormGroup>
              <S.Label>อัปโหลดรูปภาพสินค้าหลัก</S.Label>
              <input 
                type="file" accept="image/*" onChange={handleFileChange}
                style={{ color: '#1f2937', padding: '10px 0', fontWeight: '500', cursor: 'pointer', border:'1px solid #ffd1d7', borderRadius: '12px', padding: '12px' }} 
              />
              {newProduct.image && (
                <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <img src={newProduct.image} alt="Preview" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #ffd1d7' }} />
                  <span style={{ fontSize: '12px', color: '#ec4899', fontWeight: '600' }}>รูปภาพถูกบีบอัดแล้ว!</span>
                </div>
              )}
            </S.FormGroup>
          </div>

          <S.FormGroup>
            <S.Label>รายละเอียด / คำอธิบายสรรพคุณสินค้า</S.Label>
            <textarea 
              name="description" value={newProduct.description} onChange={handleProductChange}
              placeholder="ระบุวิธีใช้ ส่วนผสมหลัก หรือจุดเด่นของสินค้า..." rows="4"
              style={{ background: '#ffffff', color: '#111827', border: '1px solid #ffd1d7', padding: '12px', borderRadius: '12px', outline: 'none', resize: 'vertical', width: '100%', fontWeight: '500' }}
            />
          </S.FormGroup>

          <S.SaveButton type="submit">➕ บันทึกและนำสินค้าขึ้นหน้าร้าน</S.SaveButton>
        </S.InputsBlock>
      </S.FormContainer>
    </>
  );
}