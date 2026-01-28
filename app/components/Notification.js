'use client';

import { useEffect } from 'react';
import { CheckCircle, X, AlertCircle, Info, ShoppingCart } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  cart: ShoppingCart
};

export default function Notification({ message, type = 'info', onClose, duration = 3000 }) {
  const Icon = icons[type] || Info;
  
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'cart':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'cart':
        return 'text-blue-800';
      default:
        return 'text-blue-800';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-400';
      case 'error':
        return 'text-red-400';
      case 'cart':
        return 'text-blue-400';
      default:
        return 'text-blue-400';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm w-full shadow-lg rounded-lg border ${getBgColor()} transition-all duration-300 transform translate-x-0 opacity-100`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${getIconColor()}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className={`text-sm font-medium ${getTextColor()}`}>
              {message}
            </p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
