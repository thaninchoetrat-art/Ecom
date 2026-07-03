import express from 'express';
import {listWarehouses} from '../controllers/warehouseController.js';
const router = express.Router();
router.get('/', listWarehouses);
export default router;
