import React from 'react';
// ดึงหน้า Login สีดำทองที่คุณทำไว้เข้ามาใช้งาน
import LuxuryAuth from './pages/Login';
// 👈 จุดที่ 1 แก้ตรงนี้: ดึงคอมโพเนนต์ Dashboard ของเพื่อนเข้ามาใช้งานแทน HomePage เดิม
import Dashboard from './pages/Dashboard';

// 🗑️ (ฟังก์ชัน HomePage อันเก่าถูกลบออกไปแล้วเพื่อความสะอาดของโค้ด)

function App() {
  // ตรวจเช็คสถานะตั๋วใน Local Storage ตอนที่หน้าเว็บเปิดขึ้นมา
  const isLoggedIn = localStorage.getItem("is_logged_in") === "true";

  return (
    <>
      {/* 👈 จุดที่ 2 แก้ตรงนี้: 
          ถ้า isLoggedIn เป็น true ให้ส่งทะลุมิติไปหน้า Dashboard กระจกดำทองตัวใหม่ทันที
          ถ้ายังไม่ได้ล็อกอิน ให้โชว์หน้า LuxuryAuth อันเดิมของคุณ
      */}
      {isLoggedIn ? <Dashboard /> : <LuxuryAuth />}
    </>
  );
}

export default App;