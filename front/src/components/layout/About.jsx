import Navbar from "./Navbar";
import Topbar from "./TopBar";
import Footer from "./Footer"

const About = () => {
 
  const items = [
    { title: "เมคอัพสำหรับทุกสไตล์", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQJU8BP1mDgEoRPi_m9AIDuWS5lcPXSYiv9glUDw0Iy2w&s=10" },
    { title: "เทรนด์ที่กำลังมาแรงจากนิวยอร์ก", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWOn_cda0egE0tQgY-oGCTYFnp4kpo1a8fDg84WXp-cw&s=10" },
    { title: "เมคอัพที่แต่งได้ง่ายและรวดเร็ว", img: "https://www.akerufeed.com/wp-content/uploads/2019/11/9-9-533x800.jpg" },
    { title: "เมคอัพที่โดดเด่นทันสมัย", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmIdhErLcIFMbWbUkCg2XgrkD1P0nU9JfY1xEZ32Jaxg&s=10" },
  ];

  return (
    <div>
      <Navbar />
      <Topbar />

                     {/* Hero Section */}
                    <section className="relative w-full max-w-7xl mx-auto h-[400px] mt-10 overflow-hidden rounded-2xl bg-gradient-to-r from-[#4b2c6a] to-[#7d3c98]"> 
                
                <div className="flex h-full items-center px-8">
                    {/* ฝั่งข้อความด้านซ้าย */}
                    <div className="w-1/2 text-white">
                    <h2 className="text-5xl font-bold mb-6 leading-tight">
                       พวกเราคือ WebSite <br/> ขายผลิตภัณฑ์ความงาม
                    </h2>
                    
                    </div>

                    {/* ฝั่งรูปภาพด้านขวา */}
                    <div className="w-1/2 h-full">
                    <img 
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkRgmFcjZBbyOEX5T7iDinXJ_wieJv3lqUwkMLxUfb5w&s=10" 
                        alt=" Model" 
                        className="w-full h-full object-cover object-center"
                    />
                    </div>
                </div>
                </section>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-4">สิ่งที่เราเชื่อมั่น</h2>
          <div className="w-full h-px bg-gray-300"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {items.map((item, index) => (
            <div key={index} className="relative w-full aspect-[3/4] overflow-hidden group">
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-white font-bold text-lg leading-tight">
                  {item.title}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="w-full h-px bg-gray-300 mt-12"></div>
      </div>

          <Footer />
    </div>
  );
};

export default About;