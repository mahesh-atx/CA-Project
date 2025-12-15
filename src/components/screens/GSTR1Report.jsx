// GSTR-1 Report Screen (Outward Supplies)
import React, { useState, useMemo } from 'react';
import { FileText, Download, Calendar, ChevronDown, ChevronRight, Filter } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, ShortcutBar } from '../ui';
import { generateGSTR1Report } from '../../services/gstReports';
import { formatCurrency, formatDate } from '../../utils/formatters';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const GSTR1Report = () => {
  const { getClientVouchers, getClientLedgers, selectedClient, selectedFinancialYear } = useApp();
  const vouchers = getClientVouchers();
  const ledgers = getClientLedgers();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [expandedSection, setExpandedSection] = useState('b2b');

  // Calculate period
  const period = useMemo(() => {
    const startDate = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-01`;
    const endDate = new Date(selectedYear, selectedMonth + 1, 0).toISOString().split('T')[0];
    return { startDate, endDate };
  }, [selectedMonth, selectedYear]);

  // Generate report
  const report = useMemo(() => {
    return generateGSTR1Report(vouchers, ledgers, period);
  }, [vouchers, ledgers, period]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const renderTable = (items, title) => {
    if (items.length === 0) {
      return <p className="text-sm text-slate-400 italic py-4">No records for this category</p>;
    }

    return (
      <table className="w-full text-xs">
        <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-500">
          <tr>
            <th className="px-3 py-2 text-left">Invoice No</th>
            <th className="px-3 py-2 text-left">Date</th>
            <th className="px-3 py-2 text-left">Customer</th>
            <th className="px-3 py-2 text-left">GSTIN</th>
            <th className="px-3 py-2 text-right">Taxable</th>
            <th className="px-3 py-2 text-right">CGST</th>
            <th className="px-3 py-2 text-right">SGST</th>
            <th className="px-3 py-2 text-right">IGST</th>
            <th className="px-3 py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 font-mono">
          {items.map((item, idx) => (
            <tr key={idx} className="hover:bg-slate-50">
              <td className="px-3 py-2 font-bold">{item.invoiceNo}</td>
              <td className="px-3 py-2 text-slate-600">{formatDate(item.invoiceDate)}</td>
              <td className="px-3 py-2 font-sans text-slate-800">{item.customerName}</td>
              <td className="px-3 py-2 text-slate-500">{item.gstin || '-'}</td>
              <td className="px-3 py-2 text-right">{formatCurrency(item.taxableValue)}</td>
              <td className="px-3 py-2 text-right text-blue-600">{formatCurrency(item.cgst)}</td>
              <td className="px-3 py-2 text-right text-green-600">{formatCurrency(item.sgst)}</td>
              <td className="px-3 py-2 text-right text-purple-600">{formatCurrency(item.igst)}</td>
              <td className="px-3 py-2 text-right font-bold">{formatCurrency(item.totalValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const sections = [
    { id: 'b2b', title: 'B2B Invoices', subtitle: 'Supplies to registered persons', data: report.b2b },
    { id: 'b2cLarge', title: 'B2C Large', subtitle: 'Inter-State supplies > ₹2.5L', data: report.b2cLarge },
    { id: 'b2cSmall', title: 'B2C Small', subtitle: 'Other B2C supplies', data: report.b2cSmall },
    { id: 'creditDebitNotes', title: 'Credit/Debit Notes', subtitle: 'Amendments', data: report.creditDebitNotes },
    { id: 'exports', title: 'Exports', subtitle: 'Zero rated supplies', data: report.exports },
    { id: 'nilRated', title: 'Nil Rated/Exempt', subtitle: 'Non-taxable supplies', data: report.nilRated },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-orange-500" />
            GSTR-1 Report
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {selectedClient?.name || 'Select a client'} • Outward Supplies
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
          <Button variant="secondary" icon={Download}>Export JSON</Button>
        </div>
      </div>

      {!selectedClient && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
          ⚠️ Select a client from the header to generate GSTR-1.
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 text-center border-l-4 border-l-blue-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase">B2B Invoices</p>
          <p className="text-lg font-bold font-mono mt-1">{report.b2b.totals.count}</p>
          <p className="text-xs text-slate-500">{formatCurrency(report.b2b.totals.totalValue)}</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase">B2C Supplies</p>
          <p className="text-lg font-bold font-mono mt-1">{report.b2cSmall.totals.count + report.b2cLarge.totals.count}</p>
          <p className="text-xs text-slate-500">{formatCurrency(report.b2cSmall.totals.totalValue + report.b2cLarge.totals.totalValue)}</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-violet-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Taxable Value</p>
          <p className="text-lg font-bold font-mono mt-1 text-violet-600">{formatCurrency(report.grandTotals.taxableValue)}</p>
        </Card>
        <Card className="p-4 text-center border-l-4 border-l-orange-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase">Total GST</p>
          <p className="text-lg font-bold font-mono mt-1 text-orange-600">
            {formatCurrency(report.grandTotals.cgst + report.grandTotals.sgst + report.grandTotals.igst)}
          </p>
        </Card>
        <Card className="p-4 text-center bg-slate-800 text-white">
          <p className="text-[10px] font-bold text-slate-300 uppercase">Total Value</p>
          <p className="text-lg font-bold font-mono mt-1">{formatCurrency(report.grandTotals.totalValue)}</p>
        </Card>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <Card key={section.id} className="overflow-hidden">
          <div 
            className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center cursor-pointer hover:bg-slate-100"
            onClick={() => toggleSection(section.id)}
          >
            <div className="flex items-center space-x-3">
              {expandedSection === section.id ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <div>
                <h3 className="font-bold text-slate-900">{section.title}</h3>
                <p className="text-xs text-slate-500">{section.subtitle}</p>
              </div>
            </div>
            <div className="text-right">
              <Badge type={section.data.totals.count > 0 ? 'success' : 'neutral'}>
                {section.data.totals.count} records
              </Badge>
              <p className="text-xs font-mono mt-1">{formatCurrency(section.data.totals.totalValue)}</p>
            </div>
          </div>
          {expandedSection === section.id && (
            <div className="overflow-x-auto">
              {renderTable(section.data.items, section.title)}
            </div>
          )}
        </Card>
      ))}

      <ShortcutBar context="default" />
    </div>
  );
};

export default GSTR1Report;
