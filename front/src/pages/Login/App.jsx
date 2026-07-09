import React from "react";
import * as Components from './Components';

function App() {
    const [signIn, toggle] = React.useState(true);

    // URL ของ API หลังบ้านของคุณ (Port 4000 ตามตัวแปร server.js)
    const BACKEND_URL = "http://localhost:4000/api/auth";

    // 1. ตัวจำค่า (State) สำหรับฝั่ง สมัครสมาชิก
    const [signUpData, setSignUpData] = React.useState({
        name: "",
        email: "",
        password: ""
    });

    // 2. ตัวจำค่า (State) สำหรับฝั่ง ล็อกอิน
    const [signInData, setSignInData] = React.useState({
        email: "",
        password: ""
    });

    // 3. ฟังก์ชันอัปเดตค่าเวลาพิมพ์ ฝั่ง สมัครสมาชิก
    const handleSignUpChange = (e) => {
        setSignUpData({
            ...signUpData,
            [e.target.name]: e.target.value
        });
    };

    // 4. ฟังก์ชันอัปเดตค่าเวลาพิมพ์ ฝั่ง ล็อกอิน
    const handleSignInChange = (e) => {
        setSignInData({
            ...signInData,
            [e.target.name]: e.target.value
        });
    };

    // 5. ฟังก์ชันเวลากดปุ่ม Sign Up (ส่งข้อมูลไปบันทึกบนฐานข้อมูลหลังบ้านจริง)
    const handleSignUpSubmit = async (e) => {
        e.preventDefault();

        if (!signUpData.name || !signUpData.email || !signUpData.password) {
            alert("กรุณากรอกข้อมูลสมัครสมาชิกให้ครบถ้วน");
            return;
        }

        try {
            // ยิง HTTP POST ไปที่เส้นสมัครสมาชิกของหลังบ้าน
            const response = await fetch(`${BACKEND_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signUpData)
            });

            const data = await response.json();

            if (data.ok) {
                alert(`สมัครสมาชิกสำเร็จ! ${data.message}`);
                // ล้างช่องฟอร์มหลังลงทะเบียนสำเร็จ
                setSignUpData({ name: "", email: "", password: "" });
                // ดีดหน้าต่างสลับไปหน้า Sign In เพื่อให้ลูกค้าพร้อมล็อกอิน
                toggle(true);
            } else {
                alert(data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
            }
        } catch (error) {
            console.error("Error Registering:", error);
            alert("ไม่สามารถติดต่อเซิร์ฟเวอร์หลังบ้านได้ กรุณาตรวจสอบว่ารัน backend ไว้หรือยัง");
        }
    };

    // 6. ฟังก์ชันเวลากดปุ่ม Sign In (เช็คกับตรรกะหลังบ้าน + รับตั๋ว JWT จริง)
    const handleSignInSubmit = async (e) => {
        e.preventDefault();

        if (!signInData.email || !signInData.password) {
            alert("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
            return;
        }

        try {
            // ยิง HTTP POST ไปให้หลังบ้านตรวจสอบรหัสผ่าน
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(signInData)
            });

            const data = await response.json();

            if (data.ok) {
                // บันทึกตั๋ว Token ตัวจริง และชื่อที่ได้กลับมาจากฐานข้อมูล
                localStorage.setItem("user_token", data.token);
                localStorage.setItem("is_logged_in", "true");
                localStorage.setItem("local_user_name", data.user.name);

                alert(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับกลับมาคุณ ${data.user.name}`);
                window.location.reload(); // รีเฟรชเพื่อเปลี่ยนสลับไปหน้าแรกของร้านค้า
            } else {
                alert(data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง");
            }
        } catch (error) {
            console.error("Error Logging in:", error);
            alert("ไม่สามารถติดต่อเซิร์ฟเวอร์หลังบ้านได้ กรุณาตรวจสอบว่ารัน backend ไว้หรือยัง");
        }
    };

    return (
        <Components.Container>

            {/* ฝั่ง REGISTER (Sign Up) */}
            <Components.SignUpContainer signinIn={signIn}>
                <Components.Form onSubmit={handleSignUpSubmit}>
                    <Components.Title>Create Account</Components.Title>
                    <Components.Input
                        type='text'
                        placeholder='Name'
                        name='name'
                        value={signUpData.name}
                        onChange={handleSignUpChange}
                    />
                    <Components.Input
                        type='email'
                        placeholder='Email'
                        name='email'
                        value={signUpData.email}
                        onChange={handleSignUpChange}
                    />
                    <Components.Input
                        type='password'
                        placeholder='Password'
                        name='password'
                        value={signUpData.password}
                        onChange={handleSignUpChange}
                    />
                    <Components.Button type="submit">Sign Up</Components.Button>
                </Components.Form>
            </Components.SignUpContainer>

            {/* ฝั่ง LOGIN (Sign In) */}
            <Components.SignInContainer signinIn={signIn}>
                <Components.Form onSubmit={handleSignInSubmit}>
                    <Components.Title>Sign in</Components.Title>
                    <Components.Input
                        type='email'
                        placeholder='Email'
                        name='email'
                        value={signInData.email}
                        onChange={handleSignInChange}
                    />
                    <Components.Input
                        type='password'
                        placeholder='Password'
                        name='password'
                        value={signInData.password}
                        onChange={handleSignInChange}
                    />
                    <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                    <Components.Button type="submit">Sign In</Components.Button>
                </Components.Form>
            </Components.SignInContainer>

            {/* แผงสลับหน้าเลื่อนซ้าย-ขวา */}
            <Components.OverlayContainer signinIn={signIn}>
                <Components.Overlay signinIn={signIn}>

                    <Components.LeftOverlayPanel signinIn={signIn}>
                        <Components.Title>Welcome Back!</Components.Title>
                        <Components.Paragraph>
                            To keep connected with us please login with your personal info
                        </Components.Paragraph>
                        <Components.GhostButton type="button" onClick={() => toggle(true)}>
                            Sign In
                        </Components.GhostButton>
                    </Components.LeftOverlayPanel>

                    <Components.RightOverlayPanel signinIn={signIn}>
                        <Components.Title>Hello, Friend!</Components.Title>
                        <Components.Paragraph>
                            Enter Your personal details and start journey with us
                        </Components.Paragraph>
                        <Components.GhostButton type="button" onClick={() => toggle(false)}>
                            Sign Up
                        </Components.GhostButton>
                    </Components.RightOverlayPanel>

                </Components.Overlay>
            </Components.OverlayContainer>

        </Components.Container>
    )
}

export default App;