import express from 'express';
import {
  listCategories,
  getCategory,
  addCategory,
  modifyCategory,
  patchCategory,
  removeCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/', listCategories);
router.get('/:categoryId', getCategory);
router.post('/', addCategory);
router.put('/:categoryId', modifyCategory);
router.patch('/:categoryId', patchCategory);
router.delete('/:categoryId', removeCategory);

export default router;
