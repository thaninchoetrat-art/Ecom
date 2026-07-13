import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { FiHeart, FiEye, FiShoppingBag, FiCheck } from "react-icons/fi";
import { CartContext } from "../cart/CartContext";

const ProductCard = ({ product }) => {
  const { addItem, items } = useContext(CartContext) || {};
  const [added, setAdded] = useState(false);
  // 🎯 ดักจับรูปภาพ เผื่อระบบใช้คีย์ image, imageUrl หรือ images[0]
  const image = product.image || product.imageUrl || (product.images && product.images[0]) || "/placeholder.png";
  const hoverImage = image;

  // 🎯 ดักจับชื่อสินค้า รองรับทั้ง productName (จากเซิร์ฟเวอร์) และ title / name (จาก Local Storage)
  const finalName = product.productName || product.title || product.name || "ไม่มีชื่อสินค้า";

  // 🎯 ดักจับราคาปกติ และราคาลด (รองรับ discountPrice และ salePrice)
  const regularPrice = parseFloat(product.price || 0);
  const displayPrice = parseFloat(product.discountPrice || product.salePrice || product.price || 0);

  const discount =
    regularPrice > displayPrice
      ? Math.round(((regularPrice - displayPrice) / regularPrice) * 100)
      : 0;

  const currentId = product.productId || product._id || product.id;

  // 🎯 ดักจับค่าแบรนด์ สต็อก และรายละเอียดสินค้าเพิ่มเติม
  const finalBrand = product.brand || product.productBrand || "";
  const finalStock = product.stock !== undefined ? Number(product.stock) : null;
  const finalDescription = product.description || "";

  // 🎯 เช็คว่าสินค้านี้อยู่ในตะกร้าแล้วกี่ชิ้น เพื่อไม่ให้กดเพิ่มเกินสต็อกที่มี
  const qtyInCart =
    (items || []).find((item) => item.productId === currentId)?.quantity || 0;
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
    <div className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-gray-850 bg-[#121212] shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-2xl">

      {/* โซนรูปภาพสินค้า */}
      <div className="relative overflow-hidden bg-[#1a1a1a]">
        {discount > 0 && (
          <span className="absolute left-3 top-3 z-20 rounded-md bg-red-500 px-3 py-1 text-xs font-black text-white tracking-wider uppercase shadow-md">
            -{discount}%
          </span>
        )}

        <Link to={`/products/${currentId}`}>
          <img
            src={image}
            alt={finalName}
            className="h-56 w-full object-cover transition duration-500 group-hover:opacity-0"
          />

          <img
            src={hoverImage}
            alt={finalName}
            className="absolute inset-0 h-56 w-full scale-105 object-cover opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100"
          />
        </Link>

        {/* ปุ่มลอย Action */}
        <div className="absolute right-3 top-3 flex translate-x-12 flex-col gap-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
          <button className="rounded-full bg-[#222] border border-gray-700 p-2 text-white shadow hover:bg-pink-500 hover:text-white transition">
            <FiHeart size={16} />
          </button>
          <button className="rounded-full bg-[#222] border border-gray-700 p-2 text-white shadow hover:bg-pink-500 hover:text-white transition">
            <FiEye size={16} />
          </button>
        </div>
      </div>

      {/* โซนเนื้อหาข้อมูลสินค้า */}
      <div className="flex flex-grow flex-col p-4 bg-[#141414]">
        
        {/* 🏷️ ชื่อสินค้า: ขยายเป็น text-lg (ใหญ่เต็มตา) และ font-extrabold */}
        <Link
          to={`/products/${currentId}`}
          className="line-clamp-2 text-center text-lg font-extrabold text-white transition hover:text-pink-400 tracking-wide"
          style={{ minHeight: '52px' }}
        >
          {finalName}
        </Link>

        {/* 🏷️ บล็อกรายละเอียดสินค้าขยายขนาดตัวอักษรขึ้นเป็น text-[13px] ทั้งแผง */}
        {/* 🎯 กำหนด min-height ให้บล็อกนี้ เพื่อให้การ์ดที่ไม่มีบางฟิลด์ (เช่น ไม่มีรายละเอียด) ยังสูงเท่ากับการ์ดอื่น ปุ่มด้านล่างจะได้อยู่แนวเดียวกันทุกใบ */}
        <div className="mt-4 min-h-[112px] space-y-3 border-t border-b border-gray-800 py-3 text-[13px] text-gray-250">
          
          {finalBrand && (
            <div className="flex justify-between items-center px-1">
              <span className="text-gray-400 font-medium">แบรนด์สินค้า:</span>
              <span className="font-bold text-pink-400 bg-pink-950/50 border border-pink-900/60 px-2.5 py-0.5 rounded text-[12px]">{finalBrand}</span>
            </div>
          )}

          {finalDescription && (
            <div className="flex justify-between items-start px-1 gap-4">
              <span className="text-gray-400 font-medium shrink-0">รายละเอียด:</span>
              <span className="text-gray-200 line-clamp-1 text-right font-medium">{finalDescription}</span>
            </div>
          )}

          {finalStock !== null && (
            <div className="flex justify-between items-center px-1">
              <span className="text-gray-400 font-medium">สถานะสต็อก:</span>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-gray-300 font-medium">พร้อมส่ง <strong className="text-white text-[14px] font-black">{finalStock}</strong> ชิ้น</span>
              </div>
            </div>
          )}

        </div>

        {/* โซนแสดงราคา: ขยายราคาพิเศษให้ใหญ่กระแทกตาเป็น text-2xl */}
        <div className="mt-4 mb-4 flex items-baseline justify-center gap-2">
          {discount > 0 && (
            <span className="text-sm text-gray-500 line-through font-medium">
              ฿{regularPrice.toLocaleString()}
            </span>
          )}
          <span className="text-2xl font-black text-pink-500 tracking-tight">
            ฿{displayPrice.toLocaleString()}
          </span>
        </div>

        {/* ปุ่มเพิ่มลงตะกร้า: ขยายขนาดปุ่มและฟอนต์ให้กดง่ายขึ้น */}
        {/* 🎯 ปิดการกดปุ่มเมื่อสินค้าหมดสต็อก หรือมีอยู่ในตะกร้าครบตามจำนวนสต็อกแล้ว เพื่อให้ทุกการ์ดมีพฤติกรรมเดียวกัน ไม่ว่าสต็อกจะเหลือกี่ชิ้น */}
        <button
          onClick={handleAddToCart}
          disabled={isDisabled}
          className={`mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition duration-200 active:scale-[0.98] ${
            isDisabled
              ? "bg-gray-600 cursor-not-allowed opacity-60 hover:bg-gray-600 active:scale-100"
              : added
              ? "bg-green-500 hover:bg-green-600"
              : "bg-pink-500 hover:bg-pink-600"
          }`}
        >
          {isDisabled ? (
            <>
              <FiShoppingBag size={16} />
              {isOutOfStock ? "สินค้าหมด" : "ครบจำนวนที่มี"}
            </>
          ) : added ? (
            <>
              <FiCheck size={16} />
              เพิ่มแล้ว
            </>
          ) : (
            <>
              <FiShoppingBag size={16} />
              เพิ่มลงตะกร้า
            </>
          )}
        </button>

      </div>
    </div>
  );
};

export default ProductCard;