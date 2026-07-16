import React, { useEffect, useRef, useState } from "react";
import { BsQrCode } from "react-icons/bs";
import { FiX } from "react-icons/fi";

const QR_EXPIRE_SECONDS = 10 * 60; // QR code หมดอายุใน 10 นาที

function formatCountdown(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

// Modal แสดง QR PromptPay หลังจากลูกค้ากด "ยืนยันสั่งซื้อ" แล้วเท่านั้น
export default function PromptPayQrModal({ open, onConfirmPaid, onClose, submitting }) {
  const [secondsLeft, setSecondsLeft] = useState(QR_EXPIRE_SECONDS);
  const [expired, setExpired] = useState(false);
  const intervalRef = useRef(null);

  const startCountdown = () => {
    clearInterval(intervalRef.current);
    setSecondsLeft(QR_EXPIRE_SECONDS);
    setExpired(false);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          setExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    if (open) {
      startCountdown();
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
          aria-label="ปิด"
        >
          <FiX size={20} />
        </button>

        <h3 className="text-center text-lg font-bold text-gray-800">
          สแกนจ่ายด้วยพร้อมเพย์
        </h3>

        <div className="mt-5 flex flex-col items-center gap-3">
          {!expired ? (
            <>
              <div className="flex h-52 w-52 items-center justify-center overflow-hidden rounded-xl border-2 border-gray-200 bg-white p-2">
                <img
                  src="/promptpay-qr.png"
                  alt="PromptPay QR Code"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.nextSibling.style.display = "flex";
                  }}
                />
                <div className="hidden h-full w-full items-center justify-center">
                  <BsQrCode size={72} className="text-gray-400" />
                </div>
              </div>
              <p className="text-xs text-gray-400">สแกนเพื่อชำระผ่านพร้อมเพย์</p>
              <p className="text-sm font-semibold text-pink-500">
                หมดอายุใน {formatCountdown(secondsLeft)} นาที
              </p>

              <button
                type="button"
                onClick={onConfirmPaid}
                disabled={submitting}
                className="mt-2 w-full rounded-xl bg-pink-500 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
              >
                {submitting ? "กำลังดำเนินการ..." : "ชำระเงินเรียบร้อยแล้ว"}
              </button>
            </>
          ) : (
            <>
              <div className="flex h-52 w-52 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 bg-white p-2 text-center">
                <BsQrCode size={48} className="text-gray-300" />
                <p className="px-2 text-xs text-gray-400">QR Code หมดเวลาแล้ว</p>
              </div>
              <button
                type="button"
                onClick={startCountdown}
                className="mt-2 w-full rounded-full bg-pink-500 py-2.5 text-sm font-semibold text-white transition hover:bg-pink-600"
              >
                สร้าง QR Code ใหม่
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
