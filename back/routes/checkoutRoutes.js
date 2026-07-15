import express from 'express';
import {
  createCheckoutOrder,
  getCheckoutOrder,
  getCheckoutOrdersByUser,
  confirmPayment,
  cancelCheckoutOrder,
} from '../controllers/checkoutController.js'; 

const router = express.Router();

router.post('/orders', createCheckoutOrder);
router.get('/orders/user/:userId', getCheckoutOrdersByUser);
router.get('/orders/:orderId', getCheckoutOrder);
router.post('/orders/:orderId/confirm-payment', confirmPayment);
router.post('/orders/:orderId/cancel', cancelCheckoutOrder);

export default router;