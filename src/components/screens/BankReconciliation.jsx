// Bank Reconciliation Screen
import React, { useState, useMemo, useEffect } from 'react';
import { Landmark, CheckCircle2, XCircle, Calendar, Download, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, Input, ShortcutBar } from '../ui';
import { getBankTransactions, getReconciliationSummary } from '../../services/bankReconciliation';
import { formatCurrency, formatDate, formatDateForInput } from '../../utils/formatters';

const BankReconciliation = () => {
  const { getClientVouchers, getClientLedgers, selectedClient, updateVoucher, selectedFinancialYear } = useApp();
  const vouchers = getClientVouchers();
  const ledgers = getClientLedgers();

  const [selectedBankId, setSelectedBankId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState(formatDateForInput(new Date()));
  const [showUnreconciled, setShowUnreconciled] = useState(true);
  const [bankStatementBalance, setBankStatementBalance] = useState(0);

  // Get bank ledgers
  const bankLedgers = useMemo(() => {
    return ledgers.filter(l => 
      l.subGroup === 'Bank Accounts' || 
      l.group === 'Current Assets' && l.name.toLowerCase().includes('bank')
    );
  }, [ledgers]);

  const selectedBank = ledgers.find(l => l.id === selectedBankId);

  // Get transactions
  const transactions = useMemo(() => {
    if (!selectedBankId) return [];
    return getBankTransactions(vouchers, ledgers, selectedBankId, { startDate: dateFrom, endDate: dateTo });
  }, [vouchers, ledgers, selectedBankId, dateFrom, dateTo]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    if (showUnreconciled) {
      return transactions.filter(t => !t.isReconciled);
    }
    return transactions;
  }, [transactions, showUnreconciled]);

  // Summary
  const summary = useMemo(() => {
    const openingBal = selectedBank?.openingBalance || 0;
    const openingType = selectedBank?.openingBalanceType || 'Dr';
    return getReconciliationSummary(transactions, openingBal, openingType);
  }, [transactions, selectedBank]);

  // Toggle reconciliation
  const toggleReconciled = (transaction) => {
    const voucher = vouchers.find(v => v.id === transaction.voucherId);
    if (voucher && updateVoucher) {
      updateVoucher({
        ...voucher,
        isReconciled: !transaction.isReconciled,
        reconcileDate: !transaction.isReconciled ? new Date().toISOString().split('T')[0] : null
      });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Landmark className="w-5 h-5 mr-2 text-blue-500" />
            Bank Reconciliation
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {selectedClient?.name || 'Select a client'} • FY {selectedFinancialYear}
          </p>
        </div>
        <Button variant="secondary" icon={Download}>Export</Button>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="sm:col-span-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">
              Select Bank Account
            </label>
            <select
              value={selectedBankId}
              onChange={(e) => setSelectedBankId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
            >
              <option value="">-- Select Bank --</option>
              {bankLedgers.map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">From</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">To</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showUnreconciled}
                onChange={(e) => setShowUnreconciled(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Unreconciled only</span>
            </label>
          </div>
        </div>
      </Card>

      {!selectedBankId ? (
        <Card className="p-12 text-center text-slate-400">
          <Landmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Select a bank account to start reconciliation</p>
        </Card>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-l-4 border-l-blue-500">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Balance as per Books</p>
              <p className="text-xl font-bold font-mono mt-1">
                {formatCurrency(summary.bookBalance.amount)}
                <span className="text-xs text-slate-500 ml-1">{summary.bookBalance.type}</span>
              </p>
            </Card>
            <Card className="p-4 border-l-4 border-l-emerald-500">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Reconciled Balance</p>
              <p className="text-xl font-bold font-mono mt-1 text-emerald-600">
                {formatCurrency(summary.bankBalance.amount)}
                <span className="text-xs text-emerald-500 ml-1">{summary.bankBalance.type}</span>
              </p>
            </Card>
            <Card className="p-4 border-l-4 border-l-amber-500">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Unreconciled Deposits</p>
              <p className="text-xl font-bold font-mono mt-1 text-amber-600">
                {formatCurrency(summary.unreconciledDeposits)}
              </p>
            </Card>
            <Card className="p-4 border-l-4 border-l-red-500">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Unreconciled Payments</p>
              <p className="text-xl font-bold font-mono mt-1 text-red-600">
                {formatCurrency(summary.unreconciledPayments)}
              </p>
            </Card>
          </div>

          {/* Progress */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Reconciliation Progress</span>
              <span className="text-sm font-mono">
                {summary.reconciledCount} / {summary.reconciledCount + summary.unreconciledCount} matched
              </span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all"
                style={{ 
                  width: `${(summary.reconciledCount / (summary.reconciledCount + summary.unreconciledCount)) * 100 || 0}%` 
                }}
              />
            </div>
          </Card>

          {/* Transactions Table */}
          <Card className="overflow-hidden">
            <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold">{selectedBank?.name}</h3>
                <p className="text-xs text-slate-300">Click checkbox to mark as reconciled</p>
              </div>
              <Badge type="neutral">{filteredTransactions.length} entries</Badge>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b">
                  <tr>
                    <th className="px-3 py-3 w-10"></th>
                    <th className="px-3 py-3 text-left">Date</th>
                    <th className="px-3 py-3 text-left">Vch No</th>
                    <th className="px-3 py-3 text-left">Particulars</th>
                    <th className="px-3 py-3 text-left">Cheque No</th>
                    <th className="px-3 py-3 text-right">Deposit</th>
                    <th className="px-3 py-3 text-right">Withdrawal</th>
                    <th className="px-3 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="px-4 py-8 text-center text-slate-400">
                        {showUnreconciled ? 'All transactions are reconciled!' : 'No transactions found'}
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((t) => (
                      <tr key={t.id} className={`hover:bg-slate-50 ${t.isReconciled ? 'bg-emerald-50' : ''}`}>
                        <td className="px-3 py-3 text-center">
                          <input
                            type="checkbox"
                            checked={t.isReconciled}
                            onChange={() => toggleReconciled(t)}
                            className="w-4 h-4 accent-emerald-500"
                          />
                        </td>
                        <td className="px-3 py-3 font-mono text-xs">{formatDate(t.date)}</td>
                        <td className="px-3 py-3 font-mono font-bold">{t.voucherNo}</td>
                        <td className="px-3 py-3 text-slate-700">{t.particulars}</td>
                        <td className="px-3 py-3 font-mono text-xs text-slate-500">{t.chequeNo || '-'}</td>
                        <td className="px-3 py-3 text-right font-mono text-emerald-600">
                          {t.debit > 0 ? formatCurrency(t.debit) : '-'}
                        </td>
                        <td className="px-3 py-3 text-right font-mono text-red-600">
                          {t.credit > 0 ? formatCurrency(t.credit) : '-'}
                        </td>
                        <td className="px-3 py-3 text-center">
                          {t.isReconciled ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />
                          ) : (
                            <XCircle className="w-4 h-4 text-slate-300 inline" />
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <ShortcutBar context="default" />
    </div>
  );
};

export default BankReconciliation;
