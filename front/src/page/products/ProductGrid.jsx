import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [], loading = false }) => {
  // สถานะระหว่างโหลดข้อมูล
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="h-82.5 animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  // สถานะเมื่อไม่มีสินค้าในระบบ (จุดแก้ไขหลัก)
  if (!products.length) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white p-8 shadow-sm">
        <div className="text-5xl">🛍️</div>
        <h3 className="mt-4 text-xl font-semibold text-gray-800">
          ไม่พบสินค้า
        </h3>
        <p className="mt-2 text-gray-500 text-sm text-center">
          ลองเปลี่ยนเงื่อนไขหรือเลือกหมวดหมู่ใหม่อีกครั้ง
        </p>
      </div>
    );
  }

  // สถานะเมื่อมีสินค้าพร้อมแสดงผล
  return (
    <div className="grid grid-cols-2 justify-items-center gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((item) => (
        <div
          key={item.productId || item._id}
          className="w-full max-w-60"
        >
          <ProductCard product={item} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;