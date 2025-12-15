// Sample Data Generator for Testing
// Run this from the Dashboard or Settings to populate test data

export const SAMPLE_CLIENT = {
  id: 'sample_client_001',
  name: 'ABC Industries Pvt Ltd',
  gstin: '27AABCU9603R1ZM',
  pan: 'AABCU9603R',
  email: 'accounts@abcindustries.com',
  phone: '9876543210',
  address: '123, Industrial Area, Mumbai - 400001',
  state: 'Maharashtra',
  stateCode: '27',
  group: 'Manufacturing',
  status: 'Active',
  financialYearStart: '2024-04-01',
  booksFrom: '2024-04-01'
};

export const SAMPLE_LEDGERS = [
  // Bank & Cash
  { id: 'led_hdfc', name: 'HDFC Bank - Current A/c', group: 'Current Assets', subGroup: 'Bank Accounts', openingBalance: 500000, openingBalanceType: 'Dr' },
  { id: 'led_cash', name: 'Cash in Hand', group: 'Current Assets', subGroup: 'Cash-in-hand', openingBalance: 50000, openingBalanceType: 'Dr' },
  
  // Income
  { id: 'led_sales', name: 'Sales Account', group: 'Direct Income', subGroup: 'Sales Accounts', openingBalance: 0, openingBalanceType: 'Cr' },
  { id: 'led_service', name: 'Service Income', group: 'Indirect Income', subGroup: '', openingBalance: 0, openingBalanceType: 'Cr' },
  
  // Expenses
  { id: 'led_purchase', name: 'Purchase Account', group: 'Direct Expenses', subGroup: 'Purchase Accounts', openingBalance: 0, openingBalanceType: 'Dr' },
  { id: 'led_salary', name: 'Salary & Wages', group: 'Indirect Expenses', subGroup: '', openingBalance: 0, openingBalanceType: 'Dr' },
  { id: 'led_rent', name: 'Rent Expense', group: 'Indirect Expenses', subGroup: '', openingBalance: 0, openingBalanceType: 'Dr' },
  { id: 'led_electricity', name: 'Electricity Charges', group: 'Indirect Expenses', subGroup: '', openingBalance: 0, openingBalanceType: 'Dr' },
  { id: 'led_telephone', name: 'Telephone & Internet', group: 'Indirect Expenses', subGroup: '', openingBalance: 0, openingBalanceType: 'Dr' },
  
  // GST Ledgers
  { id: 'led_cgst_out', name: 'CGST Output', group: 'Current Liabilities', subGroup: 'Duties & Taxes', openingBalance: 0, openingBalanceType: 'Cr' },
  { id: 'led_sgst_out', name: 'SGST Output', group: 'Current Liabilities', subGroup: 'Duties & Taxes', openingBalance: 0, openingBalanceType: 'Cr' },
  { id: 'led_igst_out', name: 'IGST Output', group: 'Current Liabilities', subGroup: 'Duties & Taxes', openingBalance: 0, openingBalanceType: 'Cr' },
  { id: 'led_cgst_in', name: 'CGST Input', group: 'Current Assets', subGroup: 'Loans & Advances', openingBalance: 0, openingBalanceType: 'Dr' },
  { id: 'led_sgst_in', name: 'SGST Input', group: 'Current Assets', subGroup: 'Loans & Advances', openingBalance: 0, openingBalanceType: 'Dr' },
  { id: 'led_igst_in', name: 'IGST Input', group: 'Current Assets', subGroup: 'Loans & Advances', openingBalance: 0, openingBalanceType: 'Dr' },
  { id: 'led_tds', name: 'TDS Payable', group: 'Current Liabilities', subGroup: 'Duties & Taxes', openingBalance: 0, openingBalanceType: 'Cr' },
  
  // Debtors & Creditors
  { id: 'led_deb_xyz', name: 'XYZ Traders (Debtor)', group: 'Current Assets', subGroup: 'Sundry Debtors', gstin: '27AABCT1234R1ZQ', openingBalance: 0, openingBalanceType: 'Dr' },
  { id: 'led_deb_pqr', name: 'PQR Enterprises (Debtor)', group: 'Current Assets', subGroup: 'Sundry Debtors', gstin: '27AABCP5678R1ZP', openingBalance: 0, openingBalanceType: 'Dr' },
  { id: 'led_cred_sup1', name: 'Steel Suppliers Ltd (Creditor)', group: 'Current Liabilities', subGroup: 'Sundry Creditors', gstin: '27AABCS9012R1ZN', openingBalance: 0, openingBalanceType: 'Cr' },
  { id: 'led_cred_sup2', name: 'Raw Material Co (Creditor)', group: 'Current Liabilities', subGroup: 'Sundry Creditors', gstin: '27AABCR3456R1ZM', openingBalance: 0, openingBalanceType: 'Cr' },
  
  // Fixed Assets
  { id: 'led_machinery', name: 'Plant & Machinery', group: 'Fixed Assets', subGroup: '', openingBalance: 1500000, openingBalanceType: 'Dr' },
  { id: 'led_furniture', name: 'Furniture & Fixtures', group: 'Fixed Assets', subGroup: '', openingBalance: 200000, openingBalanceType: 'Dr' },
  
  // Capital
  { id: 'led_capital', name: 'Capital Account', group: 'Capital Account', subGroup: '', openingBalance: 2000000, openingBalanceType: 'Cr' },
];

