import { FiShoppingBag } from "react-icons/fi";

export default function ProductModal({ product, onClose }) {
  // คำนวณค่าต่างๆ เพื่อให้แสดงผลตรงกับ ProductCard
  const regularPrice = parseFloat(product.price || 0);
  const displayPrice = parseFloat(product.discountPrice || product.salePrice || product.price || 0);
  const discount = regularPrice > displayPrice ? Math.round(((regularPrice - displayPrice) / regularPrice) * 100) : 0;
  const isOutOfStock = product.stock !== undefined && Number(product.stock) <= 0;

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
                {isOutOfStock ? "สินค้าหมด" : `เหลือ ${product.stock} ชิ้น`}
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
          
          
        </div>
      </div>
    </div>
  );
}