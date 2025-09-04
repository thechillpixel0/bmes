export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('en-US').format(number);
};

export const formatDate = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

export const formatDateTime = (date: string | Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const generateOrderNumber = (prefix = 'SO', sequence = 1): string => {
  return `${prefix}-${sequence.toString().padStart(6, '0')}`;
};

export const generateInvoiceNumber = (prefix = 'INV', sequence = 1): string => {
  return `${prefix}-${sequence.toString().padStart(6, '0')}`;
};

export const generateSKU = (category: string, sequence = 1): string => {
  const categoryCode = category.substring(0, 3).toUpperCase();
  return `${categoryCode}-${sequence.toString().padStart(4, '0')}`;
};