// scripts/migrateUsersFromFirebase.js
// สคริปต์ครั้งเดียว: ดึงบัญชีผู้ใช้ทั้งหมดที่เคยเก็บไว้ใน Firebase (node "users")
// มาบันทึกลง back/data/users.json (Local Storage) ก่อนเลิกใช้ Firebase
//
// ⚠️ ต้องมีไฟล์ back/config/serviceAccountKey.json ที่ใช้งานได้ ถึงจะรันสคริปต์นี้ได้
// ⚠️ รันครั้งเดียวตอน migrate เท่านั้น หลังจากนี้ authController.js จะอ่าน/เขียนที่
//    back/data/users.json แทน ไม่แตะ Firebase อีก
//
// วิธีใช้: cd back && node scripts/migrateUsersFromFirebase.js

import "../config/firebase.js";
import { getDatabase } from "firebase-admin/database";
import { getAllUsers, saveAllUsers } from "../utils/jsonStore.js";

async function run() {
  const db = getDatabase();
  const snapshot = await db.ref("users").get();
  const firebaseUsers = snapshot.val() || {};

  const count = Object.keys(firebaseUsers).length;
  if (count === 0) {
    console.log("⚠️ ไม่พบบัญชีผู้ใช้ใน Firebase เลย ไม่มีอะไรให้ย้าย");
    process.exit(0);
  }

  // รวมกับข้อมูลที่อาจมีอยู่แล้วใน local (เช่น จาก seedAdmin.js เวอร์ชันใหม่)
  // โดยให้ข้อมูลจาก Firebase ทับ เพราะถือเป็นข้อมูลของจริงที่ใช้งานอยู่
  const localUsers = getAllUsers();
  const merged = { ...localUsers, ...firebaseUsers };

  saveAllUsers(merged);

  console.log(`✅ ย้ายบัญชีจาก Firebase มา Local สำเร็จ: ${count} บัญชี`);
  console.log(`   บันทึกไว้ที่: back/data/users.json`);
  process.exit(0);
}

run().catch((err) => {
  console.error("❌ ย้ายข้อมูลไม่สำเร็จ:", err);
  process.exit(1);
});
