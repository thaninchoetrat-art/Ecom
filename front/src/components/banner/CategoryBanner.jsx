const CategoryBanner = () => {
  return (
    <section
      // ใส่ rounded-2xl เพื่อให้มุมโค้งมนสวยงามตามภาพดีไซน์เดิม
      className="relative h-72 overflow-hidden  bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600')",
      }}
    >
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative flex h-full items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold">
            Cosmetic Collection
          </h1>

          <p className="mt-3 text-lg">
            Beauty Starts Here
          </p>
        </div>
      </div>
    </section>
  );
};

export default CategoryBanner;