// Day Book Screen - All transactions by date
import React, { useState, useMemo } from 'react';
import { Calendar, Filter, ChevronRight, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, ShortcutBar } from '../ui';
import { formatCurrency, formatDate, formatDateForInput } from '../../utils/formatters';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

const DayBook = () => {
  const navigate = useNavigate();
  const { getClientVouchers, selectedClient, selectedFinancialYear } = useApp();
  const vouchers = getClientVouchers();
  
  const [selectedDate, setSelectedDate] = useState(formatDateForInput(new Date()));
  const [filterType, setFilterType] = useState('all');

  // Enable keyboard shortcuts
  useKeyboardShortcuts({});

  // Filter vouchers
  const filteredVouchers = useMemo(() => {
    return vouchers
      .filter(v => {
        const dateMatch = v.date === selectedDate;
        const typeMatch = filterType === 'all' || v.type === filterType;
        return dateMatch && typeMatch;
      })
      .sort((a, b) => (a.voucherNo > b.voucherNo ? 1 : -1));
  }, [vouchers, selectedDate, filterType]);

  // Calculate totals
  const totals = useMemo(() => {
    let debit = 0, credit = 0;
    filteredVouchers.forEach(v => {
      v.entries?.forEach(e => {
        if (e.type === 'Dr') debit += e.amount;
        if (e.type === 'Cr') credit += e.amount;
      });
    });
    return { debit, credit };
  }, [filteredVouchers]);

  const getBadgeType = (type) => {
    switch(type) {
      case 'sales': return 'success';
      case 'purchase': return 'brand';
      case 'payment': return 'warning';
      case 'receipt': return 'success';
      default: return 'neutral';
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-violet-500" />
            Day Book
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {selectedClient?.name || 'Select a client'} • {formatDate(selectedDate)}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
          >
            <option value="all">All Types</option>
            <option value="sales">Sales</option>
            <option value="purchase">Purchase</option>
            <option value="payment">Payment</option>
            <option value="receipt">Receipt</option>
            <option value="journal">Journal</option>
            <option value="contra">Contra</option>
          </select>
        </div>
      </div>

      {!selectedClient && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
          ⚠️ Select a client from the header to view their day book.
        </div>
      )}

      {/* Vouchers List */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600">
            Transactions on {formatDate(selectedDate)}
          </h3>
          <span className="text-xs text-slate-500">{filteredVouchers.length} entries</span>
        </div>

        {filteredVouchers.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No transactions on this date</p>
            <Button className="mt-4" onClick={() => navigate('/vouchers')}>
              Create Voucher
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredVouchers.map((voucher) => (
              <div 
                key={voucher.id}
                className="p-4 hover:bg-slate-50 cursor-pointer group transition-colors"
                onClick={() => navigate(`/vouchers?id=${voucher.id}`)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-center min-w-[60px]">
                      <p className="font-mono text-xs font-bold text-slate-900">{voucher.voucherNo}</p>
                      <Badge type={getBadgeType(voucher.type)} className="mt-1">
                        {voucher.typeLabel || voucher.type}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{voucher.partyLedgerName || 'General Entry'}</p>
                      {voucher.narration && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{voucher.narration}</p>
                      )}
                      <div className="mt-2 space-y-1">
                        {voucher.entries?.slice(0, 3).map((entry, idx) => (
                          <div key={idx} className="text-xs flex items-center text-slate-500">
                            <span className={`w-8 font-mono font-bold ${entry.type === 'Dr' ? 'text-red-500' : 'text-emerald-500'}`}>
                              {entry.type}
                            </span>
                            <span className="flex-1 truncate">{entry.ledgerName}</span>
                            <span className="font-mono ml-2">{formatCurrency(entry.amount)}</span>
                          </div>
                        ))}
                        {(voucher.entries?.length || 0) > 3 && (
                          <p className="text-xs text-slate-400 italic">
                            +{voucher.entries.length - 3} more entries
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-bold text-slate-900">{formatCurrency(voucher.totalAmount || 0)}</p>
                    <ChevronRight className="w-4 h-4 text-slate-300 mt-2 ml-auto opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Totals Footer */}
        {filteredVouchers.length > 0 && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Total Debit</p>
              <p className="font-mono font-bold text-lg text-red-600">{formatCurrency(totals.debit)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Total Credit</p>
              <p className="font-mono font-bold text-lg text-emerald-600">{formatCurrency(totals.credit)}</p>
            </div>
          </div>
        )}
      </Card>

      <ShortcutBar context="default" />
    </div>
  );
};

export default DayBook;
