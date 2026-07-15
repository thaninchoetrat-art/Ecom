import express from 'express';
import { listOrders, createOrder } from '../controllers/orderController.js';

const router = express.Router();

router.get('/', listOrders);
router.post('/', createOrder);

export default router;
