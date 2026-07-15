// back/routes/orderRoutes.js
import express from 'express';
import { listOrders, createOrder, updateOrder, deleteOrder } from '../controllers/orderController.js'; // 🟢 เพิ่ม updateOrder, deleteOrder

const router = express.Router();

router.get('/', listOrders);
router.post('/', createOrder);
router.patch('/:orderId', updateOrder);
router.delete('/:orderId', deleteOrder);

export default router;