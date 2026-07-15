import { v4 as uuidv4 } from 'uuid';
import { readJsonFile, writeJsonFile } from '../utils/jsonStore.js';

const FILE_NAME = 'orders';

function getOrders() {
  return readJsonFile(FILE_NAME, []);
}

function saveOrders(orders) {
  writeJsonFile(FILE_NAME, orders);
}

export function getAllOrders() {
  return getOrders();
}

export function createOrder(data) {
  const orders = getOrders();
  const order = {
    orderId: data.orderId || uuidv4(),
    userId: data.userId,
    items: data.items || [],
    total: Number(data.total) || 0,
    discount: Number(data.discount) || 0,
    shippingFee: Number(data.shippingFee) || 0,
    grandTotal: Number(data.grandTotal) || 0,
    status: data.status || 'Pending',
    paymentMethod: data.paymentMethod || 'Cash',
    shippingAddress: data.shippingAddress || '',
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  saveOrders(orders);
  return order;
}
