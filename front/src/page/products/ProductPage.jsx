import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import ProductGrid from "./ProductGrid";
import SearchBox from "../../components/layout/SearchBox"; 
import { fetchProducts } from "./productService";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // สถานะเริ่มต้นของตัวกรองทั้งหมด
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 3000,
    brand: "",
    search: "",
    categoryId: '',
  });

  // ใช้ useEffect เพื่อดึงข้อมูลใหม่ทุกครั้งที่ filters เปลี่ยน
  useEffect(() => {
    setLoading(true);
    
    // เรียก fetchProducts ซึ่งเป็นฟังก์ชันที่กรองข้อมูลจาก localStorage ให้อัตโนมัติ
    const data = fetchProducts(filters);
    
    setProducts(data || []);
    setLoading(false);
  }, [filters]);

  // ฟังก์ชันสำหรับอัปเดต Search แยกต่างหากเพื่อความยืดหยุ่น
  const handleSearchChange = (searchValue) => {
    setFilters((prev) => ({ ...prev, search: searchValue }));
  };

  return (
    <div className="w-full py-4 px-4 lg:px-8">
      {/* ส่วน SearchBox */}
      <div className="mb-8">
        <SearchBox onSearch={handleSearchChange} />
      </div>

      <div className="grid grid-cols-12 gap-6 lg:gap-10">
        
        {/* ฝั่งซ้าย: Sidebar ส่ง filters และ setFilters ไปให้ Sidebar จัดการ */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="w-full sticky top-4">
            <Sidebar
              currentFilters={filters}
              onFilterChange={setFilters}
            />
          </div>
        </aside>

        {/* ฝั่งขวา: Grid แสดงสินค้า */}
        <section className="col-span-12 lg:col-span-9 w-full">
          <ProductGrid
            products={products}
            loading={loading}
          />
        </section>
      </div>
    </div>
  );
};

export default ProductPage;