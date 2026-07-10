import {
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiMapPin,
  FiPhone,
  FiMail,
} from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="w-full bg-[#fafafa] border-t border-gray-200 relative">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">

        <div className="grid gap-12 lg:grid-cols-4">

          {/* Logo */}
          <div>
            <h2 className="text-5xl font-black text-pink-600 tracking-tight">
              5 Paul
            </h2>
            <p className="mt-6 text-sm leading-7 text-gray-600">
              ร้านจำหน่ายเครื่องสำอาง สกินแคร์ และผลิตภัณฑ์ความงาม
              พร้อมโปรโมชั่นสุดพิเศษตลอดทั้งปี
            </p>
            <div className="mt-8 flex gap-4">
              <button className="h-10 w-10 rounded-full border border-gray-300 hover:bg-pink-600 hover:text-white transition flex items-center justify-center">
                <FiFacebook />
              </button>
              <button className="h-10 w-10 rounded-full border border-gray-300 hover:bg-pink-600 hover:text-white transition flex items-center justify-center">
                <FiInstagram />
              </button>
              <button className="h-10 w-10 rounded-full border border-gray-300 hover:bg-pink-600 hover:text-white transition flex items-center justify-center">
                <FiYoutube />
              </button>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-bold mb-5">หมวดหมู่สินค้า</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="hover:text-pink-600 cursor-pointer">Makeup</li>
              <li className="hover:text-pink-600 cursor-pointer">Skincare</li>
              <li className="hover:text-pink-600 cursor-pointer">Body Care</li>
              <li className="hover:text-pink-600 cursor-pointer">Hair Care</li>
              <li className="hover:text-pink-600 cursor-pointer">Perfume</li>
            </ul>
          </div>

          {/* Service */}
          <div>
            <h3 className="text-lg font-bold mb-5">บริการลูกค้า</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="hover:text-pink-600 cursor-pointer">วิธีสั่งซื้อ</li>
              <li className="hover:text-pink-600 cursor-pointer">การชำระเงิน</li>
              <li className="hover:text-pink-600 cursor-pointer">การจัดส่ง</li>
              <li className="hover:text-pink-600 cursor-pointer">คืนสินค้า</li>
              <li className="hover:text-pink-600 cursor-pointer">ติดต่อเรา</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-5">ติดต่อเรา</h3>
            <div className="space-y-4">
              <div className="flex gap-3 items-center">
                <FiMapPin className="text-pink-600 flex-shrink-0" />
                <span className="text-gray-600">Bangkok, Thailand</span>
              </div>
              <div className="flex gap-3 items-center">
                <FiPhone className="text-pink-600 flex-shrink-0" />
                <span className="text-gray-600">02-000-0000</span>
              </div>
              <div className="flex gap-3 items-center">
                <FiMail className="text-pink-600 flex-shrink-0" />
                <span className="text-gray-600">support@karmart.com</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* แถบลิขสิทธิ์ด้านล่างสุด */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col lg:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © 2026 KARMART. All Rights Reserved.
          </p>
          <div className="flex gap-8 text-sm text-gray-500">
            <span className="hover:text-pink-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-pink-600 cursor-pointer">Terms & Conditions</span>
            <span className="hover:text-pink-600 cursor-pointer">Cookies</span>
          </div>
        </div>
      </div>

    </footer>
  );
}