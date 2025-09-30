import { useCallback, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
// import SaleToast from '../components/SaleToast';
import { useResource } from './useResource';

export const useSaleToast = () => {
  const {
    records: notifications
  } = useResource({ 
    resource: 'Notifications', 
    autoFetch: true
  });

  const [settings, setSettings] = useState({
    sales_notifications_enabled: 0,
    sales_notifications_sound_enabled: 0,
  });

  useEffect(() => {
    if (notifications?.[0]) {
      const apiSettings = {
        sales_notifications_enabled: notifications[0].sales_notifications_enabled || 0,
        sales_notifications_sound_enabled: notifications[0].sales_notifications_sound_enabled || 0
      };
      setSettings(apiSettings);
    }
  }, [notifications]);

  const playNotificationSound = useCallback(() => {
    if (!settings.sales_notifications_sound_enabled || settings.sales_notifications_sound_enabled === 0) {
      return;
    }

    try {
      const audio = new Audio('/assets/sounds/new-notification.mp3');
      
      audio.volume = 0.5;
      
      audio.onended = () => {
        audio.remove();
      };
      
      audio.play().catch(() => {
        // Silenciar erros de reprodução
      });
    } catch (error) {
      // Silenciar erros de reprodução
    }
  }, [settings.sales_notifications_sound_enabled]);

  const showSaleToast = useCallback((saleData = {}) => {
    playNotificationSound();
    
    if (!settings.sales_notifications_enabled || settings.sales_notifications_enabled === 0) {
      return;
    }

    const toastContainer = document.createElement('div');
    toastContainer.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      pointer-events: none;
    `;
    document.body.appendChild(toastContainer);

    const root = createRoot(toastContainer);
    
    const ToastWrapper = () => {
      const handleRemove = () => {
        root.unmount();
        if (document.body.contains(toastContainer)) {
          document.body.removeChild(toastContainer);
        }
      };

      setTimeout(handleRemove, 5000);

      return (
        <div style={{ pointerEvents: 'auto' }}>
          {/* <SaleToast 
            amount={saleData.amount || 0}
            currency={saleData.currency || 'BRL'}
            campaignName={saleData.campaign_name || 'Campanha'}
            timestamp={saleData.timestamp || new Date().toISOString()}
          /> */}
        </div>
      );
    };

    root.render(<ToastWrapper />);
  }, [playNotificationSound, settings.sales_notifications_enabled]);

  return { showSaleToast };
};
