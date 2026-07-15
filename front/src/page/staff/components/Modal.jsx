import { FiX } from "react-icons/fi";

const Modal = ({ open, onClose, title, width = "max-w-lg", children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center !p-4">
      <div className="absolute inset-0 bg-gray-900/40" onClick={onClose} />
      <div
        className={`relative z-10 max-h-[90vh] w-full ${width} overflow-y-auto rounded-2xl bg-white shadow-xl`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 !px-6 !py-4">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
          >
            <FiX size={18} />
          </button>
        </div>
        <div className="!p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
