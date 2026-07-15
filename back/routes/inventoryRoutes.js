import express from 'express';
import {
  getInventory,
  getInventoryByProduct,
  createOrUpdateInventory,
  patchInventory,
} from '../controllers/inventoryController.js';

const router = express.Router();

router.get('/', getInventory);
router.get('/:productId', getInventoryByProduct);
router.post('/:productId', createOrUpdateInventory);
router.put('/:productId', createOrUpdateInventory);
router.patch('/:productId', patchInventory);

export default router;
