

import React, { useEffect } from 'react';

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, children }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[color:var(--brand-panel)] rounded-2xl shadow-2xl shadow-black/50 w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 md:p-8 border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute -top-4 -right-4 text-gray-300 hover:text-white bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center transition-colors text-2xl font-bold border-2 border-gray-600 hover:border-[color:var(--brand-teal)]"
            aria-label="Close modal"
          >
            &times;
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;