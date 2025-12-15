// CA Pro Connect - Main Application with React Router
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, Header } from './components/layout';
import { 
  LoginScreen, 
  Dashboard, 
  ClientList, 
  LedgerManager, 
  VoucherEntry, 
  Reports, 
  GSTDashboard,
  Companies,
  DocumentManager,
  SettingsScreen,
  DayBook,
  LedgerStatement,
  StockItems,
  StockSummary,
  GSTR1Report,
  GSTR3BReport
} from './components/screens';
import { MENU_ITEMS } from './constants';

// Breadcrumbs Component
const Breadcrumbs = () => {
  const { selectedClient } = useApp();
  const location = useLocation();
  const currentMenu = MENU_ITEMS.find(m => m.path === location.pathname);
  
  return (
    <div className="flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest text-slate-400 mb-6">
      <span className="hover:text-black cursor-pointer transition-colors">Home</span>
      <ChevronRight className="w-3 h-3" />
      {selectedClient && (
        <>
          <span className="hover:text-black cursor-pointer transition-colors">{selectedClient.name.split(' ')[0]}</span>
          <ChevronRight className="w-3 h-3" />
        </>
      )}
      <span className="text-black bg-slate-100 px-1 py-0.5 rounded-sm">{currentMenu?.label || 'Dashboard'}</span>
    </div>
  );
};

// Main Layout (after login)
const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-100 font-sans text-slate-900 overflow-hidden selection:bg-black selection:text-white">
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        <Header />
        
        <main className="flex-1 overflow-auto bg-slate-50/50 p-6">
          <div className="max-w-6xl mx-auto">
            <Breadcrumbs />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<ClientList />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/ledgers" element={<LedgerManager />} />
              <Route path="/ledger-statement" element={<LedgerStatement />} />
              <Route path="/vouchers" element={<VoucherEntry />} />
              <Route path="/daybook" element={<DayBook />} />
              <Route path="/stock-items" element={<StockItems />} />
              <Route path="/stock-summary" element={<StockSummary />} />
              <Route path="/gst" element={<GSTDashboard />} />
              <Route path="/gstr1" element={<GSTR1Report />} />
              <Route path="/gstr3b" element={<GSTR3BReport />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/documents" element={<DocumentManager />} />
              <Route path="/settings" element={<SettingsScreen />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

// App Container (handles auth)
const AppContainer = () => {
  const { isLoggedIn, loading } = useApp();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }
  
  if (!isLoggedIn) {
    return <LoginScreen />;
  }
  
  return <MainLayout />;
};

// Root App Component
export default function App() {
  return (
    <HashRouter>
      <AppProvider>
        <AppContainer />
      </AppProvider>
    </HashRouter>
  );
}