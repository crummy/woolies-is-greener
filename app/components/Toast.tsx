import { useState, useEffect } from 'react';

type ToastProps = {
  message: string;
  type: 'success' | 'error' | 'info';
  show: boolean;
  onClose: () => void;
};

export function Toast({ message, type, show, onClose }: ToastProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Auto-close after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) {
    return null;
  }

  let bgColor = 'bg-gray-700'; // Default/info
  if (type === 'success') {
    bgColor = 'bg-green-500';
  }
  // Add more types like error if needed
  // else if (type === 'error') {
  //   bgColor = 'bg-red-500';
  // }

  return (
    <div
      className={`fixed bottom-5 right-5 ${bgColor} rounded px-4 py-2 text-white shadow-lg transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
      role="alert"
    >
      {message}
      <button onClick={onClose} className="ml-4 font-bold">
        X
      </button>
    </div>
  );
}
