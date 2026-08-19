// Currency configuration – Indian Rupee
export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

/**
 * Format a number as Indian Rupees with proper Indian number formatting.
 * e.g. 7499 → ₹7,499  |  124999 → ₹1,24,999
 */
export const formatPrice = (amount: number): string => {
  return `${CURRENCY_SYMBOL}${amount.toLocaleString('en-IN')}`;
};
