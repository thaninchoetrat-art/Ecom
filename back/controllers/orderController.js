import { createOrder as createOrderModel, getAllOrders } from '../models/Order.js';

export async function listOrders(req, res) {
  res.json(getAllOrders());
}

export async function createOrder(req, res) {
  const order = createOrderModel(req.body);
  return res.status(201).json(order);
}
