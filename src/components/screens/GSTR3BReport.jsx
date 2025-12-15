// GSTR-3B Report Screen (Summary Return)
import React, { useState, useMemo } from 'react';
import { FileBarChart, Download, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, ShortcutBar } from '../ui';
import { generateGSTR3BReport } from '../../services/gstReports';
import { formatCurrency } from '../../utils/formatters';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const GSTR3BReport = () => {
  const { getClientVouchers, getClientLedgers, selectedClient, selectedFinancialYear } = useApp();
  const vouchers = getClientVouchers();
  const ledgers = getClientLedgers();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Calculate period
  const period = useMemo(() => {
    const startDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
    const endDate = new Date(selectedYear, selectedMonth + 1, 0).toISOString().split('T')[0];
    return { startDate, endDate };
  }, [selectedMonth, selectedYear]);

  // Generate report
  const report = useMemo(() => {
    return generateGSTR3BReport(vouchers, ledgers, period);
  }, [vouchers, ledgers, period]);

  const totalTaxPayable = report.taxPayable.igst + report.taxPayable.cgst + report.taxPayable.sgst;
  const totalITC = report.eligibleITC.netITC.igst + report.eligibleITC.netITC.cgst + report.eligibleITC.netITC.sgst;
  const totalCashPayable = report.taxPaidCash.igst + report.taxPaidCash.cgst + report.taxPaidCash.sgst;

  const TaxRow = ({ label, igst, cgst, sgst, cess, isTotal = false, highlight = false }) => (
    <tr className={`${isTotal ? 'font-bold bg-slate-50' : ''} ${highlight ? 'bg-emerald-50' : ''}`}>
      <td className={`px-4 py-3 ${isTotal ? 'text-slate-800' : 'text-slate-600'}`}>{label}</td>
      <td className="px-4 py-3 text-right font-mono text-purple-600">{formatCurrency(igst)}</td>
      <td className="px-4 py-3 text-right font-mono text-blue-600">{formatCurrency(cgst)}</td>
      <td className="px-4 py-3 text-right font-mono text-green-600">{formatCurrency(sgst)}</td>
      <td className="px-4 py-3 text-right font-mono text-slate-500">{formatCurrency(cess)}</td>
    </tr>
  );

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <FileBarChart className="w-5 h-5 mr-2 text-blue-500" />
            GSTR-3B Summary
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {selectedClient?.name || 'Select a client'} • Monthly Summary Return
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
          >
            {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
          <Button variant="secondary" icon={Download}>Export</Button>
        </div>
      </div>

      {!selectedClient && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
          ⚠️ Select a client from the header to generate GSTR-3B.
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-orange-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Outward Supplies</p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">
            {formatCurrency(report.outwardSupplies.taxableOutward.taxableValue)}
          </p>
          <p className="text-xs text-slate-500">Taxable Value</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Tax Payable</p>
          <p className="text-xl font-bold font-mono text-red-600 mt-1">{formatCurrency(totalTaxPayable)}</p>
          <p className="text-xs text-slate-500">Output Tax</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Input Tax Credit</p>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-1">{formatCurrency(totalITC)}</p>
          <p className="text-xs text-slate-500">Available ITC</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-violet-500 bg-violet-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Net Payable (Cash)</p>
          <p className="text-xl font-bold font-mono text-violet-700 mt-1">{formatCurrency(totalCashPayable)}</p>
          <p className="text-xs text-violet-600">After ITC Utilization</p>
        </Card>
      </div>

      {/* Section 3.1 - Outward Supplies */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-slate-800 text-white">
          <h3 className="font-bold">3.1 Tax on Outward and Reverse Charge Inward Supplies</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Nature of Supplies</th>
                <th className="px-4 py-3 text-right">IGST</th>
                <th className="px-4 py-3 text-right">CGST</th>
                <th className="px-4 py-3 text-right">SGST</th>
                <th className="px-4 py-3 text-right">Cess</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TaxRow label="(a) Outward taxable supplies (other than zero rated, nil rated and exempted)" 
                {...report.outwardSupplies.taxableOutward} />
              <TaxRow label="(b) Outward taxable supplies (zero rated)" 
                {...report.outwardSupplies.zeroRated} />
              <TaxRow label="(c) Other outward supplies (Nil rated, exempted)" 
                {...report.outwardSupplies.nilRated} />
              <TaxRow label="(d) Inward supplies (liable to reverse charge)" 
                {...report.outwardSupplies.inwardReverseCharge} />
              <TaxRow label="(e) Non-GST outward supplies" 
                {...report.outwardSupplies.nonGST} />
            </tbody>
          </table>
        </div>
      </Card>

      {/* Section 4 - Eligible ITC */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-emerald-800 text-white">
          <h3 className="font-bold">4. Eligible ITC</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Details</th>
                <th className="px-4 py-3 text-right">IGST</th>
                <th className="px-4 py-3 text-right">CGST</th>
                <th className="px-4 py-3 text-right">SGST</th>
                <th className="px-4 py-3 text-right">Cess</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TaxRow label="(A) ITC Available" {...report.eligibleITC.itcAvailable} />
              <TaxRow label="(B) ITC Reversed" {...report.eligibleITC.itcReversed} />
              <TaxRow label="(C) Net ITC Available (A) - (B)" {...report.eligibleITC.netITC} isTotal highlight />
              <TaxRow label="(D) Ineligible ITC" {...report.eligibleITC.ineligibleITC} />
            </tbody>
          </table>
        </div>
      </Card>

      {/* Section 6 - Payment of Tax */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-violet-800 text-white">
          <h3 className="font-bold">6. Payment of Tax</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b">
              <tr>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-right">IGST</th>
                <th className="px-4 py-3 text-right">CGST</th>
                <th className="px-4 py-3 text-right">SGST</th>
                <th className="px-4 py-3 text-right">Cess</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <TaxRow label="(a) Tax Payable" {...report.taxPayable} isTotal />
              <TaxRow label="(b) Tax Paid through ITC" {...report.taxPaidITC} highlight />
              <TaxRow label="(c) Tax Paid in Cash" {...report.taxPaidCash} isTotal />
            </tbody>
          </table>
        </div>
      </Card>

      {/* Filing Status */}
      <Card className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <AlertCircle className="w-8 h-8 text-amber-500" />
          <div>
            <h4 className="font-bold text-slate-900">Filing Status: Not Filed</h4>
            <p className="text-xs text-slate-500">
              Due date for {MONTHS[selectedMonth]} {selectedYear}: 20th {MONTHS[(selectedMonth + 1) % 12]}
            </p>
          </div>
        </div>
        <Button>Mark as Filed</Button>
      </Card>

      <ShortcutBar context="default" />
    </div>
  );
};

export default GSTR3BReport;
