import { useState, useEffect } from "react";

const Sidebar = ({ currentFilters, onFilterChange }) => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const API_BASE_URL = "http://localhost:4000/api";

  // ดึงข้อมูลมาใส่เมนูใน Sidebar ทันทีที่เปิดหน้าเว็บ
  useEffect(() => {
    // 1. ดึงข้อมูลหมวดหมู่สินค้า
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error categories:", err));

    // 2. ดึงข้อมูลแบรนด์และจำนวนสินค้าจาก Backend
    fetch(`${API_BASE_URL}/products/all/brands`)
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error("Error brands:", err));
  }, []);

  // ฟังก์ชันสลับการเลือกหมวดหมู่ (คลิกซ้ำ = ยกเลิกฟิลเตอร์)
  const handleCategoryClick = (categoryName) => {
    const nextCategory = currentFilters.category === categoryName ? "" : categoryName;
    onFilterChange({ ...currentFilters, category: nextCategory });
  };

  // ฟังก์ชันสลับการเลือกแบรนด์ (คลิกซ้ำ = ยกเลิกฟิลเตอร์)
  const handleBrandClick = (brandName) => {
    const nextBrand = currentFilters.brand === brandName ? "" : brandName;
    onFilterChange({ ...currentFilters, brand: nextBrand });
  };

  return (
    /* 
      [แก้ไขจุดที่ 1]: 
      - ลบ lg:max-w-[500px] และ lg:ml-auto ออกไป เพื่อปล่อยให้ Sidebar ยืดขยายเต็มคอลัมน์กว้าง (col-span-3) ที่หน้าหลักเตรียมไว้ให้ 
      - เพิ่มเงาละมุน (shadow-sm) ให้ดูมีมิติแยกจากพื้นหลังเว็บ
    */
    <div className="w-full bg-white p-5 border border-gray-100 rounded-lg font-sans text-gray-800 select-none shadow-sm">
      
      {/* 1. เลือกตามประเภท */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3 text-gray-900">เลือกตามประเภท</h3>
        <div className="border-t border-gray-100 divide-y divide-gray-100 text-sm">
          {categories.map((cat, idx) => {
            const isSelected = currentFilters.category === cat.categoryId;
            return (
              <button
                key={idx}
                onClick={() => handleCategoryClick(cat.categoryId)}
                className={`w-full flex justify-between items-center py-3 px-1 transition-colors hover:text-pink-600 ${
                  isSelected ? "font-bold text-pink-600" : "text-gray-700"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="text-[10px] transform rotate-90 scale-75">▲</span>
                  {cat.categoryName}
                </span>
                <span className="text-gray-400 text-xs">❯</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. เลือกการกรองสินค้า (ราคา) */}
      <div className="mb-6">
        <h3 className="font-bold text-lg mb-3 text-gray-900">เลือกการกรองสินค้า</h3>
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold mb-3 text-gray-700">ราคา</h4>
          <div className="relative mb-2">
            <input
              type="range"
              min="0"
              /* [แก้ไขจุดที่ 2]: ขยับ max เป็น 3000 ให้สอดคล้องกับค่าเริ่มต้นสูงสุดในหน้า ProductPage */
              max="3000" 
              value={currentFilters.maxPrice}
              onChange={(e) => onFilterChange({ ...currentFilters, maxPrice: parseInt(e.target.value) })}
              className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
            />
          </div>
          <div className="text-sm mt-2 text-gray-600">
            เริ่มต้น : <span className="font-medium">0฿ - {currentFilters.maxPrice}฿</span>
          </div>
        </div>
      </div>

      <hr className="my-5 border-gray-100" />

      {/* 3. แบรนด์ */}
      <div>
        <h4 className="text-sm font-semibold mb-3 text-gray-700">แบรนด์</h4>
        <div className="space-y-2 max-h-72 overflow-y-auto pr-1 text-sm custom-scrollbar">
          {brands.map((b, idx) => {
            const isSelected = currentFilters.brand === b.name;
            return (
              <div
                key={idx}
                onClick={() => handleBrandClick(b.name)}
                className={`flex items-center gap-2.5 cursor-pointer py-1 px-1 rounded hover:bg-gray-50 transition-colors ${
                  isSelected ? "text-pink-600 font-bold" : "text-gray-700"
                }`}
              >
                <span className="text-[9px] text-gray-900">■</span>
                <span className="flex-1 truncate">{b.name}</span>
                <span className="text-gray-400 text-xs font-light">({b.count})</span>
              </div>
            );
          })}
        </div>
      </div>
      
    </div>
  );
};

export default Sidebar;