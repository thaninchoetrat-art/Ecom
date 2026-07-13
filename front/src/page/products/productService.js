// productService.js
// จัดเก็บข้อมูลสินค้า / หมวดหมู่ / สมาชิก ด้วย Local Storage
// (ตามที่ระบุไว้ในแบบฟอร์มขออนุมัติโครงงาน หมวด "เครื่องมือและเทคโนโลยีที่ใช้" -> Local Storage)

const KEYS = { PRODUCTS: "my_products", CATEGORIES: "my_categories", MEMBERS: "my_members" };

// หมวดหมู่เริ่มต้น (เผื่อยังไม่เคยมีการเพิ่มหมวดหมู่ใด ๆ เลย)
const DEFAULT_CATEGORIES = [
  { categoryId: "cat-skincare", categoryName: "Skincare", description: "ผลิตภัณฑ์บำรุงผิวหน้าและผิวกาย" },
  { categoryId: "cat-makeup", categoryName: "Makeup", description: "เครื่องสำอางแต่งหน้า" },
  { categoryId: "cat-perfume", categoryName: "Perfume", description: "น้ำหอมและสเปรย์น้ำหอม" },
  { categoryId: "cat-haircare", categoryName: "Haircare", description: "ผลิตภัณฑ์ดูแลเส้นผม" },
];

const uid = (prefix) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

const readKey = (key, fallback = []) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.error(`อ่านข้อมูล ${key} ไม่สำเร็จ`, err);
    return fallback;
  }
};

const writeKey = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
  return data;
};

/* ---------------------------- สินค้า (Products) ---------------------------- */

export const fetchProducts = () => readKey(KEYS.PRODUCTS, []);
export const saveProducts = (data) => writeKey(KEYS.PRODUCTS, data);

export const addProduct = (product) => {
  const products = fetchProducts();
  const newProduct = {
    productId: uid("prod"),
    productName: "",
    categoryId: "",
    brand: "",
    price: 0,
    discountPrice: 0,
    stock: 0,
    image: "",
    description: "",
    createdAt: new Date().toISOString(),
    ...product,
  };
  saveProducts([newProduct, ...products]);
  return newProduct;
};

export const updateProduct = (productId, updates) => {
  const products = fetchProducts();
  let updated = null;
  const next = products.map((p) => {
    if (p.productId === productId) {
      updated = { ...p, ...updates, productId };
      return updated;
    }
    return p;
  });
  saveProducts(next);
  return updated;
};

export const deleteProduct = (productId) => {
  const products = fetchProducts();
  const next = products.filter((p) => p.productId !== productId);
  saveProducts(next);
  return next;
};

/* --------------------------- หมวดหมู่ (Categories) --------------------------- */

export const fetchCategories = () => {
  const existing = readKey(KEYS.CATEGORIES, null);
  if (existing === null) {
    // ครั้งแรกที่ยังไม่มีข้อมูล ให้ตั้งค่าหมวดหมู่เริ่มต้นไว้ก่อน
    return writeKey(KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  }
  return existing;
};
export const saveCategories = (data) => writeKey(KEYS.CATEGORIES, data);

export const addCategory = (category) => {
  const categories = fetchCategories();
  const newCategory = {
    categoryId: uid("cat"),
    categoryName: "",
    description: "",
    ...category,
  };
  saveCategories([...categories, newCategory]);
  return newCategory;
};

export const updateCategory = (categoryId, updates) => {
  const categories = fetchCategories();
  let updated = null;
  const next = categories.map((c) => {
    if (c.categoryId === categoryId) {
      updated = { ...c, ...updates, categoryId };
      return updated;
    }
    return c;
  });
  saveCategories(next);
  return updated;
};

export const deleteCategory = (categoryId) => {
  const categories = fetchCategories();
  const next = categories.filter((c) => c.categoryId !== categoryId);
  saveCategories(next);
  return next;
};

/* ----------------------------- สมาชิก (Members) ----------------------------- */

export const fetchMembers = () => readKey(KEYS.MEMBERS, []);
export const saveMembers = (data) => writeKey(KEYS.MEMBERS, data);

export const addMember = (member) => {
  const members = fetchMembers();
  const newMember = {
    id: uid("mem"),
    name: "",
    email: "",
    role: "Customer",
    status: "active",
    joinedAt: new Date().toISOString(),
    ...member,
  };
  saveMembers([newMember, ...members]);
  return newMember;
};

export const updateMember = (id, updates) => {
  const members = fetchMembers();
  let updated = null;
  const next = members.map((m) => {
    if (m.id === id) {
      updated = { ...m, ...updates, id };
      return updated;
    }
    return m;
  });
  saveMembers(next);
  return updated;
};

export const deleteMember = (id) => {
  const members = fetchMembers();
  const next = members.filter((m) => m.id !== id);
  saveMembers(next);
  return next;
};
