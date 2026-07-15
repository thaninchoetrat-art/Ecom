import express from 'express';
import { login, register, getMe, createAccount, listAccounts, updateAccount, deleteAccount } from '../controllers/authController.js';
import { verifyToken, requireRole } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', login);
router.post('/register', register);

// 🟢 ดึงข้อมูลบัญชีของตัวเอง (Staff/Admin/Customer ที่ login แล้วเรียกได้หมด ไม่ต้องมีสิทธิ์ Admin)
// ต้องอยู่ก่อน "/accounts" เฉยๆ ไม่ชนกันเพราะ path ต่างกัน ("/accounts/me" vs "/accounts")
router.get('/accounts/me', verifyToken, getMe);

// 🔒 เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่จัดการบัญชีผู้ใช้ทั้งหมดได้ (Customer / Staff / Admin)
router.get('/accounts', verifyToken, requireRole('Admin'), listAccounts);
router.post('/accounts', verifyToken, requireRole('Admin'), createAccount);
router.patch('/accounts/:email', verifyToken, requireRole('Admin'), updateAccount);
router.delete('/accounts/:email', verifyToken, requireRole('Admin'), deleteAccount);

export default router;