export const SAMPLE_VOUCHERS = [
  // December 2024 Transactions
  {
    id: 'vch_001', voucherNo: 'PUR/001', type: 'purchase', date: '2024-12-01',
    entries: [
      { ledgerId: 'led_purchase', ledgerName: 'Purchase Account', amount: 100000, type: 'Dr' },
      { ledgerId: 'led_cgst_in', ledgerName: 'CGST Input', amount: 9000, type: 'Dr' },
      { ledgerId: 'led_sgst_in', ledgerName: 'SGST Input', amount: 9000, type: 'Dr' },
      { ledgerId: 'led_cred_sup1', ledgerName: 'Steel Suppliers Ltd (Creditor)', amount: 118000, type: 'Cr' }
    ],
    partyLedgerId: 'led_cred_sup1', narration: 'Purchase of steel rods as per Invoice #SS/2024/001'
  },
  {
    id: 'vch_002', voucherNo: 'SAL/001', type: 'sales', date: '2024-12-05',
    entries: [
      { ledgerId: 'led_deb_xyz', ledgerName: 'XYZ Traders (Debtor)', amount: 236000, type: 'Dr' },
      { ledgerId: 'led_sales', ledgerName: 'Sales Account', amount: 200000, type: 'Cr' },
      { ledgerId: 'led_cgst_out', ledgerName: 'CGST Output', amount: 18000, type: 'Cr' },
      { ledgerId: 'led_sgst_out', ledgerName: 'SGST Output', amount: 18000, type: 'Cr' }
    ],
    partyLedgerId: 'led_deb_xyz', narration: 'Sale of finished goods to XYZ Traders'
  },
  {
    id: 'vch_003', voucherNo: 'RCT/001', type: 'receipt', date: '2024-12-10',
    entries: [
      { ledgerId: 'led_hdfc', ledgerName: 'HDFC Bank - Current A/c', amount: 236000, type: 'Dr' },
      { ledgerId: 'led_deb_xyz', ledgerName: 'XYZ Traders (Debtor)', amount: 236000, type: 'Cr' }
    ],
    partyLedgerId: 'led_deb_xyz', chequeNo: '456789', chequeDate: '2024-12-10', 
    narration: 'Payment received from XYZ Traders via NEFT'
  },
  {
    id: 'vch_004', voucherNo: 'PMT/001', type: 'payment', date: '2024-12-12',
    entries: [
      { ledgerId: 'led_cred_sup1', ledgerName: 'Steel Suppliers Ltd (Creditor)', amount: 118000, type: 'Dr' },
      { ledgerId: 'led_hdfc', ledgerName: 'HDFC Bank - Current A/c', amount: 118000, type: 'Cr' }
    ],
    partyLedgerId: 'led_cred_sup1', chequeNo: '789012', chequeDate: '2024-12-12',
    narration: 'Payment to Steel Suppliers Ltd'
  },
  {
    id: 'vch_005', voucherNo: 'PUR/002', type: 'purchase', date: '2024-12-15',
    entries: [
      { ledgerId: 'led_purchase', ledgerName: 'Purchase Account', amount: 75000, type: 'Dr' },
      { ledgerId: 'led_cgst_in', ledgerName: 'CGST Input', amount: 6750, type: 'Dr' },
      { ledgerId: 'led_sgst_in', ledgerName: 'SGST Input', amount: 6750, type: 'Dr' },
      { ledgerId: 'led_cred_sup2', ledgerName: 'Raw Material Co (Creditor)', amount: 88500, type: 'Cr' }
    ],
    partyLedgerId: 'led_cred_sup2', narration: 'Purchase of raw materials'
  },
  {
    id: 'vch_006', voucherNo: 'SAL/002', type: 'sales', date: '2024-12-18',
    entries: [
      { ledgerId: 'led_deb_pqr', ledgerName: 'PQR Enterprises (Debtor)', amount: 354000, type: 'Dr' },
      { ledgerId: 'led_sales', ledgerName: 'Sales Account', amount: 300000, type: 'Cr' },
      { ledgerId: 'led_cgst_out', ledgerName: 'CGST Output', amount: 27000, type: 'Cr' },
      { ledgerId: 'led_sgst_out', ledgerName: 'SGST Output', amount: 27000, type: 'Cr' }
    ],
    partyLedgerId: 'led_deb_pqr', narration: 'Sale to PQR Enterprises'
  },
  {
    id: 'vch_007', voucherNo: 'PMT/002', type: 'payment', date: '2024-12-20',
    entries: [
      { ledgerId: 'led_rent', ledgerName: 'Rent Expense', amount: 25000, type: 'Dr' },
      { ledgerId: 'led_hdfc', ledgerName: 'HDFC Bank - Current A/c', amount: 25000, type: 'Cr' }
    ],
    narration: 'Office rent for December 2024'
  },
  {
    id: 'vch_008', voucherNo: 'PMT/003', type: 'payment', date: '2024-12-22',
    entries: [
      { ledgerId: 'led_salary', ledgerName: 'Salary & Wages', amount: 150000, type: 'Dr' },
      { ledgerId: 'led_hdfc', ledgerName: 'HDFC Bank - Current A/c', amount: 150000, type: 'Cr' }
    ],
    narration: 'Salary payment for December 2024'
  },
  {
    id: 'vch_009', voucherNo: 'RCT/002', type: 'receipt', date: '2024-12-25',
    entries: [
      { ledgerId: 'led_hdfc', ledgerName: 'HDFC Bank - Current A/c', amount: 354000, type: 'Dr' },
      { ledgerId: 'led_deb_pqr', ledgerName: 'PQR Enterprises (Debtor)', amount: 354000, type: 'Cr' }
    ],
    partyLedgerId: 'led_deb_pqr', chequeNo: '123456', chequeDate: '2024-12-25',
    narration: 'Payment received from PQR Enterprises', isReconciled: true, reconcileDate: '2024-12-26'
  },
  {
    id: 'vch_010', voucherNo: 'JRN/001', type: 'journal', date: '2024-12-28',
    entries: [
      { ledgerId: 'led_electricity', ledgerName: 'Electricity Charges', amount: 8500, type: 'Dr' },
      { ledgerId: 'led_telephone', ledgerName: 'Telephone & Internet', amount: 3500, type: 'Dr' },
      { ledgerId: 'led_cash', ledgerName: 'Cash in Hand', amount: 12000, type: 'Cr' }
    ],
    narration: 'Office expenses paid in cash'
  }
];

