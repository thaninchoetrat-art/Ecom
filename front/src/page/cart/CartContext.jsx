import { createContext, useState, useEffect, useMemo } from "react";

export const CartContext = createContext(null);

// 🟢 แยกตะกร้าเป็นรายบัญชี (อิงจากอีเมลที่ login อยู่) ไม่ให้ Admin/Staff/Customer
// ที่ใช้เบราว์เซอร์เครื่องเดียวกันเห็นตะกร้าปนกัน — ถ้ายังไม่ login ใช้ตะกร้ากลาง "guest"
// หมายเหตุ: การ login/logout ในแอปนี้ตั้งใจให้ทำ full page reload เสมอ (ดู login.jsx และ meService.js)
// เพื่อให้ CartProvider (ซึ่งครอบอยู่นอกสุดที่ main.jsx) mount ใหม่และอ่านคีย์ตะกร้าของบัญชีล่าสุดถูกต้อง
function getCartStorageKey() {
  const email = localStorage.getItem('local_user_email');
  return email ? `cart_items_${email}` : 'cart_items_guest';
}

function loadInitialItems(storageKey) {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.error('Failed to load cart from localStorage', err);
    return [];
  }
}

export function CartProvider({ children }) {
  // 🟢 คำนวณคีย์ตะกร้าของบัญชีปัจจุบันครั้งเดียวตอน mount (จะ mount ใหม่ทุกครั้งที่ login/logout)
  const [storageKey] = useState(getCartStorageKey);
  const [items, setItems] = useState(() => loadInitialItems(storageKey));

  // Persist cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch (err) {
      console.error('Failed to save cart to localStorage', err);
    }
  }, [items, storageKey]);

  // Add a product to the cart. If it already exists, increase its quantity.
  const addItem = (product, quantity = 1) => {
    const productId = product.productId || product._id || product.id;
    const name = product.productName || product.title || product.name || 'ไม่มีชื่อสินค้า';
    const price = parseFloat(
      product.discountPrice || product.salePrice || product.price || 0
    );
    const image =
      product.image ||
      product.imageUrl ||
      (product.images && product.images[0]) ||
      '/placeholder.png';
    // จำนวนสต็อกคงเหลือของสินค้า (ถ้าไม่มีข้อมูลจะถือว่าไม่จำกัด)
    const stock =
      product.stock !== undefined && product.stock !== null
        ? Number(product.stock)
        : null;
    // 🟢 เก็บที่มาของสินค้า/ผู้ขายไว้ในตะกร้าด้วย (เผื่อเป็นสินค้าที่ Customer โพสต์ขายเอง)
    // เพื่อให้ตอน checkout ส่งข้อมูลนี้ต่อไปจนถึงหน้าจัดการคำสั่งซื้อของแอดมินได้ว่า "ซื้อจากใคร"
    const source = product.source || "company";
    const sellerEmail = product.sellerEmail || "";
    const sellerName = product.sellerName || "";

    setItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        const maxQty = stock !== null ? stock : existing.stock;
        const nextQty = existing.quantity + quantity;
        return prev.map((item) =>
          item.productId === productId
            ? {
                ...item,
                stock: maxQty,
                quantity:
                  maxQty !== undefined && maxQty !== null
                    ? Math.min(nextQty, maxQty)
                    : nextQty,
              }
            : item
        );
      }
      const initialQty =
        stock !== null && stock !== undefined
          ? Math.min(quantity, stock)
          : quantity;
      return [
        ...prev,
        { productId, name, price, image, quantity: initialQty, stock, source, sellerEmail, sellerName },
      ];
    });
  };

  // ตั้งจำนวนตรง ๆ (ใช้กับปุ่ม +/-) ลบสินค้าออกถ้าจำนวน <= 0 และไม่ให้เกินสต็อก
  const updateQuantity = (productId, quantity) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.productId !== productId);
      }
      return prev.map((item) => {
        if (item.productId !== productId) return item;
        const capped =
          item.stock !== undefined && item.stock !== null
            ? Math.min(quantity, item.stock)
            : quantity;
        return { ...item, quantity: capped };
      });
    });
  };

  // เพิ่มจำนวน 1 ชิ้น แต่ต้องไม่เกินจำนวนสต็อกที่มี
  const increment = (productId) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.productId !== productId) return item;
        const atMax =
          item.stock !== undefined &&
          item.stock !== null &&
          item.quantity >= item.stock;
        if (atMax) return item;
        return { ...item, quantity: item.quantity + 1 };
      })
    );
  };

  const decrement = (productId) => {
    setItems((prev) =>
      prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items]
  );

  const value = {
    items,
    setItems,
    addItem,
    updateQuantity,
    increment,
    decrement,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
