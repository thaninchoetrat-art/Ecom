// ==========================================================================
// checkoutRoutes.js
// เส้นทาง API ทั้งหมดของระบบ "สั่งซื้อสินค้า และชำระเงิน"
// ผูกไว้ที่ /api/checkout ใน server.js
// ==========================================================================
import express from 'express';
import {
  createCheckoutOrder,
  getCheckoutOrder,
  getCheckoutOrdersByUser,
  confirmPayment,
  cancelCheckoutOrder,
} from './checkoutController.js';

const router = express.Router();

router.post('/orders', createCheckoutOrder);
router.get('/orders/user/:userId', getCheckoutOrdersByUser);
router.get('/orders/:orderId', getCheckoutOrder);
router.post('/orders/:orderId/confirm-payment', confirmPayment);
router.post('/orders/:orderId/cancel', cancelCheckoutOrder);

export default router;
