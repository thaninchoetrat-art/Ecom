import express from 'express';
import {
  listProducts,
  listBrandCounts,
  getProduct,
  createProduct,
  updateProduct,
  patchProduct,
  deleteProduct,
} from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// 1. ดึงรายการสินค้าทั้งหมด (+ Filter)
router.get('/', listProducts);

// 2. สร้างสินค้าใหม่ (ดึงฟังก์ชัน createProduct มาใช้ตรงๆ และใส่ตัวอัปโหลดรูป)
router.post('/', upload.single('image'), createProduct);

// 3. 👑 ดึงแบรนด์สินค้าทั้งหมด (เอาเส้นเฉพาะเจาะจงไว้ก่อน :productId เพื่อไม่ให้ชนกัน)
router.get('/all/brands', listBrandCounts);

// 4. เส้นที่รับ Parameter ID ต่างๆ (อยู่ด้านล่างสุด)
router.get('/:productId', getProduct);
router.put('/:productId', updateProduct);
router.patch('/:productId', patchProduct);
router.delete('/:productId', deleteProduct);

export default router;