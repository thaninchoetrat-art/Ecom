import React from "react";
import * as Components from './Components';
import { useNavigate } from "react-router-dom";

function Login() { // เปลี่ยนชื่อ function เป็น Login ให้ตรงกับชื่อไฟล์
    const navigate = useNavigate();
    const [signIn, toggle] = React.useState(true);

    // URL ของ API หลังบ้าน
    const BACKEND_URL = "http://localhost:4000/api/auth";

    // State สำหรับสมัครสมาชิก
    const [signUpData, setSignUpData] = React.useState({
        name: "",
        email: "",
        password: ""
    });

    // State สำหรับล็อกอิน
    const [signInData, setSignInData] = React.useState({
        email: "",
        password: ""
    });

    const handleSignUpChange = (e) => {
        setSignUpData({ ...signUpData, [e.target.name]: e.target.value });
    };

    const handleSignInChange = (e) => {
        setSignInData({ ...signInData, [e.target.name]: e.target.value });
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BACKEND_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signUpData)
            });
            const data = await response.json();
            if (data.ok) {
                alert("สมัครสมาชิกสำเร็จ!");
                setSignUpData({ name: "", email: "", password: "" });
                toggle(true);
            } else {
                alert(data.message || "เกิดข้อผิดพลาด");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
        }
    };

   const handleSignInSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signInData)
            });
            const data = await response.json();

            if (data.ok) {
                // 1. กำหนดค่า Role พื้นฐานจาก Backend
                let finalRole = data.user.role;

                // 2. 🌟 บังคับตั้งค่า Role เป็น 'admin' สำหรับอีเมลนี้โดยเฉพาะ (กรณีทำงานบน Local)
                if (signInData.email === "admin@gmail.com") {
                    finalRole = "admin";
                }

                // 3. บันทึกข้อมูลลง LocalStorage
                localStorage.setItem("user_token", data.token);
                localStorage.setItem("is_logged_in", "true");
                localStorage.setItem("local_user_name", data.user.name);
                localStorage.setItem("user_role", finalRole); // ใช้ค่าที่บังคับไว้ (ถ้ามี)

                alert(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับคุณ ${data.user.name}`);

                // 4. ตรวจสอบ Role เพื่อเปลี่ยนหน้า
                if (finalRole === "admin") {
                    navigate("/admin");
                } else if (finalRole === "staff") {
                    navigate("/staff");
                } else {
                    navigate("/");
                }
            } else {
                alert(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            }
        } catch (error) {
            console.error("Error Logging in:", error);
            alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบ Backend");
        }
    };

    return (
        <Components.Container>
            {/* ฝั่ง REGISTER */}
            <Components.SignUpContainer signinIn={signIn}>
                <Components.Form onSubmit={handleSignUpSubmit}>
                    <Components.Title>Create Account</Components.Title>
                    <Components.Input type='text' placeholder='Name' name='name' value={signUpData.name} onChange={handleSignUpChange} />
                    <Components.Input type='email' placeholder='Email' name='email' value={signUpData.email} onChange={handleSignUpChange} />
                    <Components.Input type='password' placeholder='Password' name='password' value={signUpData.password} onChange={handleSignUpChange} />
                    <Components.Button type="submit">Sign Up</Components.Button>
                </Components.Form>
            </Components.SignUpContainer>

            {/* ฝั่ง LOGIN */}
            <Components.SignInContainer signinIn={signIn}>
                <Components.Form onSubmit={handleSignInSubmit}>
                    <Components.Title>Sign in</Components.Title>
                    <Components.Input type='email' placeholder='Email' name='email' value={signInData.email} onChange={handleSignInChange} />
                    <Components.Input type='password' placeholder='Password' name='password' value={signInData.password} onChange={handleSignInChange} />
                    <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                    <Components.Button type="submit">Sign In</Components.Button>
                </Components.Form>
            </Components.SignInContainer>

            {/* Overlay */}
            <Components.OverlayContainer signinIn={signIn}>
                <Components.Overlay signinIn={signIn}>
                    <Components.LeftOverlayPanel signinIn={signIn}>
                        <Components.Title>Welcome Back!</Components.Title>
                        <Components.GhostButton onClick={() => toggle(true)}>Sign In</Components.GhostButton>
                    </Components.LeftOverlayPanel>
                    <Components.RightOverlayPanel signinIn={signIn}>
                        <Components.Title>Hello, Friend!</Components.Title>
                        <Components.GhostButton onClick={() => toggle(false)}>Sign Up</Components.GhostButton>
                    </Components.RightOverlayPanel>
                </Components.Overlay>
            </Components.OverlayContainer>
        </Components.Container>
    );
}

export default Login;