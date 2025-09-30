import { useToast } from '@chakra-ui/react';

// Toast service for use outside of React components (like middleware)
class ToastService {
  constructor() {
    this.toastFunction = null;
  }

  setToastFunction(toastFunction) {
    this.toastFunction = toastFunction;
  }

  showToast(options) {
    if (this.toastFunction) {
      return this.toastFunction(options);
    }
    console.warn('Toast service not initialized. Make sure to use useToaster hook in your app.');
  }

  success(title, description) {
    return this.showToast({ title, description, status: 'success' });
  }

  error(title, description) {
    return this.showToast({ title, description, status: 'error' });
  }

  warning(title, description) {
    return this.showToast({ title, description, status: 'warning' });
  }

  info(title, description) {
    return this.showToast({ title, description, status: 'info' });
  }

  loading(title, description) {
    return this.showToast({ 
      title, 
      description, 
      status: 'loading', 
      duration: null,
      isClosable: false 
    });
  }

  // Legacy API compatibility
  create(options) {
    const { title, type } = options;
    const status = type === 'success' ? 'success' : 
                  type === 'error' ? 'error' : 
                  type === 'warning' ? 'warning' : 'info';
    
    return this.showToast({ title, status });
  }
}

// Create singleton instance
const toastService = new ToastService();

// Custom hook for managing toasts in React components
export const useToaster = () => {
  const toast = useToast();

  // Initialize the toast service with the actual toast function
  if (!toastService.toastFunction) {
    toastService.setToastFunction(toast);
  }

  const showToast = (options) => {
    const {
      title,
      description,
      status = 'info',
      duration = 5000,
      isClosable = true,
      position = 'top-end'
    } = options;

    return toast({
      title,
      description,
      status,
      duration,
      isClosable,
      position
    });
  };

  const success = (title, description) => 
    showToast({ title, description, status: 'success' });

  const error = (title, description) => 
    showToast({ title, description, status: 'error' });

  const warning = (title, description) => 
    showToast({ title, description, status: 'warning' });

  const info = (title, description) => 
    showToast({ title, description, status: 'info' });

  const loading = (title, description) => 
    showToast({ 
      title, 
      description, 
      status: 'loading', 
      duration: null,
      isClosable: false 
    });

  return {
    showToast,
    success,
    error,
    warning,
    info,
    loading,
    close: toast.close,
    closeAll: toast.closeAll
  };
};

// Export the toast service for use in middleware and other non-React contexts
export const toaster = toastService;
