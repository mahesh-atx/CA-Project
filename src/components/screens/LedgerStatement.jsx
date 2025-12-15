// Ledger Statement Screen - Transaction history for any ledger
import React, { useState, useMemo } from 'react';
import { BookOpen, Download, Calendar, ArrowUpDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Button, ShortcutBar } from '../ui';
import { formatCurrency, formatDate, formatDateForInput } from '../../utils/formatters';
import { calculateLedgerBalance } from '../../services/calculations';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';

const LedgerStatement = () => {
  const { getClientLedgers, getClientVouchers, selectedClient, selectedFinancialYear } = useApp();
  const ledgers = getClientLedgers();
  const vouchers = getClientVouchers();
  
  const [selectedLedgerId, setSelectedLedgerId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState(formatDateForInput(new Date()));

  // Enable keyboard shortcuts
  useKeyboardShortcuts({});

  const selectedLedger = ledgers.find(l => l.id === selectedLedgerId);

  // Get all transactions for selected ledger
  const transactions = useMemo(() => {
    if (!selectedLedgerId) return [];

    const entries = [];
    
    // Add opening balance as first entry
    if (selectedLedger?.openingBalance) {
      entries.push({
        id: 'opening',
        date: dateFrom || '0000-00-00',
        voucherNo: '-',
        type: 'Opening',
        particulars: 'Opening Balance',
        debit: selectedLedger.openingBalanceType === 'Dr' ? selectedLedger.openingBalance : 0,
        credit: selectedLedger.openingBalanceType === 'Cr' ? selectedLedger.openingBalance : 0,
        isOpening: true
      });
    }

    // Get voucher entries for this ledger
    vouchers.forEach(voucher => {
      // Date filter
      if (dateFrom && voucher.date < dateFrom) return;
      if (dateTo && voucher.date > dateTo) return;

      voucher.entries?.forEach(entry => {
        if (entry.ledgerId === selectedLedgerId) {
          // Find contra entries (what's on the other side)
          const contraEntries = voucher.entries
            .filter(e => e.ledgerId !== selectedLedgerId)
            .map(e => e.ledgerName)
            .slice(0, 2)
            .join(', ');

          entries.push({
            id: `${voucher.id}-${entry.ledgerId}`,
            date: voucher.date,
            voucherNo: voucher.voucherNo,
            type: voucher.typeLabel || voucher.type,
            particulars: contraEntries || voucher.narration || '-',
            debit: entry.type === 'Dr' ? entry.amount : 0,
            credit: entry.type === 'Cr' ? entry.amount : 0
          });
        }
      });
    });

    // Sort by date
    entries.sort((a, b) => {
      if (a.isOpening) return -1;
      if (b.isOpening) return 1;
      return a.date.localeCompare(b.date);
    });

    // Calculate running balance
    let balance = 0;
    const ledgerNature = selectedLedger?.group ? 
      ['Current Assets', 'Fixed Assets', 'Direct Expenses', 'Indirect Expenses'].includes(selectedLedger.group) ? 'Dr' : 'Cr'
      : 'Dr';

    entries.forEach(entry => {
      if (ledgerNature === 'Dr') {
        balance += entry.debit - entry.credit;
      } else {
        balance += entry.credit - entry.debit;
      }
      entry.balance = Math.abs(balance);
      entry.balanceType = balance >= 0 ? ledgerNature : (ledgerNature === 'Dr' ? 'Cr' : 'Dr');
    });

    return entries;
  }, [selectedLedgerId, vouchers, dateFrom, dateTo, selectedLedger]);

  // Calculate totals
  const totals = useMemo(() => {
    return transactions.reduce((acc, t) => ({
      debit: acc.debit + t.debit,
      credit: acc.credit + t.credit
    }), { debit: 0, credit: 0 });
  }, [transactions]);

  const closingBalance = transactions.length > 0 ? transactions[transactions.length - 1] : null;

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <BookOpen className="w-5 h-5 mr-2 text-emerald-500" />
            Ledger Statement
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {selectedClient?.name || 'Select a client'} • FY {selectedFinancialYear}
          </p>
        </div>
        <Button variant="secondary" icon={Download}>Export</Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
              Select Ledger
            </label>
            <select
              value={selectedLedgerId}
              onChange={(e) => setSelectedLedgerId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
            >
              <option value="">-- Select Ledger --</option>
              {ledgers.map(l => (
                <option key={l.id} value={l.id}>{l.name} ({l.group})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
              From Date
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
              To Date
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
            />
          </div>
        </div>
      </Card>

      {!selectedLedgerId ? (
        <Card className="p-12 text-center text-slate-400">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a ledger to view its transaction history</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          {/* Ledger Header */}
          <div className="p-4 bg-slate-800 text-white">
            <h3 className="font-bold text-lg">{selectedLedger?.name}</h3>
            <p className="text-xs text-slate-300 mt-1">
              {selectedLedger?.group} • {selectedLedger?.subGroup || 'General'}
            </p>
          </div>

          {/* Statement Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Vch No</th>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Particulars</th>
                  <th className="px-4 py-3 text-right">Debit</th>
                  <th className="px-4 py-3 text-right">Credit</th>
                  <th className="px-4 py-3 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-slate-400">
                      No transactions found for this ledger
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className={`hover:bg-slate-50 ${t.isOpening ? 'bg-blue-50' : ''}`}>
                      <td className="px-4 py-3 text-slate-600">{t.isOpening ? '-' : formatDate(t.date)}</td>
                      <td className="px-4 py-3 font-bold text-slate-800">{t.voucherNo}</td>
                      <td className="px-4 py-3 text-slate-600">{t.type}</td>
                      <td className="px-4 py-3 text-slate-800 font-sans max-w-xs truncate">{t.particulars}</td>
                      <td className="px-4 py-3 text-right text-red-600">
                        {t.debit > 0 ? formatCurrency(t.debit) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right text-emerald-600">
                        {t.credit > 0 ? formatCurrency(t.credit) : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-bold">
                        {formatCurrency(t.balance)} {t.balanceType}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              {transactions.length > 0 && (
                <tfoot className="bg-slate-50 border-t-2 border-slate-300 font-bold">
                  <tr>
                    <td colSpan="4" className="px-4 py-3 text-right text-xs uppercase tracking-widest text-slate-600">
                      Total
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-red-600">
                      {formatCurrency(totals.debit)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-600">
                      {formatCurrency(totals.credit)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {closingBalance && (
                        <span className={closingBalance.balanceType === 'Dr' ? 'text-red-600' : 'text-emerald-600'}>
                          {formatCurrency(closingBalance.balance)} {closingBalance.balanceType}
                        </span>
                      )}
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        </Card>
      )}

      <ShortcutBar context="default" />
    </div>
  );
};

export default LedgerStatement;
