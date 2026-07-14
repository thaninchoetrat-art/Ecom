import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { CartContext } from "../cart/CartContext";
import CheckoutAddressForm from "./CheckoutAddressForm";
import CheckoutPaymentMethod from "./CheckoutPaymentMethod";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import { createOrder, getCheckoutUserId } from "./checkoutService";

const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING_FEE = 50;

function loadSavedAddress() {
  try {
    const saved = localStorage.getItem("user_profile_address");
    return saved
      ? JSON.parse(saved)
      : { receiverName: "", phone: "", detail: "", province: "", district: "", postalCode: "" };
  } catch {
    return { receiverName: "", phone: "", detail: "", province: "", district: "", postalCode: "" };
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useContext(CartContext) || {
    items: [],
    totalPrice: 0,
  };

  const [address, setAddress] = useState(loadSavedAddress);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardInfo, setCardInfo] = useState({ holderName: "", cardNumber: "", expiry: "", cvv: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const shippingFee = totalPrice > 0 && totalPrice < FREE_SHIPPING_THRESHOLD ? STANDARD_SHIPPING_FEE : 0;
  const grandTotal = totalPrice + shippingFee;

  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-gray-200 bg-white py-24 text-center">
        <h2 className="text-xl font-bold text-gray-700">ไม่มีสินค้าให้ชำระเงิน</h2>
        <p className="mt-2 text-gray-400">กรุณาเลือกสินค้าลงตะกร้าก่อนทำการสั่งซื้อ</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-500 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-pink-600"
        >
          <FiArrowLeft />
          กลับไปเลือกซื้อสินค้า
        </button>
      </div>
    );
  }

  const validateBeforeSubmit = () => {
    const requiredAddressFields = ["receiverName", "phone", "detail", "province", "district", "postalCode"];
    const missing = requiredAddressFields.some((field) => !String(address[field] || "").trim());
    if (missing) {
      setError("กรุณากรอกที่อยู่จัดส่งให้ครบถ้วน");
      return false;
    }

    if (paymentMethod === "card") {
      if (
        !cardInfo.holderName.trim() ||
        cardInfo.cardNumber.length < 12 ||
        !cardInfo.expiry.trim() ||
        cardInfo.cvv.length < 3
      ) {
        setError("กรุณากรอกข้อมูลบัตรให้ครบถ้วนและถูกต้อง");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleSubmit = async () => {
    if (!validateBeforeSubmit()) return;

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        userId: getCheckoutUserId(),
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: address,
        paymentMethod,
        // เพื่อความปลอดภัย ส่งเฉพาะเลข 4 ตัวท้ายของบัตรเท่านั้น ไม่ส่งเลขบัตรเต็ม
        ...(paymentMethod === "card"
          ? { cardLast4: cardInfo.cardNumber.slice(-4) }
          : {}),
      };

      const { order } = await createOrder(payload);
      clearCart();
      navigate(`/order-success/${order.orderId}`);
    } catch (err) {
      setError(err.message || "ไม่สามารถทำรายการได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="mb-6 text-2xl font-black text-gray-800">ยืนยันคำสั่งซื้อ</h1>

      {error && (
        <div className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <CheckoutAddressForm address={address} onChange={setAddress} />
          <CheckoutPaymentMethod
            selected={paymentMethod}
            onSelect={setPaymentMethod}
            cardInfo={cardInfo}
            onCardInfoChange={setCardInfo}
          />
        </div>

        <div className="lg:col-span-1">
          <CheckoutOrderSummary
            items={items}
            subtotal={totalPrice}
            shippingFee={shippingFee}
            grandTotal={grandTotal}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
