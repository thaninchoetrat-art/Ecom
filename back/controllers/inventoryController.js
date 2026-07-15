import {
  getAllInventory,
  getInventoryByProductId,
  updateInventory,
  patchInventory as patchInventoryModel,
} from '../models/Inventory.js';

export async function getInventory(req, res) {
  res.json(getAllInventory());
}

export async function getInventoryByProduct(req, res) {
  const inventory = getInventoryByProductId(req.params.productId);
  if (!inventory) {
    return res.status(404).json({ message: 'Inventory not found' });
  }

  return res.json(inventory);
}

export async function createOrUpdateInventory(req, res) {
  const inventory = updateInventory(req.params.productId, req.body);
  return res.json(inventory);
}

export async function patchInventory(req, res) {
  const inventory = patchInventoryModel(req.params.productId, req.body);
  return res.json(inventory);
}
