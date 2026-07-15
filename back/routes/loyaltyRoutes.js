import express from 'express';
import {getPoints} from '../controllers/loyaltyController.js';
const router = express.Router();
router.get('/:userId', getPoints);
export default router;
