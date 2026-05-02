export const trackEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...params });
};

export const trackGAEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', eventName, params);
};

export const trackPixelEvent = (eventName, params = {}) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  if (params && Object.keys(params).length > 0) {
    window.fbq('track', eventName, params);
  } else {
    window.fbq('track', eventName);
  }
};
