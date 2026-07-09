import {User} from '../models/User.js'; 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ==========================================
// 1. ฟังก์ชันสมัครสมาชิก (Register)
// ==========================================
export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;

        // เช็คว่ามีอีเมลนี้อยู่ในระบบหรือยัง
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ ok: false, message: 'อีเมลนี้ถูกใช้ไปแล้วในระบบ' });
        }

        // เข้ารหัส Password ก่อนบันทึกเพื่อความปลอดภัย (Salt 10 รอบ)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // บันทึกผู้ใช้คนใหม่ลงฐานข้อมูล
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            ok: true,
            message: 'สมัครสมาชิกสำเร็จ!',
            user: { id: newUser._id, name: newUser.name, email: newUser.email }
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

        // ค้นหาผู้ใช้จากอีเมล
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        // ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        // สร้างตั๋ว JWT (Token) สำหรับยืนยันตัวตน (มีอายุ 1 วัน)
        const token = jwt.sign(
            { id: user._id, name: user.name },
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