import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [], loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="h-[330px] animate-pulse rounded-xl bg-gray-100"
          />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex h-96 w-full flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white">
        <div className="text-5xl">🛍️</div>

        <h3 className="mt-4 text-xl font-semibold">
          ไม่พบสินค้า
        </h3>

        <p className="mt-2 text-gray-500">
          ลองเปลี่ยนตัวกรองหรือค้นหาใหม่
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 justify-items-center gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {products.map((item) => (
        <div
          key={item.productId || item._id}
          className="w-full max-w-[240px]"
        >
          <ProductCard product={item} />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;