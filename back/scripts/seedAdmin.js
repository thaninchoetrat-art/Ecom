// scripts/seedAdmin.js
// สคริปต์ครั้งเดียวสำหรับสร้าง/รีเซ็ตบัญชี Admin เริ่มต้นโดยตรงใน Firebase
// วิธีใช้: cd back && node scripts/seedAdmin.js
//
// ค่าเริ่มต้น: admin@gmail.com / admin (เปลี่ยนได้ผ่าน ENV: SEED_EMAIL, SEED_PASSWORD, SEED_NAME)

import "../config/firebase.js";
import { getDatabase } from "firebase-admin/database";
import bcrypt from "bcryptjs";

const encodeEmail = (email) => email.replace(/\./g, ",");

const EMAIL = process.env.SEED_EMAIL || "admin@gmail.com";
const PASSWORD = process.env.SEED_PASSWORD || "admin";
const NAME = process.env.SEED_NAME || "Admin";

async function run() {
  const db = getDatabase();
  const usersRef = db.ref("users");
  const key = encodeEmail(EMAIL);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(PASSWORD, salt);

  const account = {
    name: NAME,
    email: EMAIL,
    password: hashedPassword,
    role: "Admin",
    createdAt: new Date().toISOString(),
  };

  await usersRef.child(key).set(account);

  console.log(`✅ สร้าง/อัปเดตบัญชี Admin สำเร็จ: ${EMAIL} (รหัสผ่าน: ${PASSWORD})`);
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ สร้างบัญชีไม่สำเร็จ:", err);
  process.exit(1);
});
