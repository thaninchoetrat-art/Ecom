import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiEye, FiShoppingBag, FiCheck } from "react-icons/fi";
import { CartContext } from "../cart/CartContext";

const ProductCard = ({ product }) => {
  const { addItem, items } = useContext(CartContext) || {};
  const [added, setAdded] = useState(false);
  
  const image = product.image || product.imageUrl || (product.images && product.images[0]) || "/placeholder.png";
  const finalName = product.productName || product.title || product.name || "ไม่มีชื่อสินค้า";

  const regularPrice = parseFloat(product.price || 0);
  const displayPrice = parseFloat(product.discountPrice || product.salePrice || product.price || 0);

  const discount = regularPrice > displayPrice ? Math.round(((regularPrice - displayPrice) / regularPrice) * 100) : 0;
  const currentId = product.productId || product._id || product.id;

  const finalBrand = product.brand || product.productBrand || "";
  const finalStock = product.stock !== undefined ? Number(product.stock) : null;
  const finalDescription = product.description || "";

  const qtyInCart = (items || []).find((item) => item.productId === currentId)?.quantity || 0;
  const isOutOfStock = finalStock !== null && finalStock <= 0;
  const isMaxedInCart = finalStock !== null && qtyInCart >= finalStock;
  const isDisabled = isOutOfStock || isMaxedInCart;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!addItem || isDisabled) return;
    addItem(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <div className="relative overflow-hidden bg-gray-50">
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-20 rounded-md bg-pink-500 px-3 py-1 text-xs font-black text-white tracking-wider uppercase shadow-md">
            -{discount}%
          </span>
        )}

        <Link to={`/products/${currentId}`} className="block overflow-hidden">
          <img
            src={image}
            alt={finalName}
            className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
            onError={(e) => { e.target.src = "/placeholder.png"; }}
          />
        </Link>

        <div className="absolute right-3 top-3 flex translate-x-12 flex-col gap-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100 z-20">
          <button className="rounded-full bg-white border border-gray-200 p-2 text-gray-600 shadow hover:bg-pink-500 hover:text-white transition">
            <FiHeart size={16} />
          </button>
          <button className="rounded-full bg-white border border-gray-200 p-2 text-gray-600 shadow hover:bg-pink-500 hover:text-white transition">
            <FiEye size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-grow flex-col p-4 bg-white">
        <Link
          to={`/products/${currentId}`}
          className="line-clamp-2 text-center text-lg font-bold text-gray-900 transition hover:text-pink-500 tracking-wide"
          style={{ minHeight: '52px' }}
        >
          {finalName}
        </Link>

        <div className="mt-4 min-h-[112px] space-y-3 border-t border-b border-gray-100 py-3 text-[13px] text-gray-600">
          {finalBrand && (
            <div className="flex justify-between items-center px-1">
              <span className="text-gray-500 font-medium">แบรนด์:</span>
              <span className="font-bold text-pink-600 bg-pink-50 px-2.5 py-0.5 rounded text-[12px]">{finalBrand}</span>
            </div>
          )}

          {finalDescription && (
            <div className="flex justify-between items-start px-1 gap-4">
              <span className="text-gray-500 font-medium shrink-0">รายละเอียด:</span>
              <span className="text-gray-700 line-clamp-1 text-right font-medium">{finalDescription}</span>
            </div>
          )}

          {finalStock !== null && (
            <div className="flex justify-between items-center px-1">
              <span className="text-gray-500 font-medium">สถานะ:</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                <span className="text-gray-700 font-medium">พร้อมส่ง <strong className="text-gray-900 text-[14px] font-black">{finalStock}</strong></span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 mb-4 flex items-baseline justify-center gap-2">
          {discount > 0 && (
            <span className="text-sm text-gray-400 line-through font-medium">
              ฿{regularPrice.toLocaleString()}
            </span>
          )}
          <span className="text-2xl font-black text-gray-900 tracking-tight">
            ฿{displayPrice.toLocaleString()}
          </span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isDisabled}
          className={`mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-sm transition duration-200 active:scale-[0.98] ${
            isDisabled
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : added
              ? "bg-green-500"
              : "bg-pink-600 hover:bg-pink-700" // 👈 แก้ตรงนี้เป็นสีชมพูแล้วครับ
          }`}
        >
          {isDisabled ? (
            <>{isOutOfStock ? "สินค้าหมด" : "ครบจำนวน"}</>
          ) : added ? (
            <><FiCheck size={16} /> เพิ่มแล้ว</>
          ) : (
            <><FiShoppingBag size={16} /> เพิ่มลงตะกร้า</>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;