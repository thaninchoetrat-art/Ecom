const KEYS = {
  PRODUCTS: "my_products",
  CATEGORIES: "my_categories",
  MEMBERS: "my_members",
};

// =======================
// Product Source
// =======================
export const PRODUCT_SOURCE = {
  COMPANY: "company",
  CUSTOMER: "customer",
};

// =======================
// Products
// =======================

export const getAllProducts = () =>
  JSON.parse(localStorage.getItem(KEYS.PRODUCTS) || "[]");

export const saveProducts = (products) => {
  try {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  } catch (error) {
    if (error.name === "QuotaExceededError") {
      alert("ไม่สามารถบันทึกสินค้าได้ หรือรูปภาพมีขนาดใหญ่เกินไป");
    } else {
      console.error("เกิดข้อผิดพลาดในการบันทึกสินค้า", error);
    }
  }
};

export const fetchProducts = (filters = {}) => {
  const allProducts = getAllProducts();

  const {
    category,
    brand,
    minPrice,
    maxPrice,
    search,
  } = filters;

  return allProducts.filter((p) => {
    const prodCatId = String(p.categoryId || "").trim();
    const filterCatId = String(category || "").trim();

    const matchesCategory = category
      ? prodCatId === filterCatId
      : true;

    const matchesBrand = brand
      ? p.brand === brand
      : true;

    const price = parseFloat(
      p.price || p.salePrice || 0
    );

    const matchesPrice =
      price >= (minPrice || 0) &&
      (maxPrice ? price <= maxPrice : true);

    const productName = (
      p.productName ||
      p.title ||
      p.name ||
      ""
    ).toLowerCase();

    const matchesSearch = search
      ? productName.includes(search.toLowerCase())
      : true;

    return (
      matchesCategory &&
      matchesBrand &&
      matchesPrice &&
      matchesSearch
    );
  });
};

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
  const products = getAllProducts();
  const categories = fetchCategories();

  const selectedCat = categories.find(
    (c) =>
      String(c.categoryId) ===
      String(product.categoryId)
  );

  const newProduct = {
    ...product,
    productId:
      product.productId || `PROD-${Date.now()}`,
    source:
      product.source || PRODUCT_SOURCE.COMPANY,
    categoryId: String(product.categoryId),
    category: selectedCat
      ? selectedCat.categoryName
      : "สินค้ามือ 2",
  };

  saveProducts([newProduct, ...products]);

  return newProduct;
};

export const updateProduct = (
  productId,
  updates
) => {
  const products = getAllProducts();

  saveProducts(
    products.map((p) =>
      p.productId === productId
        ? { ...p, ...updates }
        : p
    )
  );
};

export const deleteProduct = (productId) => {
  const products = getAllProducts();

  saveProducts(
    products.filter(
      (p) => p.productId !== productId
    )
  );
};

export const isCompanyProduct = (product) =>
  (product.source ||
    PRODUCT_SOURCE.COMPANY) ===
  PRODUCT_SOURCE.COMPANY;

// =======================
// Categories
// =======================

export const fetchCategories = () => {
  try {
    return JSON.parse(
      localStorage.getItem(KEYS.CATEGORIES) ||
        "[]"
    );
  } catch (err) {
    console.error(
      "อ่านข้อมูลหมวดหมู่ไม่ได้",
      err
    );
    return [];
  }
};

export const saveCategories = (data) => {
  localStorage.setItem(
    KEYS.CATEGORIES,
    JSON.stringify(data)
  );
};

export const initCategories = () => {
  const existing = fetchCategories();

  if (existing.length === 0) {
    const defaults = [
      {
        categoryId: "1",
        categoryName: "สินค้ามือ 1",
      },
      {
        categoryId: "2",
        categoryName: "สินค้ามือ 2",
      },
    ];

    saveCategories(defaults);
    return defaults;
  }

  fixCategoryData();

  return existing;
};

export const fixCategoryData = () => {
  const products = getAllProducts();
  const categories = fetchCategories();

  let hasChanged = false;

  const updatedProducts = products.map((p) => {
    let item = { ...p };
    let changed = false;

    // แก้ข้อมูลเก่า
    if (
      p.categoryId === "สินค้ามือ 1" ||
      p.category === "สินค้ามือ 1"
    ) {
      item.categoryId = "1";
      changed = true;
    }

    if (
      p.categoryId === "สินค้ามือ 2" ||
      p.category === "สินค้ามือ 2"
    ) {
      item.categoryId = "2";
      changed = true;
    }

    if (!item.categoryId) {
      item.categoryId = "2";
      changed = true;
    }

    const cat = categories.find(
      (c) =>
        String(c.categoryId) ===
        String(item.categoryId)
    );

    if (cat) {
      item.category = cat.categoryName;
      changed = true;
    }

    if (changed) hasChanged = true;

    return item;
  });

  if (hasChanged) {
    saveProducts(updatedProducts);
  }
};

// =======================
// Members
// =======================

export const fetchMembers = () =>
  JSON.parse(
    localStorage.getItem(KEYS.MEMBERS) ||
      "[]"
  );

export const saveMembers = (members) =>
  localStorage.setItem(
    KEYS.MEMBERS,
    JSON.stringify(members)
  );

export const addMember = (member) => {
  const members = fetchMembers();

  const newMember = {
    ...member,
    id: member.id || `MEM-${Date.now()}`,
    joinedAt: new Date().toISOString(),
  };

  saveMembers([newMember, ...members]);

  return newMember;
};

export const updateMember = (
  id,
  updates
) => {
  const members = fetchMembers();

  saveMembers(
    members.map((m) =>
      m.id === id
        ? { ...m, ...updates }
        : m
    )
  );
};

export const deleteMember = (id) => {
  const members = fetchMembers();

  saveMembers(
    members.filter((m) => m.id !== id)
  );
};
