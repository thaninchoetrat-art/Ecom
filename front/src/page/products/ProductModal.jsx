import { useContext, useState } from "react";
import { FiShoppingBag, FiCheck, FiPlus, FiMinus } from "react-icons/fi";
import Swal from "sweetalert2";
import { CartContext } from "../cart/CartContext";

export default function ProductModal({ product, onClose }) {
  const { addItem, items } = useContext(CartContext) || {};
  const isLoggedIn = localStorage.getItem("is_logged_in") === "true";

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // คำนวณค่าต่างๆ เพื่อให้แสดงผลตรงกับ ProductCard
  const regularPrice = parseFloat(product.price || 0);
  const displayPrice = parseFloat(product.discountPrice || product.salePrice || product.price || 0);
  const discount = regularPrice > displayPrice ? Math.round(((regularPrice - displayPrice) / regularPrice) * 100) : 0;

  const currentId = product.productId || product._id || product.id;
  const finalStock = product.stock !== undefined && product.stock !== null ? Number(product.stock) : null;
  const isOutOfStock = finalStock !== null && finalStock <= 0;

  const qtyInCart = (items || []).find((item) => item.productId === currentId)?.quantity || 0;
  const maxAddable = finalStock !== null ? Math.max(0, finalStock - qtyInCart) : null;
  const isDisabled = isOutOfStock || (maxAddable !== null && maxAddable <= 0);

  const increment = () => {
    setQuantity((q) => (maxAddable !== null ? Math.min(q + 1, maxAddable) : q + 1));
  };

  const decrement = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      Swal.fire({
        icon: "info",
        title: "กรุณาเข้าสู่ระบบก่อน",
        text: "ต้องเข้าสู่ระบบก่อน ถึงจะเพิ่มสินค้าลงตะกร้าได้",
        confirmButtonColor: "#ec4899",
        confirmButtonText: "รับทราบ",
      });
      return;
    }

    if (!addItem || isDisabled) return;

    addItem(product, quantity);
    setQuantity(1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-lg p-6 relative shadow-2xl animate-in fade-in zoom-in duration-300">
              
        <button
  onClick={onClose}
  className="absolute top-4 right-4 z-[60] flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-white shadow-lg transition hover:bg-red-700"
>
  <span className="sr-only">Close</span>
  ✕
</button>
        
        {/* รูปภาพพร้อมป้ายส่วนลด */}
        <div className="relative">
          {discount > 0 && (
            <span className="absolute left-3 top-3 z-20 rounded-full bg-pink-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
              -{discount}%
            </span>
          )}
          <img src={product.image || product.imageUrl} alt={product.name} className="w-full h-64 object-cover rounded-2xl" />
        </div>
        
        <div className="mt-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center">{product.name || product.title}</h2>
          
          {/* ข้อมูลแบรนด์และสถานะ */}
          <div className="mt-4 space-y-2">
            <div className="flex justify-between items-center px-4">
              <span className="text-gray-500">แบรนด์</span>
              <span className="font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-lg">{product.brand || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center px-4">
              <span className="text-gray-500">สถานะ</span>
              <span className={`font-medium ${isOutOfStock ? "text-red-500" : "text-emerald-600"}`}>
                {isOutOfStock ? "สินค้าหมด" : `เหลือ ${finalStock} ชิ้น`}
              </span>
            </div>
          </div>

          <p className="text-gray-600 mt-6 leading-relaxed h-24 overflow-y-auto px-2">
            {product.description || "ไม่มีคำอธิบายเพิ่มเติม"}
          </p>
        </div>

        {/* ส่วนราคาและปุ่ม */}
        <div className="mt-6 pt-6 border-t flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            {discount > 0 && <span className="text-gray-400 line-through text-lg">฿{regularPrice.toLocaleString()}</span>}
            <span className="text-4xl font-extrabold text-pink-600">฿{displayPrice.toLocaleString()}</span>
          </div>

          {/* ตัวเลือกจำนวน */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={decrement}
              disabled={isDisabled || quantity <= 1}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiMinus />
            </button>
            <span className="w-8 text-center text-lg font-bold text-gray-800">{quantity}</span>
            <button
              type="button"
              onClick={increment}
              disabled={isDisabled || (maxAddable !== null && quantity >= maxAddable)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <FiPlus />
            </button>
          </div>

          {/* ปุ่มเพิ่มลงตะกร้า */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isLoggedIn && isDisabled}
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white shadow-lg transition
              ${
                isLoggedIn && isDisabled
                  ? "cursor-not-allowed bg-gray-300"
                  : added
                  ? "bg-green-500"
                  : "bg-pink-500 hover:bg-pink-600"
              }`}
          >
            {added ? (
              <>
                <FiCheck />
                เพิ่มแล้ว
              </>
            ) : (
              <>
                <FiShoppingBag />
                {isLoggedIn && isOutOfStock ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}