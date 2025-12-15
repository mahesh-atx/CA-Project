// Accounting Calculation Functions
import { LEDGER_GROUPS } from '../constants';

/**
 * Validate voucher entries (Debit must equal Credit)
 */
export const validateVoucherBalance = (entries) => {
  const totalDr = entries
    .filter(e => e.type === 'Dr')
    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  
  const totalCr = entries
    .filter(e => e.type === 'Cr')
    .reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
  
  return {
    isBalanced: Math.abs(totalDr - totalCr) < 0.01, // Allow for floating point errors
    totalDr,
    totalCr,
    difference: Math.abs(totalDr - totalCr)
  };
};

/**
 * Calculate ledger balance from vouchers
 */
export const calculateLedgerBalance = (ledgerId, vouchers, openingBalance = 0, openingType = 'Dr') => {
  let drTotal = openingType === 'Dr' ? parseFloat(openingBalance) || 0 : 0;
  let crTotal = openingType === 'Cr' ? parseFloat(openingBalance) || 0 : 0;
  
  vouchers.forEach(voucher => {
    if (voucher.entries) {
      voucher.entries.forEach(entry => {
        if (entry.ledgerId === ledgerId) {
          if (entry.type === 'Dr') {
            drTotal += parseFloat(entry.amount) || 0;
          } else {
            crTotal += parseFloat(entry.amount) || 0;
          }
        }
      });
    }
  });
  
  const balance = Math.abs(drTotal - crTotal);
  const balanceType = drTotal >= crTotal ? 'Dr' : 'Cr';
  
  return {
    drTotal,
    crTotal,
    balance,
    balanceType
  };
};

/**
 * Generate Trial Balance
 */
export const generateTrialBalance = (ledgers, vouchers) => {
  const entries = [];
  let totalDr = 0;
  let totalCr = 0;
  
  ledgers.forEach(ledger => {
    const balance = calculateLedgerBalance(
      ledger.id, 
      vouchers, 
      ledger.openingBalance, 
      ledger.openingBalanceType
    );
    
    if (balance.balance > 0) {
      entries.push({
        ledgerId: ledger.id,
        ledgerName: ledger.name,
        group: ledger.group,
        drAmount: balance.balanceType === 'Dr' ? balance.balance : 0,
        crAmount: balance.balanceType === 'Cr' ? balance.balance : 0
      });
      
      if (balance.balanceType === 'Dr') {
        totalDr += balance.balance;
      } else {
        totalCr += balance.balance;
      }
    }
  });
  
  return {
    entries: entries.sort((a, b) => a.ledgerName.localeCompare(b.ledgerName)),
    totalDr,
    totalCr,
    isBalanced: Math.abs(totalDr - totalCr) < 0.01
  };
};

/**
 * Generate Profit & Loss Statement
 */
export const generateProfitLoss = (ledgers, vouchers) => {
  const incomeItems = [];
  const expenseItems = [];
  let totalIncome = 0;
  let totalExpenses = 0;
  
  ledgers.forEach(ledger => {
    const groupInfo = LEDGER_GROUPS[ledger.group];
    if (!groupInfo) return;
    
    const balance = calculateLedgerBalance(
      ledger.id, 
      vouchers, 
      ledger.openingBalance, 
      ledger.openingBalanceType
    );
    
    if (balance.balance === 0) return;
    
    if (groupInfo.type === 'Income') {
      incomeItems.push({
        name: ledger.name,
        group: ledger.group,
        amount: balance.balance
      });
      totalIncome += balance.balance;
    } else if (groupInfo.type === 'Expense') {
      expenseItems.push({
        name: ledger.name,
        group: ledger.group,
        amount: balance.balance
      });
      totalExpenses += balance.balance;
    }
  });
  
  return {
    incomeItems,
    expenseItems,
    totalIncome,
    totalExpenses,
    netProfit: totalIncome - totalExpenses
  };
};

/**
 * Generate Balance Sheet
 */
export const generateBalanceSheet = (ledgers, vouchers) => {
  const assets = [];
  const liabilities = [];
  const capital = [];
  let totalAssets = 0;
  let totalLiabilities = 0;
  let totalCapital = 0;
  
  // Get net profit from P&L
  const pl = generateProfitLoss(ledgers, vouchers);
  
  ledgers.forEach(ledger => {
    const groupInfo = LEDGER_GROUPS[ledger.group];
    if (!groupInfo) return;
    
    const balance = calculateLedgerBalance(
      ledger.id, 
      vouchers, 
      ledger.openingBalance, 
      ledger.openingBalanceType
    );
    
    if (balance.balance === 0) return;
    
    const item = {
      name: ledger.name,
      group: ledger.group,
      amount: balance.balance
    };
    
    if (groupInfo.type === 'Asset') {
      assets.push(item);
      totalAssets += balance.balance;
    } else if (groupInfo.type === 'Liability') {
      liabilities.push(item);
      totalLiabilities += balance.balance;
    } else if (groupInfo.type === 'Capital') {
      capital.push(item);
      totalCapital += balance.balance;
    }
  });
  
  // Add Net Profit to Capital side
  if (pl.netProfit !== 0) {
    capital.push({
      name: pl.netProfit >= 0 ? 'Net Profit' : 'Net Loss',
      group: 'Profit & Loss A/c',
      amount: Math.abs(pl.netProfit)
    });
    totalCapital += pl.netProfit;
  }
  
  return {
    assets,
    liabilities,
    capital,
    totalAssets,
    totalLiabilitiesAndCapital: totalLiabilities + totalCapital
  };
};

/**
 * Calculate GST Summary
 */
export const calculateGSTSummary = (vouchers, ledgers) => {
  let outputCGST = 0;
  let outputSGST = 0;
  let outputIGST = 0;
  let inputCGST = 0;
  let inputSGST = 0;
  let inputIGST = 0;
  
  // Find GST ledgers
  const gstLedgers = ledgers.filter(l => 
    l.name.toLowerCase().includes('cgst') || 
    l.name.toLowerCase().includes('sgst') || 
    l.name.toLowerCase().includes('igst')
  );
  
  gstLedgers.forEach(ledger => {
    const balance = calculateLedgerBalance(
      ledger.id, 
      vouchers, 
      ledger.openingBalance, 
      ledger.openingBalanceType
    );
    
    const name = ledger.name.toLowerCase();
    const isOutput = name.includes('output');
    const isInput = name.includes('input');
    
    if (name.includes('cgst')) {
      if (isOutput) outputCGST += balance.crTotal;
      if (isInput) inputCGST += balance.drTotal;
    } else if (name.includes('sgst')) {
      if (isOutput) outputSGST += balance.crTotal;
      if (isInput) inputSGST += balance.drTotal;
    } else if (name.includes('igst')) {
      if (isOutput) outputIGST += balance.crTotal;
      if (isInput) inputIGST += balance.drTotal;
    }
  });
  
  const totalOutput = outputCGST + outputSGST + outputIGST;
  const totalInput = inputCGST + inputSGST + inputIGST;
  
  return {
    outputCGST,
    outputSGST,
    outputIGST,
    inputCGST,
    inputSGST,
    inputIGST,
    totalOutput,
    totalInput,
    netPayable: totalOutput - totalInput
  };
};
