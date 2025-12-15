// Bank Reconciliation Service
import { STORAGE_KEYS } from '../constants';

/**
 * Get bank transactions from vouchers
 */
export const getBankTransactions = (vouchers, ledgers, bankLedgerId, period = {}) => {
  const { startDate, endDate } = period;
  
  const bankLedger = ledgers.find(l => l.id === bankLedgerId);
  if (!bankLedger) return [];

  const transactions = [];

  vouchers.forEach(voucher => {
    // Date filter
    if (startDate && voucher.date < startDate) return;
    if (endDate && voucher.date > endDate) return;

    voucher.entries?.forEach(entry => {
      if (entry.ledgerId === bankLedgerId) {
        // Find contra entry
        const contraEntry = voucher.entries.find(e => e.ledgerId !== bankLedgerId);
        
        transactions.push({
          id: `${voucher.id}-${entry.ledgerId}`,
          voucherId: voucher.id,
          date: voucher.date,
          voucherNo: voucher.voucherNo,
          type: voucher.type,
          particulars: contraEntry?.ledgerName || voucher.narration || '-',
          debit: entry.type === 'Dr' ? entry.amount : 0,
          credit: entry.type === 'Cr' ? entry.amount : 0,
          chequeNo: voucher.chequeNo || '',
          chequeDate: voucher.chequeDate || '',
          isReconciled: voucher.isReconciled || false,
          reconcileDate: voucher.reconcileDate || null,
          narration: voucher.narration || ''
        });
      }
    });
  });

  // Sort by date
  transactions.sort((a, b) => a.date.localeCompare(b.date));

  return transactions;
};

/**
 * Calculate bank balance as per books
 */
export const calculateBookBalance = (transactions, openingBalance = 0, openingType = 'Dr') => {
  let balance = openingType === 'Dr' ? openingBalance : -openingBalance;
  
  transactions.forEach(t => {
    balance += t.debit - t.credit;
  });

  return {
    amount: Math.abs(balance),
    type: balance >= 0 ? 'Dr' : 'Cr'
  };
};

/**
 * Calculate bank balance as per bank statement (reconciled items only)
 */
export const calculateBankBalance = (transactions, openingBalance = 0, openingType = 'Dr') => {
  let balance = openingType === 'Dr' ? openingBalance : -openingBalance;
  
  transactions.filter(t => t.isReconciled).forEach(t => {
    balance += t.debit - t.credit;
  });

  return {
    amount: Math.abs(balance),
    type: balance >= 0 ? 'Dr' : 'Cr'
  };
};

/**
 * Get reconciliation summary
 */
export const getReconciliationSummary = (transactions, openingBalance, openingType) => {
  const bookBalance = calculateBookBalance(transactions, openingBalance, openingType);
  const bankBalance = calculateBankBalance(transactions, openingBalance, openingType);
  
  const unreconciledDeposits = transactions
    .filter(t => !t.isReconciled && t.debit > 0)
    .reduce((sum, t) => sum + t.debit, 0);
  
  const unreconciledPayments = transactions
    .filter(t => !t.isReconciled && t.credit > 0)
    .reduce((sum, t) => sum + t.credit, 0);

  return {
    bookBalance,
    bankBalance,
    unreconciledDeposits,
    unreconciledPayments,
    unreconciledCount: transactions.filter(t => !t.isReconciled).length,
    reconciledCount: transactions.filter(t => t.isReconciled).length
  };
};

/**
 * Save reconciliation status
 */
export const saveReconciliationStatus = (clientId, reconciliations) => {
  const key = `bank_recon_${clientId}`;
  localStorage.setItem(key, JSON.stringify(reconciliations));
};

export const getReconciliationStatus = (clientId) => {
  const key = `bank_recon_${clientId}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : {};
};
