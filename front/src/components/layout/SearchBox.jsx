import { FiSearch } from "react-icons/fi";

const SearchBox = ({ onSearch }) => {
  return (
    <div className="w-full flex justify-center px-4"> 
      <div className="relative w-full max-w-xl">
        <input
          type="text"
          placeholder="ค้นหาสินค้า..."
          onChange={(e) => onSearch(e.target.value)} // 🟢 ดึงค่าจาก input ส่งไปที่ callback
          className="w-full rounded-full border border-gray-300 py-3 pl-5 pr-14 outline-none transition focus:border-pink-500"
        />
        <button className="absolute cursor-pointer right-2 top-1/2 -translate-y-1/2 rounded-full bg-pink-500 p-3 text-white hover:bg-pink-600">
          <FiSearch size={18} />
        </button>
      </div>
    </div>
  );
};

export default SearchBox;