import React from 'react';

/**
 * Loading Spinner Component
 * A reusable loading component with different sizes and styles
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'orange', 
  text = 'Loading...',
  showText = false,
  className = '' 
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-4 h-4';
      case 'large':
        return 'w-8 h-8';
      case 'xl':
        return 'w-12 h-12';
      default:
        return 'w-6 h-6';
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case 'white':
        return 'border-white/30 border-t-white';
      case 'gray':
        return 'border-gray-300 border-t-gray-700';
      case 'blue':
        return 'border-blue-200 border-t-blue-500';
      default:
        return 'border-orange-200 border-t-orange-500';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`${getSizeClasses()} ${getColorClasses()} border-2 border-solid rounded-full animate-spin`}
        role="status"
        aria-label={text}
      />
      {showText && (
        <span className="mt-2 text-sm text-gray-600 font-medium">
          {text}
        </span>
      )}
      <span className="sr-only">{text}</span>
    </div>
  );
};

/**
 * Loading Overlay Component
 * Full-screen loading overlay for page transitions
 */
export const LoadingOverlay = ({ text = 'Loading...', isVisible = false }) => {
  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Loading"
    >
      <div className="glass-card rounded-2xl p-8 flex flex-col items-center">
        <LoadingSpinner size="large" showText text={text} />
      </div>
    </div>
  );
};

/**
 * Loading Button Component
 * Button with integrated loading state
 */
export const LoadingButton = ({ 
  children, 
  isLoading = false, 
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props 
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`relative ${className} ${isLoading ? 'loading' : ''}`}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="opacity-0">{children}</span>
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="small" color="white" />
          </div>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default LoadingSpinner;
