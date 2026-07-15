import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  patchCategory as patchCategoryModel,
  deleteCategory,
} from '../models/Category.js';

export async function listCategories(req, res) {
  res.json(getAllCategories());
}

export async function getCategory(req, res) {
  const category = getCategoryById(req.params.categoryId);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  return res.json(category);
}

export async function addCategory(req, res) {
  const category = createCategory(req.body);
  res.status(201).json(category);
}

export async function modifyCategory(req, res) {
  const category = updateCategory(req.params.categoryId, req.body);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  return res.json(category);
}

export async function patchCategory(req, res) {
  const category = patchCategoryModel(req.params.categoryId, req.body);
  if (!category) {
    return res.status(404).json({ message: 'Category not found' });
  }

  return res.json(category);
}

export async function removeCategory(req, res) {
  const deleted = deleteCategory(req.params.categoryId);
  if (!deleted) {
    return res.status(404).json({ message: 'Category not found' });
  }

  return res.json({ message: 'Category deleted' });
}
