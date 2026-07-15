import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const banners = [
  {
    image: "https://img.salehere.co.th/p/1200x0/2022/03/12/h1nvcldy6xk1.jpg",
    title: "ความงามไม่เคยรอใคร",
    subtitle: "พบกับสินค้าเครื่องสำอางใหม่",
  },
  {
    image: "https://www.siamcenter.co.th/public/upload/posts-15-best-beauty-gifts-for-mom-2020-08-06-122438-r.jpg",
    title: "ลดกระหนำ่ Summer Sale",
    subtitle: "ลดสูงสุด 50%",
  },
  {
    image: "https://img.salehere.co.th/p/1200x0/2024/02/20/xgnqeqrcqm3v.jpg",
    title: "New Brand ",
    subtitle: "เครื่องสำอางมาใหม่",
  },
];

export default function CategoryBanner() {
  return (
    <section className="w-full h-64 px-4 overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        pagination={{ clickable: true }}
        className="h-full"
      >
        {banners.map((banner, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative h-full bg-cover bg-center rounded-3xl overflow-hidden"
              style={{ backgroundImage: `url(${banner.image})` }}
            >
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="relative flex h-full items-center justify-start px-12">
                <div className="text-left text-white">
                  <h1 className="text-4xl font-bold">{banner.title}</h1>
                  <p className="mt-3 text-lg">{banner.subtitle}</p>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}