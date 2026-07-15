const KEYS = { PRODUCTS: 'my_products', CATEGORIES: 'my_categories', MEMBERS: 'my_members' };

// =======================
// จัดการข้อมูลสินค้า (Products)
// =======================
// 🟢 source แยกว่าสินค้านี้เป็นของบริษัทเอง ('company' — เพิ่มโดย Admin/Staff)
// หรือของลูกค้าที่ลงขายเอง ('customer') สินค้าเก่าที่ไม่มีค่านี้ให้ถือว่าเป็นของบริษัท (backward compatible)
export const PRODUCT_SOURCE = { COMPANY: 'company', CUSTOMER: 'customer' };
export const isCompanyProduct = (p) => (p.source || PRODUCT_SOURCE.COMPANY) === PRODUCT_SOURCE.COMPANY;

export const fetchProducts = () => JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || "[]");
export const saveProducts = (data) => localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(data));

// 🟢 อัปโหลดไฟล์รูปสินค้าขึ้นเซิร์ฟเวอร์ (แทนการวางลิงก์รูปเอง) — คืนค่า URL ของรูปที่อัปโหลดแล้ว
export const uploadProductImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch("http://localhost:4000/api/products", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok || !data.imageUrl) throw new Error(data.message || "อัปโหลดรูปภาพไม่สำเร็จ");
  return data.imageUrl;
};

export const addProduct = (product) => {
  const products = fetchProducts();
  const newProduct = {
    ...product,
    productId: product.productId || `PROD-${Date.now()}`, // สร้าง ID อัตโนมัติถ้าไม่มี
    source: product.source || PRODUCT_SOURCE.COMPANY,
  };
  saveProducts([newProduct, ...products]);
  return newProduct;
};

export const updateProduct = (productId, updates) => {
  const products = fetchProducts();
  const nextProducts = products.map(p => 
    p.productId === productId ? { ...p, ...updates } : p
  );
  saveProducts(nextProducts);
};

export const deleteProduct = (productId) => {
  const products = fetchProducts();
  saveProducts(products.filter(p => p.productId !== productId));
};

// =======================
// จัดการข้อมูลหมวดหมู่ (Categories)
// =======================
export const fetchCategories = () => JSON.parse(localStorage.getItem(KEYS.CATEGORIES) || "[]");
export const saveCategories = (data) => localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(data));

// =======================
// จัดการข้อมูลสมาชิก (Members)
// =======================
export const fetchMembers = () => JSON.parse(localStorage.getItem(KEYS.MEMBERS) || "[]");
export const saveMembers = (data) => localStorage.setItem(KEYS.MEMBERS, JSON.stringify(data));

export const addMember = (member) => {
  const members = fetchMembers();
  const newMember = { 
    ...member, 
    id: member.id || `MEM-${Date.now()}`,
    joinedAt: new Date().toISOString()
  };
  saveMembers([newMember, ...members]);
  return newMember;
};

export const updateMember = (id, updates) => {
  const members = fetchMembers();
  const nextMembers = members.map(m => 
    m.id === id ? { ...m, ...updates } : m
  );
  saveMembers(nextMembers);
};

export const deleteMember = (id) => {
  const members = fetchMembers();
  saveMembers(members.filter(m => m.id !== id));
};