export const SAMPLE_STOCK_ITEMS = [
  { id: 'stk_001', name: 'Steel Rod 12mm', group: 'raw-materials', unit: 'Kg', openingQty: 1000, openingRate: 65, hsnCode: '7213', gstRate: 18, reorderLevel: 200 },
  { id: 'stk_002', name: 'Steel Rod 10mm', group: 'raw-materials', unit: 'Kg', openingQty: 800, openingRate: 60, hsnCode: '7213', gstRate: 18, reorderLevel: 150 },
  { id: 'stk_003', name: 'Cement Bags', group: 'raw-materials', unit: 'Bags', openingQty: 200, openingRate: 350, hsnCode: '2523', gstRate: 28, reorderLevel: 50 },
  { id: 'stk_004', name: 'Finished Product A', group: 'finished-goods', unit: 'Nos', openingQty: 50, openingRate: 2500, hsnCode: '7308', gstRate: 18, reorderLevel: 10 },
  { id: 'stk_005', name: 'Finished Product B', group: 'finished-goods', unit: 'Nos', openingQty: 30, openingRate: 3500, hsnCode: '7308', gstRate: 18, reorderLevel: 5 },
  { id: 'stk_006', name: 'Packing Material', group: 'consumables', unit: 'Pcs', openingQty: 500, openingRate: 15, hsnCode: '3923', gstRate: 18, reorderLevel: 100 },
];

