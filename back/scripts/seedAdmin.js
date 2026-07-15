// scripts/seedAdmin.js
// สคริปต์ครั้งเดียวสำหรับสร้าง/รีเซ็ตบัญชี Admin เริ่มต้น
// เขียนลงไฟล์ back/data/users.json โดยตรง (Local Storage — ไม่ต้องพึ่ง Firebase อีกต่อไป)
// วิธีใช้: cd back && node scripts/seedAdmin.js
//
// ค่าเริ่มต้น: admin@gmail.com / admin (เปลี่ยนได้ผ่าน ENV: SEED_EMAIL, SEED_PASSWORD, SEED_NAME)

import bcrypt from "bcryptjs";
import { getAllUsers, saveAllUsers } from "../utils/jsonStore.js";

const encodeEmail = (email) => email.replace(/\./g, ",");

const EMAIL = process.env.SEED_EMAIL || "admin@gmail.com";
const PASSWORD = process.env.SEED_PASSWORD || "admin";
const NAME = process.env.SEED_NAME || "Admin";

async function run() {
  const users = getAllUsers();
  const key = encodeEmail(EMAIL);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(PASSWORD, salt);

  users[key] = {
    name: NAME,
    email: EMAIL,
    password: hashedPassword,
    role: "Admin",
    status: "active",
    phone: "",
    createdAt: new Date().toISOString(),
  };

  saveAllUsers(users);

  console.log(`✅ สร้าง/อัปเดตบัญชี Admin สำเร็จ: ${EMAIL} (รหัสผ่าน: ${PASSWORD})`);
  console.log(`   บันทึกไว้ที่: back/data/users.json`);
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ สร้างบัญชีไม่สำเร็จ:", err);
  process.exit(1);
});
