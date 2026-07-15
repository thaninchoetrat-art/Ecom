// src/page/admin/services/dashboardService.js
import { fetchProducts, fetchMembers } from "../../products/productService";
import { fetchOrders } from "./orderService";
import { getLowStockProducts } from "./inventoryService";

const MONTH_LABELS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค.",
];

// 🟢 เดิมฟังก์ชันนี้เป็น sync แต่ fetchOrders() ถูกแก้ให้ยิง API จริง (async) ไปแล้วก่อนหน้านี้
// พอเรียกแบบ sync มันได้ Promise กลับมาแทนข้อมูลจริง แล้ว Array.isArray(Promise) เป็น false เสมอ
// orders เลยถูกบังคับให้เป็น [] ตลอด ทำให้ยอดขาย/กราฟ/ทุกอย่างในแดชบอร์ดว่างเปล่าไปหมด
// แก้โดยทำให้ฟังก์ชันนี้เป็น async แล้ว await fetchOrders() จริงๆ
export const computeDashboardStats = async () => {
  const products = fetchProducts();
  const members = fetchMembers();

  // ดึงข้อมูลคำสั่งซื้อ
  const rawOrders = await fetchOrders();
  // 🟢 ตรวจสอบให้มั่นใจว่าเป็น Array เสมอ ถ้าไม่ใช่ให้คืนค่าว่างเพื่อป้องกัน Error
  const orders = Array.isArray(rawOrders) ? rawOrders : [];

  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const totalRevenue = validOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // คำนวณรายเดือน
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

  // สินค้าขายดี
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

  return {
    totalCustomers: members.length,
    totalOrders: orders.length,
    totalProducts: products.length,
    totalRevenue,
    monthlySales,
    statusCounts,
    topProducts,
    recentOrders,
    lowStockProducts: getLowStockProducts(),
  };
};