// Utility functions for formatting

/**
 * Format amount as Indian currency
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format number with Indian numbering system (lakhs, crores)
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Format date as DD/MM/YYYY
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Format date as input value (YYYY-MM-DD)
 */
export const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
};

/**
 * Get current financial year (April-March)
 */
export const getCurrentFinancialYear = () => {
  const today = new Date();
  const month = today.getMonth(); // 0-indexed
  const year = today.getFullYear();
  
  if (month >= 3) { // April onwards (month 3 = April)
    return `${year}-${year + 1}`;
  } else {
    return `${year - 1}-${year}`;
  }
};

/**
 * Generate voucher number
 */
export const generateVoucherNumber = (prefix, existingVouchers, financialYear) => {
  const fy = financialYear.replace('-', '-');
  const fyVouchers = existingVouchers.filter(v => 
    v.voucherNo && v.voucherNo.includes(fy) && v.voucherNo.startsWith(prefix)
  );
  const nextNum = fyVouchers.length + 1;
  return `${prefix}/${fy}/${String(nextNum).padStart(4, '0')}`;
};

/**
 * Calculate GST breakdown
 */
export const calculateGST = (amount, rate, isInterState = false) => {
  const gstAmount = (amount * rate) / 100;
  
  if (isInterState) {
    return {
      igst: gstAmount,
      cgst: 0,
      sgst: 0,
      total: amount + gstAmount
    };
  } else {
    const halfGst = gstAmount / 2;
    return {
      igst: 0,
      cgst: halfGst,
      sgst: halfGst,
      total: amount + gstAmount
    };
  }
};

/**
 * Generate UUID
 */
export const generateId = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
