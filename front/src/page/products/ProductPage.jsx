import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import ProductGrid from "./ProductGrid";
import { fetchProducts } from "./productService";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    minPrice: 0,
    maxPrice: 3000,
    brand: "",
  });

  useEffect(() => {
    let mounted = true;
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts(filters);
        if (mounted) {
          setProducts(data || []);
        }
      } catch (err) {
        console.error(err);
        if (mounted) {
          setProducts([]);
        }
      } finally { // 🟢 แก้ไขสะกดคำว่า finally (เติม l ให้ครบ 2 ตัว) เรียบร้อยแล้วครับ
        if (mounted) {
          setLoading(false);
        }
      }
    };
    loadProducts();
    return () => {
      mounted = false;
    };
  }, [filters]);

  return (
    <div className="w-full py-4">
      {/* ใช้ระบบ Grid แบ่ง 12 ส่วนอย่างสมบูรณ์ */}
      <div className="grid grid-cols-12 gap-6 lg:gap-10">
        
        {/* ฝั่งซ้าย: Sidebar (ตัวกรอง) - เอา flex justify-end ออกเพื่อให้กางเต็มพื้นที่ 3 ส่วน */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="w-full">
            <Sidebar
              currentFilters={filters}
              onFilterChange={setFilters}
            />
          </div>
        </aside>

        {/* ฝั่งขวา: Grid แสดงสินค้า - เติม w-full ป้องกันเนื้อหายุบตัวเข้าตรงกลาง */}
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