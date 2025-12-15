// GST Dashboard
import React, { useMemo } from 'react';
import { Download, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Button } from '../ui';
import { formatCurrency } from '../../utils/formatters';
import { calculateGSTSummary } from '../../services/calculations';

const GSTDashboard = () => {
  const { getClientLedgers, getClientVouchers, selectedClient } = useApp();
  const ledgers = getClientLedgers();
  const vouchers = getClientVouchers();
  
  const gstSummary = useMemo(() => calculateGSTSummary(vouchers, ledgers), [vouchers, ledgers]);

  const filingStatus = [
    { m: 'Sep', r: 'GSTR-1', arn: 'AA271023004567', s: 'Filed' },
    { m: 'Sep', r: 'GSTR-3B', arn: 'AA271023004599', s: 'Filed' },
    { m: 'Oct', r: 'GSTR-1', arn: 'AA271123001234', s: 'Filed' },
    { m: 'Oct', r: 'GSTR-3B', arn: '-', s: 'Pending' },
    { m: 'Nov', r: 'GSTR-1', arn: '-', s: 'Pending' },
    { m: 'Nov', r: 'GSTR-3B', arn: '-', s: 'Pending' },
  ];

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">GST Compliance Portal</h2>
          {selectedClient && (
            <p className="text-xs text-slate-500 mt-1 font-mono">
              GSTIN: {selectedClient.gstin || 'N/A'} • {new Date().toLocaleString('default', { month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" icon={Download}>GSTR-2B</Button>
          <Button icon={ArrowUpRight}>File GSTR-3B</Button>
        </div>
      </div>

      {!selectedClient && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
          ⚠️ Select a client from the header to view their GST data.
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-l-4 border-l-red-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Output GST</p>
          <h3 className="text-2xl font-mono font-bold text-slate-900 mb-2">{formatCurrency(gstSummary.totalOutput)}</h3>
          <div className="text-xs text-slate-500 space-y-1">
            <p>CGST: {formatCurrency(gstSummary.outputCGST)}</p>
            <p>SGST: {formatCurrency(gstSummary.outputSGST)}</p>
            <p>IGST: {formatCurrency(gstSummary.outputIGST)}</p>
          </div>
        </Card>
        
        <Card className="p-6 border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">ITC Available</p>
          <h3 className="text-2xl font-mono font-bold text-slate-900 mb-2">{formatCurrency(gstSummary.totalInput)}</h3>
          <div className="text-xs text-slate-500 space-y-1">
            <p>CGST: {formatCurrency(gstSummary.inputCGST)}</p>
            <p>SGST: {formatCurrency(gstSummary.inputSGST)}</p>
            <p>IGST: {formatCurrency(gstSummary.inputIGST)}</p>
          </div>
        </Card>

        <Card className="p-6 border-l-4 border-l-slate-800 bg-slate-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Net Payable</p>
          <h3 className={`text-2xl font-mono font-bold mb-2 ${gstSummary.netPayable >= 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {formatCurrency(Math.abs(gstSummary.netPayable))}
            {gstSummary.netPayable < 0 && <span className="text-xs ml-2">(Refund)</span>}
          </h3>
          <div className="mt-2">
            <Button className="w-full text-xs h-8">
              {gstSummary.netPayable > 0 ? 'Create Challan' : 'Claim Refund'}
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Filing Status */}
        <Card>
          <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Filing Status (FY 24-25)</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left">Period</th>
                <th className="px-4 py-2 text-left">Return</th>
                <th className="px-4 py-2 text-left">ARN</th>
                <th className="px-4 py-2 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-xs">
              {filingStatus.map((row, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 text-slate-600">{row.m} 2024</td>
                  <td className="px-4 py-3 font-bold text-slate-900">{row.r}</td>
                  <td className="px-4 py-3 text-slate-500">{row.arn}</td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-1 rounded-sm ${row.s === 'Filed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                      {row.s}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* GST Breakdown */}
        <Card className="p-6">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-4">GST Calculation Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 border border-red-100 rounded-sm">
              <span className="text-xs font-semibold text-slate-600">Output GST (Collected)</span>
              <span className="font-mono font-bold text-red-600">{formatCurrency(gstSummary.totalOutput)}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 border border-emerald-100 rounded-sm">
              <span className="text-xs font-semibold text-slate-600">Input GST (Paid)</span>
              <span className="font-mono font-bold text-emerald-600">(-) {formatCurrency(gstSummary.totalInput)}</span>
            </div>
            <div className="border-t-2 border-slate-300 pt-3">
              <div className="flex justify-between items-center p-3 bg-slate-100 border border-slate-200 rounded-sm">
                <span className="text-xs font-bold text-slate-700">Net GST Payable</span>
                <span className={`font-mono font-bold ${gstSummary.netPayable >= 0 ? 'text-slate-900' : 'text-emerald-600'}`}>
                  {formatCurrency(gstSummary.netPayable)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-xs text-slate-500">
            <p className="font-bold mb-2">Note:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Output GST is collected on sales/services</li>
              <li>Input GST is paid on purchases (ITC)</li>
              <li>Net Payable = Output - Input</li>
              <li>If negative, you can claim refund</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GSTDashboard;
