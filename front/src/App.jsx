import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import TopBar from "./components/layout/TopBar";
import SearchBox from "./components/layout/SearchBox";
import CategoryBanner from "./components/banner/CategoryBanner";

import ProductPage from "./page/products/ProductPage";

export default function App() {
  return (
    <div className="min-h-screen bg-white flex flex-col w-full overflow-x-hidden">
     
      <Navbar />
      <TopBar />
       <br />
    
      <CategoryBanner />
      
     
      <main className="w-full px-[4%] md:px-[8%] lg:px-[11%] xl:px-[13%] py-8 flex flex-col gap-6">
        
       
        <br />
        
      
        <SearchBox />
        
      
        <ProductPage />

      </main>
      
      <br />
      <br />
      <br />
      
     
     
        <Footer />
      
    </div>
  );
}