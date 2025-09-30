import { useState, useEffect } from 'react';
import { useResource } from './useResource';

const useNotificationSettings = () => {
  const [settings, setSettings] = useState({
    sales_notifications_enabled: 0,
    sales_notifications_sound_enabled: 0,
  });

  const {
    records: notifications
  } = useResource({ 
    resource: 'Notifications', 
    autoFetch: true
  });

  useEffect(() => {
    if (notifications?.[0]) {
      setSettings({
        sales_notifications_enabled: notifications[0].sales_notifications_enabled || 0,
        sales_notifications_sound_enabled: notifications[0].sales_notifications_sound_enabled || 0,
      });
    }
  }, [notifications]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleBillingNotifications = () => {
    updateSetting('sales_notifications_enabled', !settings.sales_notifications_enabled);
  };

  const toggleNotificationSound = () => {
    updateSetting('sales_notifications_sound_enabled', !settings.sales_notifications_sound_enabled);
  };

  const setHasUnreadNotifications = (hasUnread) => {
    updateSetting('hasUnreadNotifications', hasUnread);
  };

  return {
    settings,
    toggleBillingNotifications,
    toggleNotificationSound,
    setHasUnreadNotifications,
    updateSetting,
  };
};

export default useNotificationSettings;
