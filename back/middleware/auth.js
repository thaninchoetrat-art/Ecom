import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'luxury_fallback_secret_key';

// ==========================================
// ตรวจสอบ JWT Token จาก Header (Authorization: Bearer <token>)
// ==========================================
export function verifyToken(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ ok: false, message: 'กรุณาเข้าสู่ระบบก่อนใช้งาน' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { email: decoded.email, name: decoded.name, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ ok: false, message: 'เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่' });
  }
}

// ==========================================
// ตรวจสอบสิทธิ์ตาม Role (ใช้ต่อจาก verifyToken เสมอ)
// ==========================================
export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, message: 'คุณไม่มีสิทธิ์เข้าถึงส่วนนี้' });
    }
    next();
  };
}
