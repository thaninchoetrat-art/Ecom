import { v4 as uuidv4 } from 'uuid';
import { readJsonFile, writeJsonFile } from '../utils/jsonStore.js';

const FILE_NAME = 'categories';

function getCategories() {
  return readJsonFile(FILE_NAME, [
    {
      categoryId: 'cat-electronics',
      categoryName: 'Electronics',
      description: 'Phones, laptops, and accessories',
    },
    {
      categoryId: 'cat-fashion',
      categoryName: 'Fashion',
      description: 'Clothing and accessories',
    },
  ]);
}

function saveCategories(categories) {
  writeJsonFile(FILE_NAME, categories);
}

export function getAllCategories() {
  return getCategories();
}

export function getCategoryById(categoryId) {
  return getCategories().find((category) => category.categoryId === categoryId);
}

export function createCategory(data) {
  const categories = getCategories();
  const category = {
    categoryId: data.categoryId || uuidv4(),
    categoryName: data.categoryName,
    description: data.description || '',
  };

  categories.push(category);
  saveCategories(categories);
  return category;
}

export function updateCategory(categoryId, data) {
  const categories = getCategories();
  const category = categories.find((item) => item.categoryId === categoryId);
  if (!category) {
    return null;
  }

  Object.assign(category, data);
  saveCategories(categories);
  return category;
}

export function patchCategory(categoryId, data) {
  const categories = getCategories();
  const category = categories.find((item) => item.categoryId === categoryId);
  if (!category) {
    return null;
  }

  const { categoryId: _ignoredCategoryId, ...updates } = data || {};
  Object.assign(category, updates);
  saveCategories(categories);
  return category;
}

export function deleteCategory(categoryId) {
  const categories = getCategories();
  const index = categories.findIndex((item) => item.categoryId === categoryId);
  if (index === -1) {
    return false;
  }

  categories.splice(index, 1);
  saveCategories(categories);
  return true;
}
