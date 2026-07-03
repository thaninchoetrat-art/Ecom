import express from 'express';
import {listPromotions} from '../controllers/promotionController.js';
const router = express.Router();
router.get('/', listPromotions);
export default router;
