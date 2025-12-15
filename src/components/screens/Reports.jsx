// Reports Screen with Trial Balance, P&L, Balance Sheet
import React, { useState, useMemo } from 'react';
import { Download, FileSpreadsheet, Printer } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Button } from '../ui';
import { formatCurrency } from '../../utils/formatters';
import { generateTrialBalance, generateProfitLoss, generateBalanceSheet } from '../../services/calculations';
import { 
  exportTrialBalancePDF, 
  exportProfitLossPDF, 
  exportBalanceSheetPDF,
  exportTrialBalanceExcel 
} from '../../services/exports';

const Reports = () => {
  const { getClientLedgers, getClientVouchers, selectedClient, selectedFinancialYear } = useApp();
  const ledgers = getClientLedgers();
  const vouchers = getClientVouchers();
  
  const [activeReport, setActiveReport] = useState('trialBalance');

  const trialBalance = useMemo(() => generateTrialBalance(ledgers, vouchers), [ledgers, vouchers]);
  const profitLoss = useMemo(() => generateProfitLoss(ledgers, vouchers), [ledgers, vouchers]);
  const balanceSheet = useMemo(() => generateBalanceSheet(ledgers, vouchers), [ledgers, vouchers]);

  const reports = [
    { id: 'trialBalance', label: 'Trial Balance' },
    { id: 'profitLoss', label: 'Profit & Loss' },
    { id: 'balanceSheet', label: 'Balance Sheet' }
  ];

  const handlePrint = () => {
    window.print();
  };

  const handlePDFExport = () => {
    const clientName = selectedClient?.name || 'Report';
    switch (activeReport) {
      case 'trialBalance':
        exportTrialBalancePDF(trialBalance, clientName, selectedFinancialYear);
        break;
      case 'profitLoss':
        exportProfitLossPDF(profitLoss, clientName, selectedFinancialYear);
        break;
      case 'balanceSheet':
        exportBalanceSheetPDF(balanceSheet, clientName, selectedFinancialYear);
        break;
    }
  };

  const handleExcelExport = () => {
    const clientName = selectedClient?.name || 'Report';
    exportTrialBalanceExcel(trialBalance, clientName, selectedFinancialYear);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Financial Reports</h2>
          {selectedClient && (
            <p className="text-xs text-slate-500 mt-1">{selectedClient.name} • FY {selectedFinancialYear}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" icon={Download} onClick={handlePDFExport}>PDF</Button>
          <Button variant="secondary" icon={FileSpreadsheet} onClick={handleExcelExport}>Excel</Button>
          <Button variant="secondary" icon={Printer} onClick={handlePrint}>Print</Button>
        </div>
      </div>

      {/* Report Tabs */}
      <div className="flex space-x-1 p-1 bg-slate-100 rounded-md w-fit">
        {reports.map(report => (
          <button
            key={report.id}
            onClick={() => setActiveReport(report.id)}
            className={`px-4 py-2 text-sm font-medium rounded-sm transition-all ${
              activeReport === report.id
                ? 'bg-black text-white'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {report.label}
          </button>
        ))}
      </div>

      {!selectedClient && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
          ⚠️ Select a client from the header to view their reports.
        </div>
      )}

      {/* Trial Balance */}
      {activeReport === 'trialBalance' && (
        <Card className="p-8 font-mono text-sm print:shadow-none">
          <div className="text-center mb-8 pb-4 border-b-2 border-black">
            <h3 className="text-xl font-bold font-sans uppercase tracking-widest">{selectedClient?.name || 'Select Client'}</h3>
            <p className="text-slate-500 mt-1">Trial Balance</p>
            <p className="text-slate-500 text-xs">As on 31st March {selectedFinancialYear?.split('-')[1] || '2025'}</p>
          </div>

          <table className="w-full">
            <thead className="text-xs uppercase border-b-2 border-black">
              <tr>
                <th className="text-left py-2 font-bold font-sans">Particulars</th>
                <th className="text-right py-2 w-40 font-bold font-sans">Debit (₹)</th>
                <th className="text-right py-2 w-40 font-bold font-sans">Credit (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {trialBalance.entries.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-slate-400">
                    No data available. Create ledgers and vouchers to generate reports.
                  </td>
                </tr>
              ) : (
                trialBalance.entries.map((entry, i) => (
                  <tr key={i}>
                    <td className="py-2">{entry.ledgerName}</td>
                    <td className="py-2 text-right">{entry.drAmount > 0 ? formatCurrency(entry.drAmount) : '-'}</td>
                    <td className="py-2 text-right">{entry.crAmount > 0 ? formatCurrency(entry.crAmount) : '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="border-t-2 border-black font-bold">
              <tr>
                <td className="py-3 font-sans">Total</td>
                <td className="py-3 text-right">{formatCurrency(trialBalance.totalDr)}</td>
                <td className="py-3 text-right">{formatCurrency(trialBalance.totalCr)}</td>
              </tr>
            </tfoot>
          </table>

          {trialBalance.entries.length > 0 && (
            <div className={`mt-4 p-3 rounded-sm text-center ${trialBalance.isBalanced ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
              {trialBalance.isBalanced ? '✓ Trial Balance is matched' : '✗ Trial Balance does not match'}
            </div>
          )}
        </Card>
      )}

      {/* Profit & Loss */}
      {activeReport === 'profitLoss' && (
        <Card className="p-8 font-mono text-sm print:shadow-none">
          <div className="text-center mb-8 pb-4 border-b-2 border-black">
            <h3 className="text-xl font-bold font-sans uppercase tracking-widest">{selectedClient?.name || 'Select Client'}</h3>
            <p className="text-slate-500 mt-1">Profit & Loss Account</p>
            <p className="text-slate-500 text-xs">For the year ending 31st March {selectedFinancialYear?.split('-')[1] || '2025'}</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Expenses (Left) */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-300 font-sans">Expenses</h4>
              <table className="w-full">
                <tbody>
                  {profitLoss.expenseItems.map((item, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-right">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  {profitLoss.netProfit > 0 && (
                    <tr className="font-bold bg-emerald-50">
                      <td className="py-2">Net Profit</td>
                      <td className="py-2 text-right">{formatCurrency(profitLoss.netProfit)}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t-2 border-black font-bold">
                  <tr>
                    <td className="py-3 font-sans">Total</td>
                    <td className="py-3 text-right">{formatCurrency(profitLoss.totalExpenses + Math.max(0, profitLoss.netProfit))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Income (Right) */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-300 font-sans">Income</h4>
              <table className="w-full">
                <tbody>
                  {profitLoss.incomeItems.map((item, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-right">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  {profitLoss.netProfit < 0 && (
                    <tr className="font-bold bg-red-50">
                      <td className="py-2">Net Loss</td>
                      <td className="py-2 text-right">{formatCurrency(Math.abs(profitLoss.netProfit))}</td>
                    </tr>
                  )}
                </tbody>
                <tfoot className="border-t-2 border-black font-bold">
                  <tr>
                    <td className="py-3 font-sans">Total</td>
                    <td className="py-3 text-right">{formatCurrency(profitLoss.totalIncome + Math.max(0, -profitLoss.netProfit))}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-sm">
            <p className="text-center font-bold font-sans">
              {profitLoss.netProfit >= 0 
                ? `Net Profit: ${formatCurrency(profitLoss.netProfit)}`
                : `Net Loss: ${formatCurrency(Math.abs(profitLoss.netProfit))}`
              }
            </p>
          </div>
        </Card>
      )}

      {/* Balance Sheet */}
      {activeReport === 'balanceSheet' && (
        <Card className="p-8 font-mono text-sm print:shadow-none">
          <div className="text-center mb-8 pb-4 border-b-2 border-black">
            <h3 className="text-xl font-bold font-sans uppercase tracking-widest">{selectedClient?.name || 'Select Client'}</h3>
            <p className="text-slate-500 mt-1">Balance Sheet</p>
            <p className="text-slate-500 text-xs">As on 31st March {selectedFinancialYear?.split('-')[1] || '2025'}</p>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Liabilities (Left) */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-300 font-sans">Liabilities & Capital</h4>
              <table className="w-full">
                <tbody>
                  {balanceSheet.capital.map((item, i) => (
                    <tr key={`cap-${i}`} className="border-b border-slate-100">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-right">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                  {balanceSheet.liabilities.map((item, i) => (
                    <tr key={`lia-${i}`} className="border-b border-slate-100">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-right">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-black font-bold">
                  <tr>
                    <td className="py-3 font-sans">Total</td>
                    <td className="py-3 text-right">{formatCurrency(balanceSheet.totalLiabilitiesAndCapital)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Assets (Right) */}
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider mb-4 pb-2 border-b border-slate-300 font-sans">Assets</h4>
              <table className="w-full">
                <tbody>
                  {balanceSheet.assets.map((item, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-2">{item.name}</td>
                      <td className="py-2 text-right">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-black font-bold">
                  <tr>
                    <td className="py-3 font-sans">Total</td>
                    <td className="py-3 text-right">{formatCurrency(balanceSheet.totalAssets)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Card>
      )}

      {/* Footer */}
      <div className="flex justify-between text-xs text-slate-400">
        <span>Generated on {new Date().toLocaleDateString('en-IN')}</span>
        <span>CA Pro Connect</span>
      </div>
    </div>
  );
};

export default Reports;
