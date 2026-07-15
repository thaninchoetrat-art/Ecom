import { useContext, useState } from "react";
import { FiShoppingBag, FiCheck } from "react-icons/fi";
import { CartContext } from "../cart/CartContext";
import ProductModal from "./ProductModal";

const ProductCard = ({ product }) => {
  const { addItem, items } = useContext(CartContext) || {};

  const [added, setAdded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
const isLoggedIn = localStorage.getItem("is_logged_in") === "true";
  const image =
    product.image ||
    product.imageUrl ||
    (product.images && product.images[0]) ||
    "/placeholder.png";

  const finalName =
    product.productName ||
    product.title ||
    product.name ||
    "ไม่มีชื่อสินค้า";

  const regularPrice = Number(product.price || 0);
  const displayPrice = Number(
    product.discountPrice ||
      product.salePrice ||
      product.price ||
      0
  );

  const discount =
    regularPrice > displayPrice
      ? Math.round(
          ((regularPrice - displayPrice) / regularPrice) * 100
        )
      : 0;

  const currentId =
    product.productId ||
    product._id ||
    product.id;

  const finalBrand =
    product.brand ||
    product.productBrand ||
    "-";

  const finalStock =
    product.stock !== undefined
      ? Number(product.stock)
      : null;

  const qtyInCart =
    (items || []).find(
      (item) => item.productId === currentId
    )?.quantity || 0;

  const isOutOfStock =
    finalStock !== null && finalStock <= 0;

  const isMaxedInCart =
    finalStock !== null &&
    qtyInCart >= finalStock;

  const isDisabled =
    isOutOfStock || isMaxedInCart;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!addItem || isDisabled) return;

    addItem(product, 1);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  return (
    <>
      <div className="group flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">

        {/* รูปสินค้า */}
        <div
          className="relative h-48 cursor-pointer overflow-hidden bg-gray-100"
          onClick={() => setIsModalOpen(true)}
        >
          {discount > 0 && (
            <span className="absolute left-3 top-3 z-20 rounded-full bg-pink-500 px-3 py-1 text-xs font-bold text-white">
              -{discount}%
            </span>
          )}

          <img
            src={image}
            alt={finalName}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
            onError={(e) => {
              e.target.src = "/placeholder.png";
            }}
          />
        </div>

        {/* รายละเอียด */}
        <div className="flex flex-1 flex-col p-4">

          <h3
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer truncate text-center text-lg font-bold text-gray-800 hover:text-pink-600"
          >
            {finalName}
          </h3>

          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">
                แบรนด์
              </span>

              <span className="font-semibold text-pink-600">
                {finalBrand}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                สถานะ
              </span>

              <span
                className={`font-semibold ${
                  isOutOfStock
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {isOutOfStock
                  ? "สินค้าหมด"
                  : `เหลือ ${finalStock} ชิ้น`}
              </span>
            </div>
          </div>

          {/* ราคา */}
          <div className="mt-4 text-center">
            {regularPrice > displayPrice && (
              <div className="text-sm text-gray-400 line-through">
                ฿{regularPrice.toLocaleString()}
              </div>
            )}

            <div className="text-3xl font-bold text-pink-600">
              ฿{displayPrice.toLocaleString()}
            </div>
          </div>

          {/* ปุ่ม */}
         {isLoggedIn && (
  <button
    onClick={handleAddToCart}
    disabled={isDisabled}
    className={`mt-4 flex w-full items-center cursor-pointer justify-center gap-2 rounded-lg py-3 font-semibold text-white transition
      ${
        isDisabled
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
        {isOutOfStock
          ? "สินค้าหมด"
          : "เพิ่มลงตะกร้า"}
      </>
    )}
  </button>
)}
        </div>
      </div>

      {/* Popup */}
      {isModalOpen && (
        <ProductModal
          product={product}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default ProductCard;