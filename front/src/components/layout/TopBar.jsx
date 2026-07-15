const TopBar = () => {
  return (
    /* 🟢 จุดสำคัญ: บังคับให้แถบสีชมพูดีดเต็มจอ 100% ทะลุกรอบ CSS อื่นที่มาทับ */
    <div className="!w-screen !max-w-none bg-pink-500 text-white text-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <span>✨ ส่งฟรีเมื่อสั่งซื้อครบ 499 บาท</span>

       
      </div>
    </div>
  );
};

export default TopBar;