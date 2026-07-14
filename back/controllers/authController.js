import { getDatabase } from "firebase-admin/database";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// เริ่มต้นใช้งาน Firebase Database
const db = getDatabase();
const usersRef = db.ref('users');

// ฟังก์ชันแปลงอีเมลให้เป็น Key ที่ปลอดภัยสำหรับ Firebase 
// เนื่องจาก Firebase ไม่รองรับอักขระ '.' ใน Path ของ Key
const encodeEmail = (email) => email.replace(/\./g, ',');

// ==========================================
// 1. ฟังก์ชันสมัครสมาชิก (Register)
// ==========================================
export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        // ตรวจสอบว่ามีอีเมลนี้อยู่ในระบบหรือยัง
        const snapshot = await usersRef.child(encodeEmail(email)).get();
        if (snapshot.exists()) {
            return res.status(400).json({ ok: false, message: 'อีเมลนี้ถูกใช้ไปแล้วในระบบ' });
        }

        // เข้ารหัส Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // บันทึกลง Firebase
        const newUser = { 
            name, 
            email, 
            password: hashedPassword, 
            role: 'Agent' 
        };
        
        await usersRef.child(encodeEmail(email)).set(newUser);

        res.status(201).json({
            ok: true,
            message: 'สมัครสมาชิกสำเร็จ!',
            user: { name, email }
        });

    } catch (error) {
        next(error); 
    }
}

// ==========================================
// 2. ฟังก์ชันเข้าสู่ระบบ (Login)
// ==========================================
export async function login(req, res, next) {
    try {
        const { email, password } = req.body;

        // ค้นหาผู้ใช้จาก Firebase
        const snapshot = await usersRef.child(encodeEmail(email)).get();
        const user = snapshot.val();

        if (!user) {
            return res.status(400).json({ ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        // ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        // สร้างตั๋ว JWT
        const token = jwt.sign(
            { email: user.email, name: user.name },
            process.env.JWT_SECRET || 'luxury_fallback_secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            ok: true,
            message: 'เข้าสู่ระบบสำเร็จ!',
            token,
            user: { 
                name: user.name, 
                email: user.email 
            }
        });

    } catch (error) {
        next(error);
    } 
}