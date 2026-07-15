import { v4 as uuidv4 } from 'uuid';
import { readJsonFile, writeJsonFile } from '../utils/jsonStore.js';

const FILE_NAME = 'carts';

function getCarts() {
  return readJsonFile(FILE_NAME, []);
}

function saveCarts(carts) {
  writeJsonFile(FILE_NAME, carts);
}

export function getCartByUserId(userId) {
  return getCarts().find((cart) => cart.userId === userId) || null;
}

export function createOrGetCart(userId) {
  const carts = getCarts();
  let cart = carts.find((item) => item.userId === userId);
  if (!cart) {
    cart = {
      cartId: uuidv4(),
      userId,
      items: [],
      totalPrice: 0,
      createdAt: new Date().toISOString(),
    };
    carts.push(cart);
    saveCarts(carts);
  }

  return cart;
}

export function addItemToCart(userId, item) {
  const carts = getCarts();
  let cart = carts.find((entry) => entry.userId === userId);
  if (!cart) {
    cart = {
      cartId: uuidv4(),
      userId,
      items: [],
      totalPrice: 0,
      createdAt: new Date().toISOString(),
    };
    carts.push(cart);
  }

  const existing = cart.items.find((entry) => entry.productId === item.productId);

  if (existing) {
    existing.quantity += item.quantity;
    existing.subtotal = existing.quantity * existing.price;
  } else {
    cart.items.push({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price,
    });
  }

  cart.totalPrice = cart.items.reduce((sum, entry) => sum + entry.subtotal, 0);
  saveCarts(carts);
  return cart;
}

export function removeItemFromCart(userId, productId) {
  const carts = getCarts();
  const cart = carts.find((entry) => entry.userId === userId);
  if (!cart) {
    return null;
  }

  cart.items = cart.items.filter((entry) => entry.productId !== productId);
  cart.totalPrice = cart.items.reduce((sum, entry) => sum + entry.subtotal, 0);
  saveCarts(carts);
  return cart;
}

export function clearCart(userId) {
  const carts = getCarts();
  const cart = carts.find((entry) => entry.userId === userId);
  if (!cart) {
    return null;
  }

  cart.items = [];
  cart.totalPrice = 0;
  saveCarts(carts);
  return cart;
}
