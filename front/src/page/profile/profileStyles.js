import styled from 'styled-components';

export const ProfileWrapper = styled.div`
  display: flex;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  gap: 30px;
  font-family: 'sans-serif';
  background-color: #fff5f5; /* พื้นหลังภายนอกชมพูระเรื่อซอฟต์ๆ */
  min-height: 80vh;
`;

// === แถบ Sidebar ด้านซ้าย ===
export const Sidebar = styled.div`
  width: 280px;
  flex-shrink: 0;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding-bottom: 20px;
  border-bottom: 1px solid #fecdd3;
  margin-bottom: 20px;
`;

export const AvatarThumb = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ec4899;
`;

export const UsernameText = styled.div`
  font-weight: bold;
  color: #1f2937;
  font-size: 15px;
`;

export const EditLink = styled.div`
  font-size: 13px;
  color: #9ca3af;
  cursor: pointer;
  &:hover { color: #db2777; }
`;

export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 15px;
  font-size: 14px;
  color: ${props => props.active ? '#db2777' : '#4b5563'};
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  background-color: ${props => props.active ? '#ffe4e6' : 'transparent'};
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: #fff1f2;
    color: #db2777;
  }
`;

// === ฝั่งเนื้อหาข้อมูลส่วนตัวด้านขวา ===
export const MainContent = styled.div`
  flex-grow: 1;
  background-color: #ffffff;
  border-radius: 24px;
  padding: 40px;
  border: 1px solid #fbcfe8;
  box-shadow: 0 10px 25px -5px rgba(219, 39, 119, 0.03);
`;

export const HeaderSection = styled.div`
  border-bottom: 1px solid #fecdd3;
  padding-bottom: 20px;
  margin-bottom: 35px;
`;

export const PageTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  color: #111827;
  font-weight: bold;
`;

export const PageSubTitle = styled.p`
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #6b7280;
`;

export const FormContainer = styled.div`
  display: flex;
  gap: 50px;
`;

export const InputsBlock = styled.form`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
`;

export const FormGroup = styled.div`
  display: flex;
  align-items: center;
`;

export const Label = styled.label`
  width: 140px;
  font-size: 14px;
  color: #6b7280;
  text-align: right;
  padding-right: 30px;
  flex-shrink: 0;
`;

export const StaticText = styled.span`
  font-size: 14px;
  color: #111827;
  font-weight: 500;
`;

export const InputField = styled.input`
  width: 100%;
  max-width: 450px;
  padding: 10px 14px;
  border: 1px solid #fbcfe8;
  border-radius: 12px;
  font-size: 14px;
  outline: none;
  transition: all 0.2s;
  &:focus {
    border-color: #db2777;
    box-shadow: 0 0 0 3px rgba(219, 39, 119, 0.1);
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #374151;
`;

export const SelectGroup = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  max-width: 450px;
  
  select {
    flex: 1;
    padding: 10px;
    border: 1px solid #fbcfe8;
    border-radius: 12px;
    outline: none;
    font-size: 14px;
    background-color: #fff;
  }
`;

export const SaveButton = styled.button`
  margin-left: 140px;
  width: 140px;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(to right, #ec4899, #f43f5e);
  color: white;
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.2);
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 20px -3px rgba(236, 72, 153, 0.3);
  }
`;

// === ฝั่งอัปโหลดรูปภาพขวาขวาสุด ===
export const ImageUploadBlock = styled.div`
  width: 220px;
  border-left: 1px solid #fecdd3;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 40px;
  gap: 15px;
`;

export const BigAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #fbcfe8;
`;

export const UploadButton = styled.label`
  padding: 8px 16px;
  border: 1px solid #fbcfe8;
  border-radius: 10px;
  font-size: 13px;
  color: #4b5563;
  cursor: pointer;
  background-color: #fff;
  transition: all 0.2s;
  &:hover {
    background-color: #fff1f2;
    color: #db2777;
    border-color: #db2777;
  }
`;

export const UploadHint = styled.p`
  font-size: 12px;
  color: #9ca3af;
  text-align: center;
  line-height: 1.6;
  margin: 0;
`;