import { useState } from "react";
import { FiSearch } from "react-icons/fi";

// 🟢 เดิมคอมโพเนนต์นี้ไม่ได้รับ prop onSearch มาใช้เลย (แค่รับ () => {} เฉยๆ)
// พิมพ์ในช่องค้นหาที่หน้า Home เลยไม่ทำอะไรเลย เพราะไม่มีการเรียก onSearch ที่ ProductPage ส่งมาให้
const SearchBox = ({ onSearch }) => {
  const [value, setValue] = useState("");

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    onSearch?.(v); // 🟢 พิมพ์ปุ๊บกรองสินค้าปั๊บ (real-time)
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(value);
  };

  return (
    // เพิ่ม w-full และ flex justify-center ครอบไว้ด้านนอกสุด
    <div className="w-full flex justify-center my-4 px-4">
      <form onSubmit={handleSubmit} className="relative w-full max-w-xl">
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder="ค้นหาสินค้า..."
          className="w-full rounded-full border border-gray-300 py-3 pl-5 pr-14 outline-none transition focus:border-pink-500"
        />

        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-pink-500 p-3 text-white hover:bg-pink-600">
          <FiSearch size={18} />
        </button>
      </form>
    </div>
  );
};

export default SearchBox;
