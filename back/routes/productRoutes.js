import express from 'express';
import {
  uploadProductImage,
} from '../controllers/productController.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.post('/', upload.single('image'), uploadProductImage);

export default router;