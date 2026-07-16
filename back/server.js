import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import errorHandler from './middleware/errorHandler.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import backupRoutes from './routes/backupRoutes.js';
import { runBackup } from './services/backupService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// เปิดใช้งาน CORS และ Body Parser เป็นลำดับแรก
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

// 👑 ➕ แก้ไขจุดนี้: ผูกพาธเข้ากับโฟลเดอร์ image ดึงสิทธิ์ไฟล์ให้ตรงเป๊ะและเสถียรที่สุด
app.use('/uploads', express.static(path.join(__dirname, 'image'))); 

// สรุปเส้นทาง API
// 🟢 เอา route ที่ไม่มีหน้าเว็บไหนเรียกใช้จริงออกแล้ว (categories/inventory/warehouses/cart/coupons/promotions/shipping/loyalty)
// เหลือแค่ที่หน้า Admin/Staff/Customer เรียกใช้งานจริงตามที่ตรวจสอบแล้ว
app.use('/api/auth', authRoutes);
<<<<<<< Updated upstream
app.use('/api/products', productRoutes);      
app.use('/api/categories', categoryRoutes);  
app.use('/api/inventory', inventoryRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/cart', cartRoutes);
=======
app.use('/api/products', productRoutes);
>>>>>>> Stashed changes
app.use('/api/orders', orderRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/admin/backups', backupRoutes);

// จัดการข้อผิดพลาด (ต้องอยู่ล่างสุดเสมอ)
app.use(errorHandler);

// 🗄️ ระบบสำรองข้อมูลอัตโนมัติ: รันทุกวัน เวลา 03:00 (ตั้งค่าเปลี่ยนได้ผ่าน ENV: BACKUP_CRON)
// ค่าเริ่มต้น "0 3 * * *" = นาที 0, ชั่วโมง 3, ทุกวัน
const BACKUP_CRON = process.env.BACKUP_CRON || '0 3 * * *';
cron.schedule(BACKUP_CRON, async () => {
  try {
    const result = await runBackup();
    console.log(`🗄️ สำรองข้อมูลอัตโนมัติสำเร็จ: ${result.fileName}`);
  } catch (err) {
    console.error('❌ สำรองข้อมูลอัตโนมัติล้มเหลว:', err);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));