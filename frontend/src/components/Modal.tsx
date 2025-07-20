import React from "react";

interface ModalProps {
  onClose: () => void;
  platform: string;
}

const Modal: React.FC<ModalProps> = ({ onClose, platform }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[320px] shadow-xl text-center">
        <h3 className="text-xl font-bold text-purple-700 mb-4">
          Success!
        </h3>
        <p className="text-gray-700 mb-6">
          Your post has been shared on <span className="font-semibold capitalize">{platform}</span>.
        </p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
