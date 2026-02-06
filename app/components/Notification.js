'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle, Info, ShoppingCart, Loader2, Sparkles, AlertTriangle, CheckCheck } from 'lucide-react';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  cart: ShoppingCart,
  warning: AlertTriangle,
  loading: Loader2
};

export default function Notification({ 
  message, 
  type = 'info', 
  onClose, 
  duration = 3000,
  title,
  action,
  showProgress = false,
  progress = 0 
}) {
  const Icon = icons[type] || Info;
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    setIsVisible(true);
    
    if (duration && type !== 'loading') {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(), 300); // Allow exit animation
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose, type]);

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-green-100';
      case 'error':
        return 'bg-gradient-to-r from-red-50 to-rose-50 border-red-200 shadow-red-100';
      case 'warning':
        return 'bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-amber-100';
      case 'cart':
        return 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-blue-100';
      case 'loading':
        return 'bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 shadow-purple-100';
      default:
        return 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200 shadow-blue-100';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-amber-800';
      case 'cart':
        return 'text-blue-800';
      case 'loading':
        return 'text-purple-800';
      default:
        return 'text-blue-800';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500';
      case 'error':
        return 'text-red-500';
      case 'warning':
        return 'text-amber-500';
      case 'cart':
        return 'text-blue-500';
      case 'loading':
        return 'text-purple-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <div 
      className={`fixed top-4 right-4 z-50 max-w-sm w-full shadow-2xl rounded-2xl border ${getBgColor()} transition-all duration-500 transform ${
        isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      }`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className={`flex-shrink-0 ${getIconColor()} relative`}>
            <Icon className="h-6 w-6" />
            {type === 'success' && (
              <div className="absolute -top-1 -right-1">
                <CheckCheck className="h-3 w-3 text-green-600" />
              </div>
            )}
            {type === 'loading' && (
              <div className="absolute inset-0 animate-spin">
                <Icon className="h-6 w-6" />
              </div>
            )}
          </div>
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className={`text-sm font-bold ${getTextColor()} mb-1`}>
                {title}
              </p>
            )}
            <p className={`text-sm ${getTextColor()} leading-relaxed`}>
              {message}
            </p>
            {showProgress && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getIconColor().replace('text-', 'bg-')}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
            {action && (
              <div className="mt-3">
                <button
                  onClick={action.onClick}
                  className={`text-sm font-medium px-3 py-1.5 rounded-lg border ${getIconColor().replace('text-', 'border-')} ${getTextColor()} hover:opacity-80 transition-all`}
                >
                  {action.label}
                </button>
              </div>
            )}
          </div>
          <div className="ml-4 flex-shrink-0">
            <button
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => onClose(), 300);
              }}
              className={`inline-flex ${getTextColor()} hover:opacity-70 focus:outline-none transition-all p-1 rounded-lg hover:bg-gray-100`}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
