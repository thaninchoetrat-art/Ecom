import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { CartContext } from "../cart/CartContext";
import CheckoutAddressForm from "./CheckoutAddressForm";
import CheckoutPaymentMethod from "./CheckoutPaymentMethod";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import PromptPayQrModal from "./PromptPayQrModal";
import {
  createOrder,
  getCheckoutUserId,
  checkStockAvailability,
  deductStockAfterOrder,
} from "./checkoutService";

const FREE_SHIPPING_THRESHOLD = 499;
const STANDARD_SHIPPING_FEE = 50;

// 🟢 ต้องใช้คีย์เดียวกับหน้าโปรไฟล์ (profileAddress.jsx) ที่แยกตามอีเมลบัญชีแล้ว
// ไม่งั้น checkout จะไปอ่านคีย์กลางเก่าที่ไม่มีใครเขียนแล้ว ทำให้ที่อยู่ไม่ขึ้นมาให้อัตโนมัติ
function getAddressStorageKey() {
  const email = localStorage.getItem("local_user_email");
  return email ? `user_profile_address_${email}` : "user_profile_address_guest";
}

function loadSavedAddress() {
  try {
    const saved = localStorage.getItem(getAddressStorageKey());
    return saved
      ? JSON.parse(saved)
      : { receiverName: "", phone: "", detail: "", province: "", district: "", postalCode: "" };
  } catch {
    return { receiverName: "", phone: "", detail: "", province: "", district: "", postalCode: "" };
  }
}

// จำข้อมูลบัตรที่ใช้สั่งซื้อสำเร็จล่าสุด เพื่อไม่ต้องกรอกใหม่ทุกครั้ง
// หมายเหตุ: ไม่จำ CVV เด็ดขาด เพราะเป็นข้อมูลที่ไม่ควรถูกเก็บไว้หลังทำรายการ
const SAVED_CARD_KEY = "checkout_saved_card";

function loadSavedCard() {
  try {
    const saved = localStorage.getItem(SAVED_CARD_KEY);
    return saved
      ? { ...JSON.parse(saved), cvv: "" }
      : { holderName: "", cardNumber: "", expiry: "", cvv: "" };
  } catch {
    return { holderName: "", cardNumber: "", expiry: "", cvv: "" };
  }
}

function saveCardForNextTime(cardInfo) {
  try {
    const { holderName, cardNumber, expiry } = cardInfo;
    localStorage.setItem(SAVED_CARD_KEY, JSON.stringify({ holderName, cardNumber, expiry }));
  } catch {
    // เก็บไม่สำเร็จก็ไม่เป็นไร ไม่กระทบการสั่งซื้อ
  }
}

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart, updateQuantity, removeItem } = useContext(CartContext) || {
    items: [],
    totalPrice: 0,
  };

  const [address, setAddress] = useState(loadSavedAddress);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [cardInfo, setCardInfo] = useState(loadSavedCard);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);

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
      const cardDigits = cardInfo.cardNumber.replace(/\s/g, "");
      if (
        !cardInfo.holderName.trim() ||
        cardDigits.length < 12 ||
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

  // ทำรายการสั่งซื้อจริง (สร้างออเดอร์ ตัดสต็อก เคลียร์ตะกร้า แล้วไปหน้าสำเร็จ)
  const finalizeOrder = async () => {
    setSubmitting(true);
    setError("");

    // ตรวจสอบสต็อกจริงอีกครั้งก่อนยืนยันคำสั่งซื้อ ป้องกันกรณีสินค้าหมด/เหลือไม่พอ
    const shortages = checkStockAvailability(items);
    if (shortages.length > 0) {
      shortages.forEach((shortage) => {
        if (!updateQuantity || !removeItem) return;
        if (shortage.available <= 0) {
          removeItem(shortage.productId);
        } else {
          updateQuantity(shortage.productId, shortage.available);
        }
      });

      const detail = shortages
        .map((s) =>
          s.available <= 0
            ? `${s.name} สินค้าหมดแล้ว`
            : `${s.name} เหลือเพียง ${s.available} ชิ้น`
        )
        .join(", ");

      setError(`สต็อกสินค้าไม่พอ: ${detail} กรุณาตรวจสอบตะกร้าสินค้าอีกครั้ง`);
      setSubmitting(false);
      setShowQrModal(false);
      return;
    }

    try {
      const payload = {
        userId: getCheckoutUserId(),
        // 🟢 บันทึกสิทธิ์ของคนที่กดสั่งซื้อไว้ด้วย เพื่อแยกในหน้าแอดมินว่าออเดอร์นี้ลูกค้าสั่งเอง
        // หรือ Staff/Admin เป็นคนสั่งเอง (login ด้วยบัญชี Staff/Admin แล้วมาซื้อของ)
        placedByRole: localStorage.getItem("user_role") || "Customer",
        items: items.map((item) => ({
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          // 🟢 ส่งที่มาของสินค้า/ผู้ขายไปด้วย เผื่อเป็นสินค้าที่ Customer โพสต์ขายเอง
          // ให้หน้าจัดการคำสั่งซื้อของแอดมินโชว์ได้ว่าซื้อจากใคร
          source: item.source || "company",
          sellerEmail: item.sellerEmail || "",
          sellerName: item.sellerName || "",
        })),
        shippingAddress: address,
        paymentMethod,
        // เพื่อความปลอดภัย ส่งเฉพาะเลข 4 ตัวท้ายของบัตรเท่านั้น ไม่ส่งเลขบัตรเต็ม
        ...(paymentMethod === "card"
          ? { cardLast4: cardInfo.cardNumber.replace(/\s/g, "").slice(-4) }
          : {}),
      };

      const { order } = await createOrder(payload);
      if (paymentMethod === "card") {
        saveCardForNextTime(cardInfo);
      }
      deductStockAfterOrder(payload.items, order.orderId);
      clearCart();
      setShowQrModal(false);
      navigate(`/order-success/${order.orderId}`);
    } catch (err) {
      setError(err.message || "ไม่สามารถทำรายการได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setSubmitting(false);
    }
  };

  // กด "ยืนยันสั่งซื้อ" — ถ้าเป็นพร้อมเพย์ให้เปิด QR ก่อน ยังไม่สร้างออเดอร์ทันที
  const handleSubmit = async () => {
    if (!validateBeforeSubmit()) return;

    if (paymentMethod === "promptpay") {
      setShowQrModal(true);
      return;
    }

    await finalizeOrder();
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

      <PromptPayQrModal
        open={showQrModal}
        submitting={submitting}
        onConfirmPaid={finalizeOrder}
        onClose={() => setShowQrModal(false)}
      />
    </div>
  );
}
