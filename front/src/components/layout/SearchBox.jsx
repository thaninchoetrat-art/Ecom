import { FiSearch } from "react-icons/fi";

const SearchBox = () => {
  return (
    // เพิ่ม w-full และ flex justify-center ครอบไว้ด้านนอกสุด
    <div className="w-full flex justify-center my-4 px-4"> 
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          className="w-full rounded-full border border-gray-300 py-3 pl-5 pr-14 outline-none transition focus:border-pink-500"
        />

        <button className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-pink-500 p-3 text-white hover:bg-pink-600">
          <FiSearch size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;