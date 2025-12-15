// Application Context - Central State Management
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as storage from '../services/storage';
import { getCurrentFinancialYear } from '../utils/formatters';

const AppContext = createContext(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  
  // UI state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  
  // Data state
  const [clients, setClients] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [ledgers, setLedgers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [settings, setSettings] = useState(storage.getSettings());
  
  // Selection state
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedFinancialYear, setSelectedFinancialYear] = useState(getCurrentFinancialYear());

  // Initialize data on mount
  useEffect(() => {
    const auth = storage.getAuth();
    if (auth) {
      setIsLoggedIn(true);
      setUser(auth);
    }
    
    storage.initializeDefaultData();
    refreshAllData();
    setLoading(false);
  }, []);

  // Refresh all data from storage
  const refreshAllData = useCallback(() => {
    setClients(storage.getClients());
    setCompanies(storage.getCompanies());
    setLedgers(storage.getLedgers());
    setVouchers(storage.getVouchers());
    setSettings(storage.getSettings());
  }, []);

  // Get filtered data by selected client
  const getClientLedgers = useCallback(() => {
    if (!selectedClient) return ledgers;
    return ledgers.filter(l => l.clientId === selectedClient.id);
  }, [ledgers, selectedClient]);

  const getClientVouchers = useCallback(() => {
    if (!selectedClient) return vouchers;
    return vouchers.filter(v => v.clientId === selectedClient.id);
  }, [vouchers, selectedClient]);

  // Auth actions
  const login = useCallback((email, password) => {
    // Simple mock auth - in production, validate against backend
    const authData = {
      email,
      name: 'Admin User',
      role: 'Senior Partner',
      loginAt: new Date().toISOString()
    };
    storage.saveAuth(authData);
    setIsLoggedIn(true);
    setUser(authData);
    return true;
  }, []);

  const logout = useCallback(() => {
    storage.clearAuth();
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  // Client actions
  const addClient = useCallback((clientData) => {
    const saved = storage.saveClient(clientData);
    setClients(storage.getClients());
    return saved;
  }, []);

  const updateClient = useCallback((clientData) => {
    const saved = storage.saveClient(clientData);
    setClients(storage.getClients());
    if (selectedClient?.id === saved.id) {
      setSelectedClient(saved);
    }
    return saved;
  }, [selectedClient]);

  const removeClient = useCallback((id) => {
    storage.deleteClient(id);
    setClients(storage.getClients());
    setLedgers(storage.getLedgers());
    setVouchers(storage.getVouchers());
    if (selectedClient?.id === id) {
      setSelectedClient(null);
    }
  }, [selectedClient]);

  // Ledger actions
  const addLedger = useCallback((ledgerData) => {
    const saved = storage.saveLedger({
      ...ledgerData,
      clientId: ledgerData.clientId || selectedClient?.id
    });
    setLedgers(storage.getLedgers());
    return saved;
  }, [selectedClient]);

  const updateLedger = useCallback((ledgerData) => {
    const saved = storage.saveLedger(ledgerData);
    setLedgers(storage.getLedgers());
    return saved;
  }, []);

  const removeLedger = useCallback((id) => {
    storage.deleteLedger(id);
    setLedgers(storage.getLedgers());
  }, []);

  // Voucher actions
  const addVoucher = useCallback((voucherData) => {
    const saved = storage.saveVoucher({
      ...voucherData,
      clientId: voucherData.clientId || selectedClient?.id
    });
    setVouchers(storage.getVouchers());
    return saved;
  }, [selectedClient]);

  const updateVoucher = useCallback((voucherData) => {
    const saved = storage.saveVoucher(voucherData);
    setVouchers(storage.getVouchers());
    return saved;
  }, []);

  const removeVoucher = useCallback((id) => {
    storage.deleteVoucher(id);
    setVouchers(storage.getVouchers());
  }, []);

  // Settings actions
  const updateSettings = useCallback((newSettings) => {
    const saved = storage.saveSettings(newSettings);
    setSettings(saved);
    return saved;
  }, []);

  const value = {
    // Auth
    isLoggedIn,
    user,
    login,
    logout,
    
    // UI
    sidebarOpen,
    setSidebarOpen,
    loading,
    
    // Data
    clients,
    companies,
    ledgers,
    vouchers,
    settings,
    
    // Selection
    selectedClient,
    setSelectedClient,
    selectedFinancialYear,
    setSelectedFinancialYear,
    
    // Filtered data
    getClientLedgers,
    getClientVouchers,
    
    // Actions
    addClient,
    updateClient,
    removeClient,
    addLedger,
    updateLedger,
    removeLedger,
    addVoucher,
    updateVoucher,
    removeVoucher,
    updateSettings,
    refreshAllData
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
