import { useCallback } from 'react';
import { toaster } from '../components/ui/toaster';
// import SaleToast from '../components/SaleToast';

export const useSaleToast = () => {
  const showSaleToast = useCallback((saleData = {}) => {
    toaster.create({
      title: '',
      description: '',
      duration: 5000,
      type: 'success',
      // render: () => SaleToast({ sale: saleData })
    });
  }, []);

  return { showSaleToast };
};
