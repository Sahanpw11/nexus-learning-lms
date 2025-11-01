import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon, 
  XCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const ToastContext = createContext();

/**
 * Toast Hook
 * Use this hook to show toast notifications
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

/**
 * Toast Provider Component
 * Wrap your app with this to enable toast notifications
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast,
    };

    setToasts((prev) => [...prev, newToast]);    // Auto remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
      }, newToast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback((message, options = {}) => {
    return addToast({ ...options, message, type: 'success' });
  }, [addToast]);

  const showError = useCallback((message, options = {}) => {
    return addToast({ ...options, message, type: 'error' });
  }, [addToast]);

  const showWarning = useCallback((message, options = {}) => {
    return addToast({ ...options, message, type: 'warning' });
  }, [addToast]);

  const showInfo = useCallback((message, options = {}) => {
    return addToast({ ...options, message, type: 'info' });
  }, [addToast]);

  const value = {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

/**
 * Toast Container Component
 * Renders the toast notifications
 */
const ToastContainer = ({ toasts, removeToast }) => {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

/**
 * Individual Toast Component
 */
const Toast = ({ toast, onClose }) => {
  const getToastStyles = () => {
    const baseStyles = "glass-card rounded-xl p-4 shadow-lg transform transition-all duration-300 animate-slide-in-right max-w-sm";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} border-l-4 border-green-500`;
      case 'error':
        return `${baseStyles} border-l-4 border-red-500`;
      case 'warning':
        return `${baseStyles} border-l-4 border-yellow-500`;
      case 'info':
      default:
        return `${baseStyles} border-l-4 border-blue-500`;
    }
  };

  const getIcon = () => {
    const iconStyles = "h-5 w-5 flex-shrink-0";
    
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className={`${iconStyles} text-green-500`} />;
      case 'error':
        return <XCircleIcon className={`${iconStyles} text-red-500`} />;
      case 'warning':
        return <ExclamationTriangleIcon className={`${iconStyles} text-yellow-500`} />;
      case 'info':
      default:
        return <InformationCircleIcon className={`${iconStyles} text-blue-500`} />;
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h4 className="text-sm font-medium text-gray-800 mb-1">
              {toast.title}
            </h4>
          )}
          <p className="text-sm text-gray-600">
            {toast.message}
          </p>
        </div>

        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          aria-label="Close notification"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Progress bar for timed toasts */}
      {toast.duration > 0 && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
          <div 
            className="bg-orange-500 h-1 rounded-full animate-toast-progress"
            style={{ animationDuration: `${toast.duration}ms` }}
          />
        </div>
      )}
    </div>
  );
};

export default ToastProvider;
