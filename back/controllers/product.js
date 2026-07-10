// ในไฟล์ Controller หรือ Route ของ Products (เช่น routes/product.js)
const Express = require('express');
const router = Express.Router();
const Product = require('../models/Product'); // สมมติว่าเป็น Mongoose Model ของคุณ

router.get('/products', async (req, res) => {
  try {
    // 1. แกะตัวแปรจาก URL Query
    const { category, brand, minPrice, maxPrice } = req.query;
    
    // 2. สร้าง Object เปล่าเพื่อเก็บเงื่อนไขการกรอง
    let queryObj = {};

    // 3. กรองช่วงราคา (แปลงเป็นตัวเลขเพื่อความถูกต้อง)
    queryObj.price = {
      $gte: minPrice ? Number(minPrice) : 0,
      $lte: maxPrice ? Number(maxPrice) : 1299
    };

    // 4. ถ้ามีการเลือกหมวดหมู่ ให้จับใส่เงื่อนไข
    if (category) {
      queryObj.category = category;
    }

    // 5. ถ้ามีการเลือกแบรนด์ ให้จับใส่เงื่อนไข
    if (brand) {
      queryObj.brand = brand;
    }

    // 6. ใช้ Mongoose ค้นหาข้อมูลตามเงื่อนไขใน queryObj
    const products = await Product.find(queryObj);
    
    // 7. ส่งข้อมูลกลับไปให้ Frontend
    res.json(products);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;