import express from 'express';
import {
  getCart,
  addToCart,
  removeFromCart,
  emptyCart,
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/:userId', getCart);
router.post('/:userId', addToCart);
router.delete('/:userId/:productId', removeFromCart);
router.delete('/:userId', emptyCart);

export default router;
