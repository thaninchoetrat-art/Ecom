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
      } finally {
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
    <div className="w-full py-10">
      <div className="mx-auto max-w-[1600px] px-16">

        <div className="grid grid-cols-12 gap-10">

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-3 flex justify-end">
            <div className="w-full max-w-[300px]">
              <Sidebar
                currentFilters={filters}
                onFilterChange={setFilters}
              />
            </div>
          </aside>

          {/* Product */}
          <section className="col-span-12 lg:col-span-9">
            <ProductGrid
              products={products}
              loading={loading}
            />
          </section>

        </div>

      </div>
    </div>
  );
};

export default ProductPage;