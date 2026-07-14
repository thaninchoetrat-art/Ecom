import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// แปลงพาธสำหรับระบบ ES Modules เพื่อดึง __dirname มาใช้ได้เหมือนเดิม
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../image'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('กรุณาอัปโหลดเฉพาะไฟล์รูปภาพ!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// เปลี่ยนจาก module.exports = upload; เป็นแบบ ES Module ด้านล่างนี้:
export default upload;