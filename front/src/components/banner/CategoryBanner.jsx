// 📄 แก้ไขไฟล์: src/components/banner/CategoryBanner.jsx
const CategoryBanner = () => {
  return (
    <section
      // 🟢 ปรับปรุงให้ยืดเต็มจอแบบสมบูรณ์และลบมุมโค้งออกเพื่อให้ภาพแผ่ชนขอบจออย่างโปรแกรมเมอร์มืออาชีพ
      className="relative h-72 w-full overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600')",
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/35" />

      <div className="relative flex h-full items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold tracking-wide">
            Cosmetic Collection
          </h1>

          <p className="mt-3 text-lg opacity-90">
            Beauty Starts Here
          </p>
        </div>
      </div>
    </section>
  );
};

export default CategoryBanner;