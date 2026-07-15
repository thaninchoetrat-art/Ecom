import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FiCheckCircle, FiClock, FiArrowLeft, FiTruck } from "react-icons/fi";
import { getOrder, confirmPayment } from "./checkoutService";

const PAYMENT_METHOD_LABEL = {
  cod: "เก็บเงินปลายทาง",
  bank_transfer: "โอนเงินผ่านธนาคาร",
  promptpay: "พร้อมเพย์ (PromptPay)",
  card: "บัตรเครดิต / เดบิต",
};

export default function OrderSuccess() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState("");

  const loadOrder = async () => {
    try {
      const { order: fetched } = await getOrder(orderId);
      setOrder(fetched);
    } catch (err) {
      setError(err.message || "ไม่พบคำสั่งซื้อนี้");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // --- ส่วนที่เพิ่มเข้ามาสำหรับการบันทึกข้อมูลลง localStorage ---
  useEffect(() => {
    if (order) {
      const existingOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
      // เช็คว่ามีออเดอร์นี้ใน list หรือยัง (เพื่อป้องกันการบันทึกซ้ำเวลา Refresh)
      const isExist = existingOrders.find(o => o.orderId === order.orderId);
      
      if (!isExist) {
        existingOrders.push(order);
        localStorage.setItem('myOrders', JSON.stringify(existingOrders));
      }
    }
  }, [order]);
  // --------------------------------------------------------

  const handleConfirmPayment = async () => {
    setConfirming(true);
    try {
      const { order: updated } = await confirmPayment(orderId);
      setOrder(updated);
      
      // อัปเดตข้อมูลใน localStorage หลังจากยืนยันการชำระเงิน
      const existingOrders = JSON.parse(localStorage.getItem('myOrders')) || [];
      const updatedOrders = existingOrders.map(o => o.orderId === updated.orderId ? updated : o);
      localStorage.setItem('myOrders', JSON.stringify(updatedOrders));
      
    } catch (err) {
      setError(err.message || "ยืนยันการชำระเงินไม่สำเร็จ");
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return <p className="py-24 text-center text-gray-400">กำลังโหลดข้อมูลคำสั่งซื้อ...</p>;
  }

  if (error && !order) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-dashed border-gray-200 bg-white py-24 text-center">
        <h2 className="text-xl font-bold text-gray-700">{error}</h2>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-pink-500 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-pink-600"
        >
          <FiArrowLeft />
          กลับหน้าแรก
        </Link>
      </div>
    );
  }

  const isAwaitingPayment = order.paymentStatus === "awaiting_payment";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
        {isAwaitingPayment ? (
          <FiClock size={56} className="mx-auto text-amber-400" />
        ) : (
          <FiCheckCircle size={56} className="mx-auto text-emerald-500" />
        )}

        <h1 className="mt-4 text-2xl font-black text-gray-800">
          {isAwaitingPayment ? "รอการยืนยันการชำระเงิน" : "สั่งซื้อสำเร็จ!"}
        </h1>
        <p className="mt-2 text-gray-400">
          หมายเลขคำสั่งซื้อของคุณคือ <span className="font-semibold text-gray-600">{order.orderId}</span>
        </p>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-500">
            {error}
          </div>
        )}

        {isAwaitingPayment && (
          <button
            onClick={handleConfirmPayment}
            disabled={confirming}
            className="mt-6 w-full rounded-xl bg-pink-500 py-3.5 font-bold text-white shadow-lg transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-200"
          >
            {confirming ? "กำลังยืนยัน..." : "แจ้งว่าชำระเงินแล้ว"}
          </button>
        )}

        <div className="mt-8 space-y-3 rounded-xl bg-gray-50 p-5 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">วิธีการชำระเงิน</span>
            <span className="font-semibold text-gray-700">
              {PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">สถานะการชำระเงิน</span>
            <span className="font-semibold text-gray-700">
              {order.paymentStatus === "paid" ? "ชำระเงินแล้ว" : "รอชำระเงิน"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">สถานะคำสั่งซื้อ</span>
            <span className="font-semibold text-gray-700">{order.status}</span>
          </div>
          <div className="my-2 border-t border-dashed border-gray-200" />
          <div className="flex justify-between">
            <span className="text-gray-500">ยอดสินค้า</span>
            <span>฿{order.subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">ค่าจัดส่ง</span>
            <span>{order.shippingFee === 0 ? "ฟรี" : `฿${order.shippingFee}`}</span>
          </div>
          <div className="flex justify-between text-base font-black text-pink-600">
            <span>ยอดชำระทั้งหมด</span>
            <span>฿{order.grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400">
          <FiTruck />
          จัดส่งไปที่: {order.shippingAddress?.detail}, {order.shippingAddress?.district},{" "}
          {order.shippingAddress?.province} {order.shippingAddress?.postalCode}
        </div>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-pink-500 hover:text-pink-600"
        >
          <FiArrowLeft />
          เลือกซื้อสินค้าต่อ
        </Link>
      </div>
    </div>
  );
}