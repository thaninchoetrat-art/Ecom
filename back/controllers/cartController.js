import {
  getCartByUserId,
  addItemToCart,
  removeItemFromCart,
  clearCart,
} from '../models/Cart.js';

export async function getCart(req, res) {
  const cart = getCartByUserId(req.params.userId || req.query.userId);
  if (!cart) {
    return res.json({ cartId: null, userId: req.params.userId || req.query.userId, items: [], totalPrice: 0 });
  }

  return res.json(cart);
}

export async function addToCart(req, res) {
  const cart = addItemToCart(req.params.userId || req.body.userId, req.body);
  return res.status(201).json(cart);
}

export async function removeFromCart(req, res) {
  const cart = removeItemFromCart(req.params.userId || req.body.userId, req.params.productId);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  return res.json(cart);
}

export async function emptyCart(req, res) {
  const cart = clearCart(req.params.userId || req.body.userId);
  if (!cart) {
    return res.status(404).json({ message: 'Cart not found' });
  }

  return res.json(cart);
}
