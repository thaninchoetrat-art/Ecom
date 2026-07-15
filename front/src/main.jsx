import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

// นำเข้า CartProvider จาก Context ที่คุณสร้างไว้
import { CartProvider } from "./page/cart/CartContext";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        {/* ครอบแอปพลิเคชันด้วย CartProvider เพื่อให้ทุกหน้าเรียกใช้ตะกร้าสินค้าได้ */}
        <CartProvider>
            <BrowserRouter>
                <App/>
            </BrowserRouter>
        </CartProvider>
    </React.StrictMode>
);