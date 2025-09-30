/**
 * Helper function to get backend URL without /api suffix
 * @returns {string} Backend URL without /api suffix
 */
export const getBackendUrlWithoutApi = () => {
  const backendUrl = import.meta.env.VITE_BACKEND_BASE_URL;
  return backendUrl.endsWith('/api') ? backendUrl.slice(0, -4) : backendUrl;
};

export const buildQueryStringByParams = (data) => {
  const queryParts = [];

  for (let i = 1; i <= 20; i++) {
    const key = `sub${i}`;
    const value = data[key];
    if (value !== null && value !== undefined && value !== '') {
      queryParts.push(`${key}=${value}`);
    }
  }

  const utmFields = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term'
  ];
  for (const key of utmFields) {
    const value = data[key];
    if (value !== null && value !== undefined && value !== '') {
      queryParts.push(`${key}=${value}`);
    }
  }

  return queryParts.length ? '?' + queryParts.join('&') : '';
};

export const addOrUpdateQueryParams = (queryString, paramsObj = {}) => {
  console.log(queryString);
  const qs = (queryString || '').replace(/^\?/, '');
  const params = new URLSearchParams(qs);

  for (const [key, value] of Object.entries(paramsObj)) {
    if (value == null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }

  const rawEntries = [];
  for (const [k, v] of params.entries()) {
    rawEntries.push(`${k}=${v}`);
  }

  return rawEntries.length ? `?${rawEntries.join('&')}` : '';
};
