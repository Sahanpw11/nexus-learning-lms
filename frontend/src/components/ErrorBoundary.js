import React from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the child component tree
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // You can also log the error to an error reporting service here
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#fcfcf7' }}>
          <div className="glass-card rounded-2xl p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <ExclamationTriangleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-light text-gray-800 mb-2">
                Something went wrong
              </h2>
              <p className="text-gray-600 text-sm">
                We're sorry, but something unexpected happened. Please try again.
              </p>
            </div>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg text-left">
                <details className="text-xs">
                  <summary className="font-medium text-red-800 cursor-pointer mb-2">
                    Error Details
                  </summary>
                  <pre className="text-red-700 whitespace-pre-wrap overflow-auto max-h-32">
                    {this.state.error.toString()}
                    {this.state.errorInfo.componentStack}
                  </pre>
                </details>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="btn-primary px-6 py-3 rounded-xl flex items-center justify-center space-x-2 w-full"
              >
                <ArrowPathIcon className="h-5 w-5" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="btn-secondary px-6 py-3 rounded-xl w-full text-gray-700"
              >
                Reload Page
              </button>
            </div>

            {/* Support Contact */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                If this problem persists, please contact{' '}
                <a 
                  href="mailto:support@reactorminds.com" 
                  className="text-orange-500 hover:text-orange-600"
                >
                  support@reactorminds.com
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Higher-order component to wrap components with error boundary
 */
export const withErrorBoundary = (Component, fallback) => {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
};

/**
 * Hook to handle errors in functional components
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = () => setError(null);

  const captureError = (error) => {
    console.error('Error captured:', error);
    setError(error);
  };

  // Throw error to be caught by error boundary
  if (error) {
    throw error;
  }

  return { captureError, resetError };
};

export default ErrorBoundary;
