// Application Constants

export const FINANCIAL_YEARS = ["2024-2025", "2023-2024", "2022-2023"];

export const VOUCHER_TYPES = [
  { id: "sales", label: "Sales", prefix: "SAL", key: "F8" },
  { id: "purchase", label: "Purchase", prefix: "PUR", key: "F9" },
  { id: "payment", label: "Payment", prefix: "PAY", key: "F5" },
  { id: "receipt", label: "Receipt", prefix: "REC", key: "F6" },
  { id: "journal", label: "Journal", prefix: "JRN", key: "F7" },
  { id: "contra", label: "Contra", prefix: "CON", key: "F4" },
  { id: "debit-note", label: "Debit Note", prefix: "DN", key: "Ctrl+F9" },
  { id: "credit-note", label: "Credit Note", prefix: "CN", key: "Ctrl+F8" }
];

export const GST_RATES = [
  { rate: 0, label: "Exempt" },
  { rate: 5, label: "5%" },
  { rate: 12, label: "12%" },
  { rate: 18, label: "18%" },
  { rate: 28, label: "28%" }
];

export const LEDGER_GROUPS = {
  "Capital Account": { type: "Capital", nature: "Cr" },
  "Reserves & Surplus": { type: "Capital", nature: "Cr" },
  "Current Assets": { type: "Asset", nature: "Dr", subGroups: ["Cash-in-Hand", "Bank Accounts", "Sundry Debtors", "Stock-in-Trade", "Deposits", "Loans & Advances"] },
  "Fixed Assets": { type: "Asset", nature: "Dr", subGroups: ["Land & Building", "Plant & Machinery", "Furniture & Fixtures", "Vehicles", "Computers"] },
  "Investments": { type: "Asset", nature: "Dr" },
  "Current Liabilities": { type: "Liability", nature: "Cr", subGroups: ["Sundry Creditors", "Duties & Taxes", "Provisions", "Other Liabilities"] },
  "Loans (Liability)": { type: "Liability", nature: "Cr", subGroups: ["Secured Loans", "Unsecured Loans"] },
  "Direct Income": { type: "Income", nature: "Cr", subGroups: ["Sales Account", "Service Revenue"] },
  "Indirect Income": { type: "Income", nature: "Cr", subGroups: ["Interest Received", "Discount Received", "Commission Received"] },
  "Direct Expenses": { type: "Expense", nature: "Dr", subGroups: ["Purchases Account", "Freight Inward", "Wages"] },
  "Indirect Expenses": { type: "Expense", nature: "Dr", subGroups: ["Salaries", "Rent", "Electricity", "Telephone", "Printing & Stationery", "Travelling", "Professional Fees", "Bank Charges", "Depreciation", "Miscellaneous Expenses"] }
};

export const MENU_ITEMS = [
  { id: "dashboard", path: "/", label: "Dashboard", icon: "LayoutDashboard", color: "text-blue-500" },
  { id: "clients", path: "/clients", label: "Clients", icon: "Users", color: "text-orange-500" },
  { id: "companies", path: "/companies", label: "Companies", icon: "Briefcase", color: "text-indigo-500" },
  { id: "ledgers", path: "/ledgers", label: "Ledgers", icon: "BookOpen", color: "text-emerald-500" },
  { id: "ledger-statement", path: "/ledger-statement", label: "Ledger A/c", icon: "BookMarked", color: "text-teal-500" },
  { id: "vouchers", path: "/vouchers", label: "Vouchers", icon: "FileText", color: "text-violet-500" },
  { id: "daybook", path: "/daybook", label: "Day Book", icon: "Calendar", color: "text-rose-500" },
  { id: "stock-items", path: "/stock-items", label: "Inventory", icon: "Package", color: "text-indigo-500" },
  { id: "stock-summary", path: "/stock-summary", label: "Stock Report", icon: "BarChart3", color: "text-purple-500" },
  { id: "gst", path: "/gst", label: "GST Portal", icon: "PieChart", color: "text-pink-500" },
  { id: "gstr1", path: "/gstr1", label: "GSTR-1", icon: "FileOutput", color: "text-orange-500" },
  { id: "gstr3b", path: "/gstr3b", label: "GSTR-3B", icon: "FileBarChart", color: "text-blue-500" },
  { id: "reports", path: "/reports", label: "Reports", icon: "FileSpreadsheet", color: "text-cyan-500" },
  { id: "documents", path: "/documents", label: "Documents", icon: "UploadCloud", color: "text-amber-500" },
  { id: "settings", path: "/settings", label: "Settings", icon: "Settings", color: "text-slate-400" },
];

export const CLIENT_STATUS = ["Active", "Pending", "Inactive"];
export const CLIENT_GROUPS = ["Manufacturing", "Trading", "Service", "Real Estate", "IT Services", "Healthcare", "Retail", "Other"];

// Storage keys
export const STORAGE_KEYS = {
  CLIENTS: 'capro_clients',
  COMPANIES: 'capro_companies',
  LEDGERS: 'capro_ledgers',
  VOUCHERS: 'capro_vouchers',
  SETTINGS: 'capro_settings',
  AUTH: 'capro_auth',
  STOCK_GROUPS: 'capro_stock_groups',
  STOCK_ITEMS: 'capro_stock_items',
  GODOWNS: 'capro_godowns'
};

// Inventory Constants
export const STOCK_GROUPS = [
  { id: 'primary', name: 'Primary', parent: null },
  { id: 'raw-materials', name: 'Raw Materials', parent: 'primary' },
  { id: 'finished-goods', name: 'Finished Goods', parent: 'primary' },
  { id: 'semi-finished', name: 'Semi-Finished Goods', parent: 'primary' },
  { id: 'consumables', name: 'Consumables', parent: 'primary' },
  { id: 'packing-materials', name: 'Packing Materials', parent: 'primary' },
  { id: 'trading-goods', name: 'Trading Goods', parent: 'primary' }
];

export const STOCK_UNITS = [
  { id: 'nos', name: 'Nos', fullName: 'Numbers' },
  { id: 'pcs', name: 'Pcs', fullName: 'Pieces' },
  { id: 'kg', name: 'Kg', fullName: 'Kilograms' },
  { id: 'g', name: 'g', fullName: 'Grams' },
  { id: 'l', name: 'L', fullName: 'Litres' },
  { id: 'ml', name: 'mL', fullName: 'Millilitres' },
  { id: 'm', name: 'm', fullName: 'Metres' },
  { id: 'cm', name: 'cm', fullName: 'Centimetres' },
  { id: 'sqm', name: 'Sq.m', fullName: 'Square Metres' },
  { id: 'box', name: 'Box', fullName: 'Box' },
  { id: 'dozen', name: 'Dzn', fullName: 'Dozen' },
  { id: 'set', name: 'Set', fullName: 'Set' }
];

export const STOCK_VALUATION_METHODS = [
  { id: 'fifo', name: 'FIFO', fullName: 'First In First Out' },
  { id: 'lifo', name: 'LIFO', fullName: 'Last In First Out' },
  { id: 'avg', name: 'Avg Cost', fullName: 'Average Cost' },
  { id: 'std', name: 'Std Cost', fullName: 'Standard Cost' }
];
