import { Link } from "react-router-dom";
import { FiHeart, FiEye, FiShoppingBag } from "react-icons/fi";

const ProductCard = ({ product }) => {
  const image = product.image || "/placeholder.png";
  const hoverImage = image;

  const displayPrice = product.discountPrice || product.price || 0;

  const discount =
    product.price > displayPrice
      ? Math.round(((product.price - displayPrice) / product.price) * 100)
      : 0;

  const currentId = product.productId || product._id;

  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

      <div className="relative overflow-hidden">
        {discount > 0 && (
          <span className="absolute left-2 top-2 z-20 rounded-full bg-red-500 px-2 py-1 text-[10px] font-bold text-white">
            -{discount}%
          </span>
        )}

        <Link to={`/products/${currentId}`}>
          <img
            src={image}
            alt={product.productName}
            className="h-48 w-full object-cover transition duration-500 group-hover:opacity-0"
          />

          <img
            src={hoverImage}
            alt={product.productName}
            className="absolute inset-0 h-48 w-full scale-110 object-cover opacity-0 transition duration-500 group-hover:scale-100 group-hover:opacity-100"
          />
        </Link>

        <div className="absolute right-2 top-2 flex translate-x-8 flex-col gap-2 opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">

          <button className="rounded-full bg-white p-2 shadow hover:bg-pink-500 hover:text-white">
            <FiHeart size={14} />
          </button>

          <button className="rounded-full bg-white p-2 shadow hover:bg-pink-500 hover:text-white">
            <FiEye size={14} />
          </button>

        </div>
      </div>

      <div className="flex flex-grow flex-col p-3">

        <Link
          to={`/products/${currentId}`}
          className="line-clamp-2 min-h-[38px] text-center text-xs font-medium text-gray-800 transition hover:text-pink-500"
        >
          {product.productName || "ไม่มีชื่อสินค้า"}
        </Link>

        <div className="mt-2 flex items-center justify-center gap-2">

          {discount > 0 && (
            <span className="text-xs text-gray-400 line-through">
              ฿{product.price}
            </span>
          )}

          <span className="text-base font-bold text-pink-600">
            ฿{displayPrice}
          </span>

        </div>

        <button className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-pink-500 py-2 text-xs font-semibold text-white transition hover:bg-pink-600">
          <FiShoppingBag size={14} />
          เพิ่มลงตะกร้า
        </button>

      </div>
    </div>
  );
};

export default ProductCard;