// localStorage Data Service
import { STORAGE_KEYS } from '../constants';
import { generateId } from '../utils/formatters';

// ============= Generic Storage Operations =============

const getFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading from storage (${key}):`, error);
    return [];
  }
};

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to storage (${key}):`, error);
    return false;
  }
};

// ============= Clients =============

export const getClients = () => getFromStorage(STORAGE_KEYS.CLIENTS);

export const getClientById = (id) => {
  const clients = getClients();
  return clients.find(c => c.id === id) || null;
};

export const saveClient = (client) => {
  const clients = getClients();
  const newClient = {
    ...client,
    id: client.id || generateId(),
    createdAt: client.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const existingIndex = clients.findIndex(c => c.id === newClient.id);
  if (existingIndex >= 0) {
    clients[existingIndex] = newClient;
  } else {
    clients.push(newClient);
  }
  
  saveToStorage(STORAGE_KEYS.CLIENTS, clients);
  return newClient;
};

export const deleteClient = (id) => {
  const clients = getClients().filter(c => c.id !== id);
  saveToStorage(STORAGE_KEYS.CLIENTS, clients);
  // Also delete related data
  deleteLedgersByClient(id);
  deleteVouchersByClient(id);
};

// ============= Companies =============

export const getCompanies = () => getFromStorage(STORAGE_KEYS.COMPANIES);

export const getCompaniesByClient = (clientId) => {
  return getCompanies().filter(c => c.clientId === clientId);
};

export const saveCompany = (company) => {
  const companies = getCompanies();
  const newCompany = {
    ...company,
    id: company.id || generateId(),
    createdAt: company.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const existingIndex = companies.findIndex(c => c.id === newCompany.id);
  if (existingIndex >= 0) {
    companies[existingIndex] = newCompany;
  } else {
    companies.push(newCompany);
  }
  
  saveToStorage(STORAGE_KEYS.COMPANIES, companies);
  return newCompany;
};

export const deleteCompany = (id) => {
  const companies = getCompanies().filter(c => c.id !== id);
  saveToStorage(STORAGE_KEYS.COMPANIES, companies);
};

// ============= Ledgers =============

export const getLedgers = () => getFromStorage(STORAGE_KEYS.LEDGERS);

export const getLedgersByClient = (clientId) => {
  return getLedgers().filter(l => l.clientId === clientId);
};

export const getLedgerById = (id) => {
  return getLedgers().find(l => l.id === id) || null;
};

export const saveLedger = (ledger) => {
  const ledgers = getLedgers();
  const newLedger = {
    ...ledger,
    id: ledger.id || generateId(),
    createdAt: ledger.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const existingIndex = ledgers.findIndex(l => l.id === newLedger.id);
  if (existingIndex >= 0) {
    ledgers[existingIndex] = newLedger;
  } else {
    ledgers.push(newLedger);
  }
  
  saveToStorage(STORAGE_KEYS.LEDGERS, ledgers);
  return newLedger;
};

export const deleteLedger = (id) => {
  const ledgers = getLedgers().filter(l => l.id !== id);
  saveToStorage(STORAGE_KEYS.LEDGERS, ledgers);
};

const deleteLedgersByClient = (clientId) => {
  const ledgers = getLedgers().filter(l => l.clientId !== clientId);
  saveToStorage(STORAGE_KEYS.LEDGERS, ledgers);
};

// ============= Vouchers =============

export const getVouchers = () => getFromStorage(STORAGE_KEYS.VOUCHERS);

export const getVouchersByClient = (clientId) => {
  return getVouchers().filter(v => v.clientId === clientId);
};

export const getVoucherById = (id) => {
  return getVouchers().find(v => v.id === id) || null;
};

export const saveVoucher = (voucher) => {
  const vouchers = getVouchers();
  const newVoucher = {
    ...voucher,
    id: voucher.id || generateId(),
    createdAt: voucher.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  const existingIndex = vouchers.findIndex(v => v.id === newVoucher.id);
  if (existingIndex >= 0) {
    vouchers[existingIndex] = newVoucher;
  } else {
    vouchers.push(newVoucher);
  }
  
  saveToStorage(STORAGE_KEYS.VOUCHERS, vouchers);
  return newVoucher;
};

export const deleteVoucher = (id) => {
  const vouchers = getVouchers().filter(v => v.id !== id);
  saveToStorage(STORAGE_KEYS.VOUCHERS, vouchers);
};

const deleteVouchersByClient = (clientId) => {
  const vouchers = getVouchers().filter(v => v.clientId !== clientId);
  saveToStorage(STORAGE_KEYS.VOUCHERS, vouchers);
};

// ============= Settings =============

export const getSettings = () => {
  const settings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
  return settings ? JSON.parse(settings) : {
    financialYear: '2024-2025',
    defaultGstRate: 18,
    companyName: 'CA Pro Connect',
    address: '',
    gstin: '',
    pan: ''
  };
};

export const saveSettings = (settings) => {
  saveToStorage(STORAGE_KEYS.SETTINGS, settings);
  return settings;
};

// ============= Auth =============

export const getAuth = () => {
  const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
  return auth ? JSON.parse(auth) : null;
};

export const saveAuth = (auth) => {
  saveToStorage(STORAGE_KEYS.AUTH, auth);
  return auth;
};

export const clearAuth = () => {
  localStorage.removeItem(STORAGE_KEYS.AUTH);
};

// ============= Initialize Default Data =============

export const initializeDefaultData = () => {
  // Add some default clients if none exist
  if (getClients().length === 0) {
    const defaultClients = [
      { name: "Apex Polylabs Ltd", gstin: "27AABCU9603R1ZN", pan: "AABCU9603R", group: "Manufacturing", status: "Active" },
      { name: "Greenfield Estates", gstin: "27AABCG1234R1Z5", pan: "AABCG1234R", group: "Real Estate", status: "Active" },
      { name: "Dr. Sharma Clinic", gstin: "", pan: "AABCS5678R", group: "Service", status: "Pending" },
      { name: "TechNova Solutions", gstin: "27AABCT9876R1Z1", pan: "AABCT9876R", group: "IT Services", status: "Active" },
    ];
    defaultClients.forEach(client => saveClient(client));
  }
};
