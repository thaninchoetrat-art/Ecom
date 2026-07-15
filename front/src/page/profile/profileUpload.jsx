import React from 'react';
import * as S from './profileStyles';

export default function ProfileUpload({ avatar, handleImageChange }) {
  return (
    <S.ImageUploadBlock>
      <S.BigAvatar src={avatar} alt="" />
      <input 
        type="file" 
        id="avatar-input" 
        accept=".jpg,.jpeg,.png" 
        style={{ display: 'none' }} 
        onChange={handleImageChange} 
      />
      <S.UploadButton htmlFor="avatar-input">เลือกรูป</S.UploadButton>
      <S.UploadHint>
        ขนาดไฟล์: สูงสุด 1 MB<br />
        ไฟล์ที่รองรับ: .JPEG, .PNG
      </S.UploadHint>
    </S.ImageUploadBlock>
  );
}