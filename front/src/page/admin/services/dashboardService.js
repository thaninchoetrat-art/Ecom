// dashboardService.js
// รวบรวม/คำนวณข้อมูลสรุปสำหรับหน้าแดชบอร์ดผู้ดูแลระบบ

import { fetchProducts, fetchMembers } from "../../products/productService";
import { fetchOrders } from "./orderService";
import { getLowStockProducts } from "./inventoryService";

const MONTH_LABELS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

export const computeDashboardStats = () => {
  const products = fetchProducts();
  const members = fetchMembers();
  const orders = fetchOrders();

  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // ยอดขายรายเดือน (ปีปัจจุบัน)
  const currentYear = new Date().getFullYear();
  const monthlySales = MONTH_LABELS.map((label, idx) => {
    const total = validOrders
      .filter((o) => {
        const d = new Date(o.createdAt);
        return d.getFullYear() === currentYear && d.getMonth() === idx;
      })
      .reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    return { label, total };
  });

  // สัดส่วนสถานะคำสั่งซื้อ
  const statusCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // สินค้าขายดี (นับจาก items ในคำสั่งซื้อที่ไม่ถูกยกเลิก)
  const salesByProduct = {};
  validOrders.forEach((o) => {
    (o.items || []).forEach((it) => {
      const key = it.productId || it.productName;
      if (!salesByProduct[key]) {
        salesByProduct[key] = { productName: it.productName, qty: 0, revenue: 0 };
      }
      salesByProduct[key].qty += Number(it.qty) || 0;
      salesByProduct[key].revenue += (Number(it.price) || 0) * (Number(it.qty) || 0);
    });
  });
  const topProducts = Object.values(salesByProduct)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const lowStockProducts = getLowStockProducts();

  return {
    totalCustomers: members.length,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalRevenue,
    monthlySales,
    statusCounts,
    topProducts,
    recentOrders,
    lowStockProducts,
  };
};
