import styled from 'styled-components';

export const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100vw;
  background-color: #f8f1f1; /* สีพื้นหลังรอบนอกโทนสว่างนวลตาตามภาพของคุณ */
  box-sizing: border-box;
  margin: 0;
  padding: 20px;
`;

export const Container = styled.div`
  background-color: #fff;
  border-radius: 24px; /* ความมนละมุนรอบกล่องตามรูปภาพ */
  box-shadow: 0 14px 28px rgba(0,0,0,0.05), 0 10px 10px rgba(0,0,0,0.03);
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
  ` : null}
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
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 50px;
  height: 100%;
  text-align: center;
`;

export const Title = styled.h1`
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 20px 0;
  color: #333333;
`;

export const Input = styled.input`
  background-color: #ffffff;
  border: 1px solid #ffe3ec; /* ขอบสีชมพูบาง ๆ ตามรูป */
  border-radius: 12px; /* ความมนของช่องกรอกข้อมูลตามรูป */
  padding: 15px;
  margin: 8px 0;
  width: 100%;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
  &::placeholder {
    color: #bbb;
  }
`;

export const Button = styled.button`
  border-radius: 12px; /* ความมนของปุ่มตามรูป */
  border: none;
  background: linear-gradient(to right, #ec407a, #f43f5e); /* สีชมพูโทนหวานตามรูปภาพ */
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
  padding: 12px 45px;
  letter-spacing: 0.5px;
  cursor: pointer;
  margin-top: 20px;
  box-shadow: 0 8px 16px rgba(236, 64, 122, 0.3); /* เงาฟุ้งใต้ปุ่ม */
  transition: transform 80ms ease-in;
  &:active{
      transform: scale(0.95);
  }
  &:focus {
      outline: none;
  }
`;

export const GhostButton = styled(Button)`
  background-color: transparent;
  border: 1px solid #ffffff;
  box-shadow: none;
  margin-top: 15px;
`;

export const Anchor = styled.a`
  color: #888888;
  font-size: 13px;
  text-decoration: none;
  margin: 15px 0;
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
  background: #f43f5e;
  background: -webkit-linear-gradient(to bottom right, #f43f5e, #ec407a);
  background: linear-gradient(to bottom right, #f43f5e, #ec407a); /* ฝั่งขวาสีชมพูสดใสไล่เฉดตามรูป */
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
  ${props => props.signinIn !== true ? `transform: translateX(50%);` : null}
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
  transform: translateX(-200%);
  ${props => props.signinIn !== true ? `transform: translateX(0);` : null}
`;

export const RightOverlayPanel = styled(OverlayPanel)`
  right: 0;
  transform: translateX(0);
  ${props => props.signinIn !== true ? `transform: translateX(200%);` : null}
`;