const STORAGE_KEY = 'my_products';

// ฟังก์ชันช่วย: เช็กและใส่ข้อมูลเริ่มต้นถ้า LocalStorage ว่าง
const ensureDataExists = () => {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const initialData = [
      {
        "productId": "1",
        "productName": "ลิปสติกสีชมพู",
        "price": 290,
        "brand": "Brand A",
        "categoryId": "makeup",
        "image": "https://images.unsplash.com/photo-1586495777744-4413a71078b9"
      },
      {
        "productId": "2",
        "productName": "ครีมบำรุงผิวหน้า",
        "price": 850,
        "brand": "Brand B",
        "categoryId": "skincare",
        "image": "https://images.unsplash.com/photo-1612817288484-6f916006741a"
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
  }
};

export const fetchProducts = async (filters = {}) => {
  ensureDataExists(); // ตรวจสอบข้อมูลก่อนดึง
  const allProducts = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

  let filtered = allProducts.filter(p => {
    const price = Number(p.price) || 0;
    const matchesCategory = filters.category ? p.categoryId === filters.category : true;
    const matchesBrand = filters.brand ? (p.brand || "").toLowerCase() === filters.brand.toLowerCase() : true;
    const matchesPrice = price >= filters.minPrice && price <= filters.maxPrice;
    return matchesCategory && matchesBrand && matchesPrice;
  });

  return new Promise((resolve) => setTimeout(() => resolve(filtered), 200));
};

export const createProduct = (newProduct) => {
  const products = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const productToAdd = {
    ...newProduct,
    productId: crypto.randomUUID(),
    createdAt: new Date().toISOString()
  };
  products.push(productToAdd);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return productToAdd;
};

// เพิ่มฟังก์ชันอัปเดต (เผื่ออนาคตคุณต้องแก้ไขสินค้า)
export const updateProduct = (id, updatedFields) => {
  let products = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const index = products.findIndex(p => p.productId === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedFields };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    return products[index];
  }
  return null;
};

export const deleteProduct = (id) => {
  const products = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const filtered = products.filter(p => p.productId !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};