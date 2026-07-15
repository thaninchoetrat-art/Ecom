import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAllUsers, saveAllUsers } from '../utils/jsonStore.js';

// ฟังก์ชันแปลงอีเมลให้เป็น Key ที่ปลอดภัย (คงรูปแบบเดิมจากตอนใช้ Firebase ไว้
// เพื่อไม่ต้อง migrate โครงสร้างข้อมูลใหม่)
const encodeEmail = (email) => email.replace(/\./g, ',');

// ==========================================
// 1. ฟังก์ชันสมัครสมาชิก (Register)
// ==========================================
export async function register(req, res, next) {
    try {
        const { name, email, password } = req.body;
        const users = getAllUsers();
        const key = encodeEmail(email);

        // ตรวจสอบว่ามีอีเมลนี้อยู่ในระบบหรือยัง
        if (users[key]) {
            return res.status(400).json({ ok: false, message: 'อีเมลนี้ถูกใช้ไปแล้วในระบบ' });
        }

        // เข้ารหัส Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // บันทึกลงไฟล์ JSON (back/data/users.json)
        // 🟢 สมัครสมาชิกทั่วไปผ่านหน้าเว็บ จะได้สิทธิ์ระดับ Customer เสมอ
        // (การสร้างบัญชี Admin/Staff ทำได้เฉพาะผ่าน createAccount โดยผู้ดูแลระบบเท่านั้น)
        const newUser = {
            name,
            email,
            password: hashedPassword,
            role: 'Customer',
            status: 'active',
            phone: '',
            createdAt: new Date().toISOString(),
        };

        users[key] = newUser;
        saveAllUsers(users);

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

        // ค้นหาผู้ใช้จากไฟล์ JSON
        const users = getAllUsers();
        const user = users[encodeEmail(email)];

        if (!user) {
            return res.status(400).json({ ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        // ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ ok: false, message: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
        }

        // สร้างตั๋ว JWT (ฝัง role ไปด้วย เพื่อให้ฝั่งหน้าบ้านพาไปหน้าที่ถูกต้อง และฝั่ง backend ใช้เช็คสิทธิ์ได้)
        const role = user.role || 'Customer';
        const token = jwt.sign(
            { email: user.email, name: user.name, role },
            process.env.JWT_SECRET || 'luxury_fallback_secret_key',
            { expiresIn: '1d' }
        );

        res.status(200).json({
            ok: true,
            message: 'เข้าสู่ระบบสำเร็จ!',
            token,
            user: {
                name: user.name,
                email: user.email,
                role
            }
        });

    } catch (error) {
        next(error);
    }
}

const ALLOWED_ROLES = ['Customer', 'Staff', 'Admin'];

// ==========================================
// 2.5 ฟังก์ชันดึงข้อมูลบัญชีของตัวเอง (ใช้ได้ทุกสิทธิ์ที่ login แล้ว)
// ใช้สำหรับหน้าโปรไฟล์ของ Staff/Admin ที่ต้องดูข้อมูลตัวเอง โดยไม่ต้องมีสิทธิ์ Admin
// ==========================================
export async function getMe(req, res, next) {
    try {
        const users = getAllUsers();
        const user = users[encodeEmail(req.user.email)];

        if (!user) {
            return res.status(404).json({ ok: false, message: 'ไม่พบบัญชีนี้ในระบบ' });
        }

        res.status(200).json({
            ok: true,
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                role: user.role || 'Customer',
                status: user.status || 'active',
                createdAt: user.createdAt || null,
            },
        });
    } catch (error) {
        next(error);
    }
}

// ==========================================
// 3. ฟังก์ชันสร้างบัญชี (Admin เท่านั้น) — ใช้ได้ทั้ง Customer / Staff / Admin
// ==========================================
export async function createAccount(req, res, next) {
    try {
        const { name, email, password, role, phone } = req.body;

        const targetRole = ALLOWED_ROLES.includes(role) ? role : 'Customer';

        if (!name || !email || !password) {
            return res.status(400).json({ ok: false, message: 'กรุณากรอกชื่อ อีเมล และรหัสผ่านให้ครบ' });
        }
        if (password.length < 6) {
            return res.status(400).json({ ok: false, message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' });
        }

        const users = getAllUsers();
        const key = encodeEmail(email);
        if (users[key]) {
            return res.status(400).json({ ok: false, message: 'อีเมลนี้ถูกใช้ไปแล้วในระบบ' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAccount = {
            name,
            email,
            phone: phone || '',
            password: hashedPassword,
            role: targetRole,
            status: 'active',
            createdBy: req.user.email,
            createdAt: new Date().toISOString(),
        };

        users[key] = newAccount;
        saveAllUsers(users);

        res.status(201).json({
            ok: true,
            message: 'สร้างบัญชีสำเร็จ!',
            user: { name, email, role: targetRole, phone: newAccount.phone, status: newAccount.status },
        });
    } catch (error) {
        next(error);
    }
}

// ==========================================
// 4. ฟังก์ชันดึงรายชื่อบัญชีทั้งหมด (Admin เท่านั้น)
// ==========================================
export async function listAccounts(req, res, next) {
    try {
        const users = getAllUsers();

        const accounts = Object.values(users).map((u) => ({
            name: u.name,
            email: u.email,
            phone: u.phone || '',
            role: u.role || 'Customer',
            status: u.status || 'active',
            createdAt: u.createdAt || null,
        }));

        res.status(200).json({ ok: true, accounts });
    } catch (error) {
        next(error);
    }
}

// ==========================================
// 5. ฟังก์ชันแก้ไขบัญชี (Admin เท่านั้น) — แก้ชื่อ/เบอร์/สิทธิ์/สถานะ (ไม่แก้อีเมล/รหัสผ่านที่นี่)
// ==========================================
export async function updateAccount(req, res, next) {
    try {
        const email = decodeURIComponent(req.params.email);
        const { name, phone, role, status } = req.body;

        const users = getAllUsers();
        const key = encodeEmail(email);
        if (!users[key]) {
            return res.status(404).json({ ok: false, message: 'ไม่พบบัญชีนี้ในระบบ' });
        }

        const updates = {};
        if (name !== undefined) updates.name = name;
        if (phone !== undefined) updates.phone = phone;
        if (status !== undefined) updates.status = status;
        if (role !== undefined && ALLOWED_ROLES.includes(role)) updates.role = role;

        users[key] = { ...users[key], ...updates };
        saveAllUsers(users);

        res.status(200).json({ ok: true, message: 'แก้ไขบัญชีสำเร็จ' });
    } catch (error) {
        next(error);
    }
}

// ==========================================
// 6. ฟังก์ชันลบบัญชี (Admin เท่านั้น)
// ==========================================
export async function deleteAccount(req, res, next) {
    try {
        const email = decodeURIComponent(req.params.email);

        if (email === req.user.email) {
            return res.status(400).json({ ok: false, message: 'ไม่สามารถลบบัญชีที่กำลังใช้งานอยู่ได้' });
        }

        const users = getAllUsers();
        delete users[encodeEmail(email)];
        saveAllUsers(users);

        res.status(200).json({ ok: true, message: 'ลบบัญชีสำเร็จ' });
    } catch (error) {
        next(error);
    }
}
