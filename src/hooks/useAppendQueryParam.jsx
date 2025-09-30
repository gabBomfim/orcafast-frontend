import { useCallback } from 'react';

export const useAppendQueryParams = () =>
  useCallback((baseUrl, params) => {
    try {
      const url = new URL(baseUrl, window.location.origin);
      const searchParams = new URLSearchParams(url.search);

      Object.entries(params).forEach(([key, value]) => {
        searchParams.set(key, String(value));
      });

      url.search = searchParams.toString();
      return url.toString();
    } catch (err) {
      console.error('Invalid URL provided to useAppendQueryParams:', baseUrl);
      return baseUrl;
    }
  }, []);