export const SAMPLE_EMPLOYEES = [
  { id: 'emp_001', name: 'Rahul Kumar', employeeId: 'EMP001', designation: 'Production Manager', department: 'Production', pan: 'ABCPR1234A', uan: '100123456789', bankAccount: '1234567890', basicSalary: 35000, hraPercent: 40, daPercent: 10, conveyance: 1600, medical: 1250, special: 5000, tds: 2000, loanDeduction: 0, joiningDate: '2022-04-01' },
  { id: 'emp_002', name: 'Priya Sharma', employeeId: 'EMP002', designation: 'Accounts Officer', department: 'Accounts', pan: 'ABCPS5678B', uan: '100987654321', bankAccount: '0987654321', basicSalary: 28000, hraPercent: 40, daPercent: 10, conveyance: 1600, medical: 1250, special: 3000, tds: 1500, loanDeduction: 0, joiningDate: '2023-01-15' },
  { id: 'emp_003', name: 'Amit Verma', employeeId: 'EMP003', designation: 'Store Keeper', department: 'Stores', pan: 'ABCPV9012C', uan: '100456789012', bankAccount: '4567890123', basicSalary: 18000, hraPercent: 40, daPercent: 10, conveyance: 1600, medical: 1250, special: 0, tds: 0, loanDeduction: 2000, joiningDate: '2021-07-01' },
  { id: 'emp_004', name: 'Sneha Patel', employeeId: 'EMP004', designation: 'HR Executive', department: 'HR', pan: 'ABCPP3456D', uan: '100789012345', bankAccount: '7890123456', basicSalary: 25000, hraPercent: 40, daPercent: 10, conveyance: 1600, medical: 1250, special: 2000, tds: 1000, loanDeduction: 0, joiningDate: '2023-06-01' },
];

/**
 * Load all sample data into localStorage
 */
export const loadSampleData = () => {
  const clientId = SAMPLE_CLIENT.id;
  
  // Save client
  const existingClients = JSON.parse(localStorage.getItem('capro_clients') || '[]');
  if (!existingClients.find(c => c.id === clientId)) {
    existingClients.push(SAMPLE_CLIENT);
    localStorage.setItem('capro_clients', JSON.stringify(existingClients));
  }
  
  // Save ledgers
  const ledgerKey = `capro_ledgers_${clientId}`;
  localStorage.setItem(ledgerKey, JSON.stringify(SAMPLE_LEDGERS));
  
  // Save vouchers
  const voucherKey = `capro_vouchers_${clientId}`;
  localStorage.setItem(voucherKey, JSON.stringify(SAMPLE_VOUCHERS));
  
  // Save stock items
  const stockKey = `stock_items_${clientId}`;
  localStorage.setItem(stockKey, JSON.stringify(SAMPLE_STOCK_ITEMS));
  
  // Save employees
  const empKey = `employees_${clientId}`;
  localStorage.setItem(empKey, JSON.stringify(SAMPLE_EMPLOYEES));
  
  return {
    clientId,
    clientName: SAMPLE_CLIENT.name,
    ledgersCount: SAMPLE_LEDGERS.length,
    vouchersCount: SAMPLE_VOUCHERS.length,
    stockItemsCount: SAMPLE_STOCK_ITEMS.length,
    employeesCount: SAMPLE_EMPLOYEES.length
  };
};

/**
 * Clear all sample data
 */
export const clearSampleData = () => {
  const clientId = SAMPLE_CLIENT.id;
  
  // Remove client
  const clients = JSON.parse(localStorage.getItem('capro_clients') || '[]');
  const filtered = clients.filter(c => c.id !== clientId);
  localStorage.setItem('capro_clients', JSON.stringify(filtered));
  
  // Remove all related data
  localStorage.removeItem(`capro_ledgers_${clientId}`);
  localStorage.removeItem(`capro_vouchers_${clientId}`);
  localStorage.removeItem(`stock_items_${clientId}`);
  localStorage.removeItem(`employees_${clientId}`);
  
  return true;
};
