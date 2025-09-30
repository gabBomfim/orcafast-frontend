export function formatCurrency(value, currency = 'BRL', locale = 'pt-BR') {
  if (value == null || isNaN(value)) return 'R$ 0,00';
  return Number(value).toLocaleString(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export function formatPercentage(value, locale = 'pt-BR') {
  if (value == null || isNaN(value)) return '';
  return `${Number(value).toLocaleString(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}%`;
}

export function formatNumber(value, locale = 'pt-BR') {
  if (value == null || isNaN(value)) return '0';
  return Number(value).toLocaleString(locale);
}
