import { useEffect, useState } from "react";
import {
  getAllProducts,
  initCategories,
} from "../../page/products/productService";

const Sidebar = ({ currentFilters, onFilterChange }) => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  const loadCategories = () => {
    const data = initCategories();
    setCategories(data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const allProducts = getAllProducts();

    const filteredByCategory = currentFilters.category
      ? allProducts.filter(
          (p) => String(p.categoryId) === String(currentFilters.category)
        )
      : allProducts;

    const uniqueBrands = [
      ...new Set(filteredByCategory.map((p) => p.brand).filter(Boolean)),
    ];

    setBrands(uniqueBrands);
  }, [currentFilters.category]);

  const snapPoints = [0, 300, 500, 800, 1500, 2500, 3000,1000000];

  // Slider
  const handleSliderChange = (e) => {
    const val = Number(e.target.value);

    const closest = snapPoints.reduce((prev, curr) =>
      Math.abs(curr - val) < Math.abs(prev - val) ? curr : prev
    );

    onFilterChange({
      ...currentFilters,
      maxPrice: closest,
    });
  };

  // ราคาต่ำสุด
  const handleMinPriceChange = (e) => {
    let value = Number(e.target.value);

    if (value < 0) value = 0;
    if (value > currentFilters.maxPrice)
      value = currentFilters.maxPrice;

    onFilterChange({
      ...currentFilters,
      minPrice: value,
    });
  };

  // ราคาสูงสุด
  const handleMaxPriceChange = (e) => {
    let value = Number(e.target.value);

    if (value > 1000000) value = 1000000;
    if (value < currentFilters.minPrice)
      value = currentFilters.minPrice;

    onFilterChange({
      ...currentFilters,
      maxPrice: value,
    });
  };

  return (
    <div className="w-full bg-white p-5 border border-gray-100 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-900">
          ตัวกรอง
        </h3>

        <button
          onClick={() =>
            onFilterChange({
              category: "",
              brand: "",
              minPrice: 0,
              maxPrice: 1000000,
            })
          }
          className="text-xs text-pink-600 hover:underline cursor-pointer"
        >
          ล้างทั้งหมด
        </button>
      </div>

      {/* ราคา */}
      <div className="mb-8">
        <div className="flex justify-between mb-3">
    <h4 className="text-sm font-semibold text-gray-700">
      ช่วงราคา
    </h4>

    <span className="text-sm font-bold text-pink-600">
      {(Number(currentFilters.minPrice || 0)).toLocaleString()} -{" "}
      {(Number(currentFilters.maxPrice || 1000000)).toLocaleString()} ฿
    </span>
  </div>
                {/* ช่องกรอกราคา */}
               <div className="flex gap-2 mb-4">
  <input
    type="text"
    value={
      currentFilters.minPrice === ""
        ? ""
        : Number(currentFilters.minPrice).toLocaleString()
    }
    onChange={(e) => {
      const value = e.target.value.replace(/,/g, "");

      if (/^\d*$/.test(value)) {
        onFilterChange({
          ...currentFilters,
          minPrice: value === "" ? "" : Number(value),
        });
      }
    }}
    placeholder="ต่ำสุด"
    className="w-1/2 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
  />

  <input
    type="text"
    value={
      currentFilters.maxPrice === ""
        ? ""
        : Number(currentFilters.maxPrice).toLocaleString()
    }
    onChange={(e) => {
      const value = e.target.value.replace(/,/g, "");

      if (/^\d*$/.test(value)) {
        onFilterChange({
          ...currentFilters,
          maxPrice: value === "" ? "" : Number(value),
        });
      }
    }}
    placeholder="สูงสุด"
    className="w-1/2 border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
  />
</div>

       


      </div>

      {/* หมวดหมู่ */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-3 text-gray-700">
          หมวดหมู่
        </h4>

        <div className="space-y-1 ">
          {categories.map((cat) => (
            <button
              key={cat.categoryId}
              onClick={() =>
                onFilterChange({
                  ...currentFilters,
                  category: cat.categoryId,
                  brand: "",
                })
              }
              className={`block w-full text-left text-sm py-1 cursor-pointer ${
                String(currentFilters.category) ===
                String(cat.categoryId)
                  ? "text-pink-600 font-bold"
                  : "text-gray-600 hover:text-pink-600"
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* แบรนด์ */}
      <div>
        <h4 className="font-semibold text-sm mb-3 text-gray-700">
          แบรนด์
        </h4>

        <div className="max-h-40 overflow-y-auto space-y-1">
          {brands.length > 0 ? (
            brands.map((brand) => (
              <button
                key={brand}
                onClick={() =>
                  onFilterChange({
                    ...currentFilters,
                    brand,
                  })
                }
                className={`block w-full text-left text-sm py-1  cursor-pointer ${
                  currentFilters.brand === brand
                    ? "text-pink-600 font-bold"
                    : "text-gray-600 hover:text-pink-600"
                }`}
              >
                {brand}
              </button>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">
              เลือกหมวดหมู่ก่อน
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;