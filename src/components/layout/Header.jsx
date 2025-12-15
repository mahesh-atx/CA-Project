// Header Component
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Building2, 
  Calendar, 
  Command, 
  Bell, 
  ChevronRight 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FINANCIAL_YEARS, MENU_ITEMS } from '../../constants';

const Header = () => {
  const { 
    sidebarOpen, 
    setSidebarOpen, 
    clients, 
    selectedClient, 
    setSelectedClient,
    selectedFinancialYear,
    setSelectedFinancialYear,
    user
  } = useApp();
  
  const location = useLocation();
  const currentMenu = MENU_ITEMS.find(m => m.path === location.pathname);

  return (
    <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 bg-white z-10">
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="text-slate-400 hover:text-black transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
        
        {/* Context Selectors */}
        <div className="hidden sm:flex items-center space-x-2">
          {/* Client Selector */}
          <div className="flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-sm hover:border-slate-300 transition-colors cursor-pointer group">
            <Building2 className="w-3.5 h-3.5 text-slate-400 mr-2 group-hover:text-black transition-colors" />
            <select 
              className="bg-transparent text-xs font-bold uppercase tracking-wide text-slate-700 focus:outline-none cursor-pointer appearance-none pr-4"
              value={selectedClient?.id || ''}
              onChange={(e) => {
                const client = clients.find(c => c.id === e.target.value);
                setSelectedClient(client || null);
              }}
            >
              <option value="">All Clients</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <ChevronRight className="w-3 h-3 text-slate-400 rotate-90" />
          </div>
          
          {/* Financial Year Selector */}
          <div className="flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-sm hover:border-slate-300 transition-colors cursor-pointer group">
            <Calendar className="w-3.5 h-3.5 text-slate-400 mr-2 group-hover:text-black transition-colors" />
            <select 
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-none cursor-pointer appearance-none pr-2"
              value={selectedFinancialYear}
              onChange={(e) => setSelectedFinancialYear(e.target.value)}
            >
              {FINANCIAL_YEARS.map(y => <option key={y} value={y}>FY {y}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        {/* Command Search */}
        <div className="hidden lg:flex items-center px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-sm text-xs text-slate-400 hover:border-slate-300 cursor-pointer transition-colors">
          <Command className="w-3 h-3 mr-2" />
          <span className="mr-4">Type a command or search...</span>
          <span className="bg-slate-200 text-slate-500 px-1 rounded-sm text-[10px] font-mono">⌘K</span>
        </div>

        {/* Notifications */}
        <button className="relative text-slate-400 hover:text-black transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
        </button>
        
        {/* User Profile */}
        <div className="flex items-center space-x-3 border-l border-slate-200 pl-6">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-slate-900">{user?.name || 'Admin User'}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{user?.role || 'Partner'}</p>
          </div>
          <div className="h-9 w-9 bg-black rounded-sm flex items-center justify-center text-white text-xs font-bold">
            {(user?.name || 'AU').split(' ').map(n => n[0]).join('').substring(0, 2)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
