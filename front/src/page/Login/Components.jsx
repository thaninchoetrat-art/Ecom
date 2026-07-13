import styled from 'styled-components';

// 🌟 ตัวนี้เพิ่มเข้ามาใหม่ เพื่อจัดทุกอย่างให้อยู่กึ่งกลางหน้าจอพอดี
export const PageWrapper = styled.div`
  display: flex;
  justify-content: center; /* จัดกึ่งกลางแนวนอน */
  align-items: center;     /* จัดกึ่งกลางแนวตั้ง */
  min-height: 100vh;       /* ความสูงเต็มหน้าจอ */
  width: 100vw;            /* ความกว้างเต็มหน้าจอ */
  background-color: #121212; /* สีพื้นหลังโทนดาร์กตามรูปของคุณ */
  box-sizing: border-box;
  margin: 0;
  padding: 20px;
`;

export const Container = styled.div`
  background-color: rgba(255, 255, 255, 0.85); /* เปลี่ยนเป็นขาวโปร่งแสง */
  backdrop-filter: blur(8px); /* เอฟเฟกต์กระจกฝ้าพรีเมียม */
  border-radius: 24px; /* ปรับให้มนละมุนขึ้นเข้ากับดีไซน์ใหม่ */
  border: 1px solid #fbcfe8; /* เปลี่ยนขอบเป็นสีชมพูพาสเทล */
  box-shadow: 0 20px 25px -5px rgba(219, 39, 119, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02); /* เงาฟุ้งโทนชมพูบางๆ */
  position: relative;
  overflow: hidden;
  width: 768px;
  max-width: 100%;
  min-height: 480px;
`;

export const SignUpContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
  ${props => props.signinIn !== true ? `
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
  `
    : null}
`;

export const SignInContainer = styled.div`
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s ease-in-out;
  left: 0;
  width: 50%;
  z-index: 2;
  ${props => (props.signinIn !== true ? `transform: translateX(100%);` : null)}
`;

export const Form = styled.form`
  background-color: rgba(255, 255, 255, 0.9); /* พื้นหลังฟอร์มสีขาวคลีน */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

export const Title = styled.h1`
  font-weight: bold; /* ปรับให้หนาขึ้นดูโมเดิร์นแบบ Apple */
  letter-spacing: 0.5px;
  margin: 0 0 10px 0;
  color: #111827; /* สีตัวอักษรเข้มอ่านง่าย */
  font-family: 'sans-serif'; /* ฟอนต์คลีนมินิมอล */
`;

export const Input = styled.input`
  background-color: #ffffff; /* ช่องกรอกสีขาวสะอาด */
  border: 1px solid #fbcfe8; /* ขอบชมพูอ่อนพาสเทล */
  border-radius: 12px; /* เพิ่มความมนให้ช่องอินพุต */
  padding: 12px 15px;
  margin: 8px 0;
  width: 100%;
  color: #374151;
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
  box-sizing: border-box;
  &:focus {
      border-color: #db2777; /* ตอนกดจะเปลี่ยนเป็นขอบชมพูเข้มเข้มขึ้น */
      box-shadow: 0 0 0 3px rgba(219, 39, 119, 0.1); /* ออร่าเรืองแสงสีชมพูจางๆ */
  }
`;

export const Button = styled.button`
  border-radius: 12px; /* ปรับให้มนเข้ากับ UI แดชบอร์ด */
  border: none;
  background: linear-gradient(to right, #ec4899, #f43f5e); /* ไล่เฉดสีชมพู-โรสพรีเมียม */
  color: #ffffff; /* ตัวหนังสือสีขาว */
  font-size: 14px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 0.5px;
  cursor: pointer;
  margin-top: 15px;
  box-shadow: 0 10px 15px -3px rgba(236, 72, 153, 0.2); /* เงาปุ่มสีชมพูซอฟต์ๆ */
  transition: all 0.2s ease;
  &:hover {
       transform: translateY(-1px);
       box-shadow: 0 12px 20px -3px rgba(236, 72, 153, 0.3);
  }
  &:active{
       transform: scale(0.98);
  }
  &:focus {
       outline: none;
  }
`;

export const GhostButton = styled(Button)`
  background: transparent;
  border: 1px solid #ffffff;
  color: #ffffff;
  box-shadow: none;
  &:hover {
       background-color: rgba(255, 255, 255, 0.15);
       box-shadow: none;
       transform: none;
  }
`;

export const Anchor = styled.a`
  color: #6b7280;
  font-size: 13px;
  text-decoration: none;
  margin: 15px 0;
  transition: color 0.3s ease;
  &:hover {
       color: #db2777; /* ชี้แล้วเปลี่ยนเป็นสีชมพูเด่น */
  }
`;

export const OverlayContainer = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s ease-in-out;
  z-index: 100;
  ${props => props.signinIn !== true ? `transform: translateX(-100%);` : null}
`;

export const Overlay = styled.div`
  /* เปลี่ยนแผงสลับหน้าเป็นพื้นหลัง Gradient ชมพูไล่เฉดหวานหรูดูแพง */
  background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  ${props => (props.signinIn !== true ? `transform: translateX(50%);` : null)}
`;

export const OverlayPanel = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
`;

export const LeftOverlayPanel = styled(OverlayPanel)`
  transform: translateX(-20%);
  ${props => props.signinIn !== true ? `transform: translateX(0);` : null}
`;

export const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${props => props.signinIn !== true ? `transform: translateX(20%);` : null}
`;

export const Paragraph = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
  color: rgba(255, 255, 255, 0.85); /* ข้อความบนสีชมพูให้ออกขาวนวล */
  margin: 20px 0 30px;
`;