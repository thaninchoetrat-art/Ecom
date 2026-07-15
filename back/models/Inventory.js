import { v4 as uuidv4 } from 'uuid';
import { readJsonFile, writeJsonFile } from '../utils/jsonStore.js';

const FILE_NAME = 'inventory';

function getInventories() {
  return readJsonFile(FILE_NAME, []);
}

function saveInventories(inventories) {
  writeJsonFile(FILE_NAME, inventories);
}

export function getAllInventory() {
  return getInventories();
}

export function getInventoryByProductId(productId) {
  return getInventories().find((item) => item.productId === productId) || null;
}

export function createOrGetInventory(productId) {
  const inventories = getInventories();
  let inventory = inventories.find((item) => item.productId === productId);
  if (!inventory) {
    inventory = {
      inventoryId: uuidv4(),
      productId,
      stockIn: 0,
      stockOut: 0,
      currentStock: 0,
      lastUpdated: new Date().toISOString(),
    };
    inventories.push(inventory);
    saveInventories(inventories);
  }

  return inventory;
}

export function updateInventory(productId, data) {
  const inventories = getInventories();
  let inventory = inventories.find((item) => item.productId === productId);
  if (!inventory) {
    inventory = {
      inventoryId: uuidv4(),
      productId,
      stockIn: 0,
      stockOut: 0,
      currentStock: 0,
      lastUpdated: new Date().toISOString(),
    };
    inventories.push(inventory);
  }

  Object.assign(inventory, {
    stockIn: Number(data.stockIn) || inventory.stockIn,
    stockOut: Number(data.stockOut) || inventory.stockOut,
    currentStock: Number(data.currentStock) ?? inventory.currentStock,
    lastUpdated: new Date().toISOString(),
  });

  saveInventories(inventories);
  return inventory;
}

export function patchInventory(productId, data) {
  const inventories = getInventories();
  let inventory = inventories.find((item) => item.productId === productId);
  if (!inventory) {
    inventory = {
      inventoryId: uuidv4(),
      productId,
      stockIn: 0,
      stockOut: 0,
      currentStock: 0,
      lastUpdated: new Date().toISOString(),
    };
    inventories.push(inventory);
  }

  const updates = data || {};
  if (typeof updates.stockIn !== 'undefined') {
    inventory.stockIn = Number(updates.stockIn);
  }
  if (typeof updates.stockOut !== 'undefined') {
    inventory.stockOut = Number(updates.stockOut);
  }
  if (typeof updates.currentStock !== 'undefined') {
    inventory.currentStock = Number(updates.currentStock);
  }
  inventory.lastUpdated = new Date().toISOString();

  saveInventories(inventories);
  return inventory;
}
