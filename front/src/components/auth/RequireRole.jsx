import { Navigate, useLocation } from "react-router-dom";

// 🔒 ป้องกันหน้าตามสิทธิ์ผู้ใช้ (ฝั่ง Client)
// ใช้ครอบ Route ที่ต้องจำกัดสิทธิ์ เช่น /admin หรือ /staff
// หมายเหตุ: เป็นการกันฝั่งหน้าบ้านเพื่อ UX เท่านั้น ระบบยังตรวจสิทธิ์จริงที่ backend (verifyToken + requireRole) ทุกครั้งที่เรียก API ที่สำคัญ
const RequireRole = ({ roles, children }) => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("is_logged_in") === "true";
  const role = localStorage.getItem("user_role");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!roles.includes(role)) {
    // ล็อกอินแล้วแต่สิทธิ์ไม่พอ ส่งกลับหน้าแรกแทนที่จะให้เห็นหน้าที่ไม่มีสิทธิ์
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireRole;
