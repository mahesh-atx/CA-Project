// Gateway Dashboard - Tally-style home screen
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, BookOpen, FileText, PieChart, 
  FileSpreadsheet, Settings, UploadCloud, Building2,
  Calendar, ChevronRight, TrendingUp, AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, ShortcutBar } from '../ui';
import { formatCurrency } from '../../utils/formatters';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { 
    clients, 
    getClientLedgers, 
    getClientVouchers, 
    selectedClient,
    selectedFinancialYear 
  } = useApp();

  const ledgers = getClientLedgers();
  const vouchers = getClientVouchers();

  // Enable keyboard shortcuts
  useKeyboardShortcuts({});

  // Calculate stats
  const todayVouchers = vouchers.filter(v => {
    const today = new Date().toISOString().split('T')[0];
    return v.date === today;
  }).length;

  const totalDebit = vouchers.reduce((sum, v) => {
    return sum + (v.entries?.filter(e => e.type === 'Dr').reduce((s, e) => s + e.amount, 0) || 0);
  }, 0);

  const menuItems = [
    { 
      title: 'Masters', 
      items: [
        { label: 'Clients', path: '/clients', icon: Users, count: clients.length, key: 'Alt+C' },
        { label: 'Ledgers', path: '/ledgers', icon: BookOpen, count: ledgers.length, key: 'F11' },
        { label: 'Companies', path: '/companies', icon: Building2, key: 'Alt+M' }
      ]
    },
    { 
      title: 'Transactions', 
      items: [
        { label: 'Vouchers', path: '/vouchers', icon: FileText, count: vouchers.length, key: 'Alt+V' },
        { label: 'Day Book', path: '/daybook', icon: Calendar, key: 'Alt+D' }
      ]
    },
    { 
      title: 'Reports', 
      items: [
        { label: 'Financial Reports', path: '/reports', icon: FileSpreadsheet, key: 'F10' },
        { label: 'GST Portal', path: '/gst', icon: PieChart, key: 'Alt+G' }
      ]
    },
    { 
      title: 'Utilities', 
      items: [
        { label: 'Documents', path: '/documents', icon: UploadCloud },
        { label: 'Settings', path: '/settings', icon: Settings, key: 'F12' }
      ]
    }
  ];

  return (
    <div className="min-h-[calc(100vh-180px)] pb-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Gateway of CA Pro Connect</h1>
        <p className="text-sm text-slate-500 mt-1">
          {selectedClient?.name || 'Select a client'} • FY {selectedFinancialYear}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Company Info */}
        <div className="lg:col-span-1">
          <Card className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
            <div className="flex items-center justify-center w-12 h-12 bg-white/10 rounded mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg truncate">{selectedClient?.name || 'No Client Selected'}</h3>
            <p className="text-xs text-slate-300 mt-1 font-mono">{selectedClient?.gstin || 'GSTIN: N/A'}</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Current Period</p>
              <p className="font-mono mt-1">{selectedFinancialYear}</p>
            </div>
            {!selectedClient && (
              <button 
                onClick={() => navigate('/clients')}
                className="mt-4 w-full py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
              >
                Select Client
              </button>
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="p-4 mt-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Today's Activity</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Vouchers</span>
                <span className="font-mono font-bold">{todayVouchers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Entries</span>
                <span className="font-mono font-bold text-sm">{formatCurrency(totalDebit)}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Center Panel - Menu */}
        <div className="lg:col-span-2 space-y-6">
          {menuItems.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center">
                <span className="w-2 h-2 bg-black rounded-full mr-2"></span>
                {section.title}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-sm hover:border-black hover:shadow-sm transition-all group text-left"
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 text-slate-400 group-hover:text-black" />
                      <div>
                        <p className="font-medium text-slate-800">{item.label}</p>
                        {item.count !== undefined && (
                          <p className="text-[10px] text-slate-400 font-mono">{item.count} entries</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {item.key && (
                        <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-slate-100 text-[10px] font-mono rounded text-slate-500">
                          {item.key}
                        </kbd>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-black" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Panel - Quick Actions & Alerts */}
        <div className="lg:col-span-1 space-y-4">
          {/* Quick Voucher Entry */}
          <Card className="p-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Quick Voucher</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Payment', key: 'F5', path: '/vouchers?type=payment' },
                { label: 'Receipt', key: 'F6', path: '/vouchers?type=receipt' },
                { label: 'Sales', key: 'F8', path: '/vouchers?type=sales' },
                { label: 'Purchase', key: 'F9', path: '/vouchers?type=purchase' },
              ].map(v => (
                <button
                  key={v.key}
                  onClick={() => navigate(v.path)}
                  className="p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-sm text-xs font-medium transition-colors"
                >
                  <kbd className="text-[9px] font-mono text-slate-400">{v.key}</kbd>
                  <span className="ml-2">{v.label}</span>
                </button>
              ))}
            </div>
          </Card>

          {/* Compliance Alerts */}
          <Card className="p-4 border-l-4 border-l-amber-500">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1 text-amber-500" />
              Upcoming Deadlines
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">GSTR-1 (Nov)</span>
                <span className="font-mono text-amber-600">11 Dec</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">GSTR-3B (Nov)</span>
                <span className="font-mono text-amber-600">20 Dec</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">TDS Payment</span>
                <span className="font-mono text-slate-500">7 Jan</span>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              Recent Vouchers
            </h4>
            {vouchers.length === 0 ? (
              <p className="text-xs text-slate-400">No vouchers yet</p>
            ) : (
              <div className="space-y-2">
                {vouchers.slice(-5).reverse().map((v, i) => (
                  <div key={i} className="flex justify-between text-sm border-b border-slate-100 pb-2 last:border-0">
                    <div>
                      <p className="font-mono text-xs text-slate-500">{v.voucherNo}</p>
                      <p className="text-slate-600">{v.typeLabel || v.type}</p>
                    </div>
                    <p className="font-mono text-xs">{formatCurrency(v.totalAmount || 0)}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Shortcut Bar */}
      <ShortcutBar context="dashboard" />
    </div>
  );
};

export default Dashboard;
