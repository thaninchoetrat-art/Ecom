import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path'; 
import { fileURLToPath } from 'url'; 

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import warehouseRoutes from './routes/warehouseRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import promotionRoutes from './routes/promotionRoutes.js';
import shippingRoutes from './routes/shippingRoutes.js';
import loyaltyRoutes from './routes/loyaltyRoutes.js';
import errorHandler from './middleware/errorHandler.js';

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
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);      
app.use('/api/categories', categoryRoutes);  
app.use('/api/inventory', inventoryRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/shipping', shippingRoutes);
app.use('/api/loyalty', loyaltyRoutes);

// จัดการข้อผิดพลาด (ต้องอยู่ล่างสุดเสมอ)
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on ${port}`));