// Voucher Entry Screen with Double-Entry Validation
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Trash2, Save, Printer, Plus, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Button, Input } from '../ui';
import { VOUCHER_TYPES, GST_RATES } from '../../constants';
import { formatCurrency, generateVoucherNumber, formatDateForInput, calculateGST } from '../../utils/formatters';
import { validateVoucherBalance } from '../../services/calculations';
import { exportVoucherPDF } from '../../services/exports';

const VoucherEntry = () => {
  const { 
    getClientLedgers, 
    getClientVouchers,
    addVoucher, 
    selectedClient, 
    selectedFinancialYear 
  } = useApp();
  
  const ledgers = getClientLedgers();
  const vouchers = getClientVouchers();
  
  const [activeType, setActiveType] = useState(VOUCHER_TYPES[0]);
  const [voucherDate, setVoucherDate] = useState(formatDateForInput(new Date()));
  const [referenceNo, setReferenceNo] = useState('');
  const [partyLedgerId, setPartyLedgerId] = useState('');
  const [narration, setNarration] = useState('');
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState({ ledgerId: '', amount: '', type: 'Cr' });
  const [gstRate, setGstRate] = useState(18);
  const [applyGst, setApplyGst] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  
  const newEntryRef = useRef(null);

  // Generate voucher number
  const voucherNo = useMemo(() => {
    return generateVoucherNumber(activeType.prefix, vouchers, selectedFinancialYear);
  }, [activeType, vouchers, selectedFinancialYear]);

  // Calculate balance
  const balance = useMemo(() => validateVoucherBalance(entries), [entries]);

  // Get party ledger (for display)
  const partyLedger = ledgers.find(l => l.id === partyLedgerId);

  // Add new entry
  const handleAddEntry = () => {
    if (!newEntry.ledgerId || !newEntry.amount) return;
    
    const ledger = ledgers.find(l => l.id === newEntry.ledgerId);
    const amount = parseFloat(newEntry.amount) || 0;
    
    const entryData = {
      id: Date.now(),
      ledgerId: newEntry.ledgerId,
      ledgerName: ledger?.name || '',
      amount: amount,
      type: newEntry.type
    };
    
    // If GST is applicable
    if (applyGst && gstRate > 0) {
      const gst = calculateGST(amount, gstRate);
      const cgstLedger = ledgers.find(l => l.name.toLowerCase().includes('cgst'));
      const sgstLedger = ledgers.find(l => l.name.toLowerCase().includes('sgst'));
      
      const newEntries = [entryData];
      
      if (cgstLedger && gst.cgst > 0) {
        newEntries.push({
          id: Date.now() + 1,
          ledgerId: cgstLedger.id,
          ledgerName: cgstLedger.name,
          amount: gst.cgst,
          type: newEntry.type
        });
      }
      
      if (sgstLedger && gst.sgst > 0) {
        newEntries.push({
          id: Date.now() + 2,
          ledgerId: sgstLedger.id,
          ledgerName: sgstLedger.name,
          amount: gst.sgst,
          type: newEntry.type
        });
      }
      
      setEntries([...entries, ...newEntries]);
    } else {
      setEntries([...entries, entryData]);
    }
    
    setNewEntry({ ledgerId: '', amount: '', type: 'Cr' });
    setApplyGst(false);
    newEntryRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddEntry();
    }
  };

  const removeEntry = (id) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const handleSave = () => {
    if (!balance.isBalanced) {
      setSaveStatus({ type: 'error', message: 'Voucher is not balanced! Debit must equal Credit.' });
      return;
    }
    
    if (entries.length === 0) {
      setSaveStatus({ type: 'error', message: 'Please add at least one entry.' });
      return;
    }

    const voucherData = {
      voucherNo,
      type: activeType.id,
      typeLabel: activeType.label,
      date: voucherDate,
      referenceNo,
      partyLedgerId,
      partyLedgerName: partyLedger?.name || '',
      narration,
      entries: entries.map(e => ({
        ledgerId: e.ledgerId,
        ledgerName: e.ledgerName,
        amount: e.amount,
        type: e.type
      })),
      totalAmount: balance.totalDr,
      clientId: selectedClient?.id
    };
    
    addVoucher(voucherData);
    
    // Reset form
    setEntries([]);
    setNarration('');
    setReferenceNo('');
    setPartyLedgerId('');
    setSaveStatus({ type: 'success', message: 'Voucher saved successfully!' });
    
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handlePrint = () => {
    if (entries.length === 0) return;
    
    const voucherData = {
      voucherNo,
      type: activeType.id,
      typeLabel: activeType.label,
      date: voucherDate,
      referenceNo,
      partyLedgerId,
      partyLedgerName: partyLedger?.name || '',
      narration,
      entries: entries.map(e => ({
        ledgerId: e.ledgerId,
        ledgerName: e.ledgerName,
        amount: e.amount,
        type: e.type
      })),
      totalAmount: balance.totalDr
    };
    
    exportVoucherPDF(voucherData, selectedClient?.name);
  };

  // Auto-add party entry when party is selected
  useEffect(() => {
    if (partyLedgerId && entries.length === 0) {
      const ledger = ledgers.find(l => l.id === partyLedgerId);
      if (ledger) {
        // For Sales/Receipt, party is usually Dr; for Purchase/Payment, party is Cr
        const partyType = ['sales', 'receipt'].includes(activeType.id) ? 'Dr' : 'Cr';
        // Just set the default type for new entries
        setNewEntry(prev => ({ ...prev, type: partyType === 'Dr' ? 'Cr' : 'Dr' }));
      }
    }
  }, [partyLedgerId]);

  return (
    <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
      {/* Voucher Type Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-md">
          {VOUCHER_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setActiveType(type);
                setEntries([]);
              }}
              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
                activeType.id === type.id 
                  ? 'bg-black text-white shadow-sm' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Voucher No</p>
          <p className="font-mono text-lg font-bold">{voucherNo}</p>
        </div>
      </div>

      {!selectedClient && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
          ⚠️ Select a client from the header to create vouchers.
        </div>
      )}

      {/* Status Message */}
      {saveStatus && (
        <div className={`p-4 rounded-sm flex items-center ${
          saveStatus.type === 'error' 
            ? 'bg-red-50 border border-red-200 text-red-700' 
            : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
        }`}>
          {saveStatus.type === 'error' ? <AlertCircle className="w-4 h-4 mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
          {saveStatus.message}
        </div>
      )}

      <Card className="p-6 border-t-4 border-t-violet-500">
        {/* Master Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Input 
            label="Voucher Date" 
            type="date" 
            value={voucherDate}
            onChange={(e) => setVoucherDate(e.target.value)}
          />
          <Input 
            label="Reference No" 
            placeholder="PO/Inv No."
            value={referenceNo}
            onChange={(e) => setReferenceNo(e.target.value)}
          />
          <div className="sm:col-span-2">
            <label className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest block">Party A/c Name</label>
            <select
              value={partyLedgerId}
              onChange={(e) => setPartyLedgerId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-sm text-sm font-semibold focus:outline-none focus:border-black"
            >
              <option value="">-- Select Party --</option>
              {ledgers.filter(l => ['Sundry Debtors', 'Sundry Creditors'].includes(l.subGroup)).map(l => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Line Items */}
        <div className="border border-slate-200 rounded-sm overflow-hidden mb-6">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-2 text-left w-12">#</th>
                <th className="px-4 py-2 text-left">Particulars</th>
                <th className="px-4 py-2 text-right w-40">Amount</th>
                <th className="px-4 py-2 text-center w-16">Dr/Cr</th>
                <th className="px-4 py-2 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry, index) => (
                <tr key={entry.id} className="group hover:bg-slate-50">
                  <td className="px-4 py-2 text-slate-400 font-mono text-xs">{index + 1}</td>
                  <td className="px-4 py-2 font-medium text-slate-800">{entry.ledgerName}</td>
                  <td className="px-4 py-2 text-right font-mono text-slate-900">{formatCurrency(entry.amount)}</td>
                  <td className="px-4 py-2 text-center text-xs font-bold text-slate-500">{entry.type}</td>
                  <td className="px-4 py-2 text-center">
                    <button onClick={() => removeEntry(entry.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Entry Row */}
              <tr className="bg-yellow-50/30">
                <td className="px-4 py-2 text-slate-300 font-mono text-xs">
                  <Plus className="w-4 h-4" />
                </td>
                <td className="px-4 py-2">
                  <select
                    ref={newEntryRef}
                    value={newEntry.ledgerId}
                    onChange={(e) => setNewEntry({...newEntry, ledgerId: e.target.value})}
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-medium"
                  >
                    <option value="">-- Select Ledger --</option>
                    {ledgers.map(l => (
                      <option key={l.id} value={l.id}>{l.name} ({l.group})</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-2 text-right">
                  <input 
                    type="number" 
                    className="w-full bg-transparent border-none focus:ring-0 p-0 text-sm font-mono text-right font-bold" 
                    placeholder="0.00"
                    value={newEntry.amount}
                    onChange={(e) => setNewEntry({...newEntry, amount: e.target.value})}
                    onKeyDown={handleKeyDown}
                  />
                </td>
                <td className="px-4 py-2 text-center">
                  <select
                    value={newEntry.type}
                    onChange={(e) => setNewEntry({...newEntry, type: e.target.value})}
                    className="bg-transparent border-none focus:ring-0 p-0 text-xs font-bold text-slate-500"
                  >
                    <option value="Dr">Dr</option>
                    <option value="Cr">Cr</option>
                  </select>
                </td>
                <td className="px-4 py-2">
                  <button 
                    onClick={handleAddEntry}
                    className="text-slate-400 hover:text-emerald-600"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </td>
              </tr>
              
              {/* GST Option Row */}
              <tr className="bg-slate-50/50 border-t">
                <td colSpan="5" className="px-4 py-2">
                  <div className="flex items-center space-x-4 text-xs">
                    <label className="flex items-center">
                      <input 
                        type="checkbox" 
                        checked={applyGst}
                        onChange={(e) => setApplyGst(e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-slate-600">Apply GST</span>
                    </label>
                    {applyGst && (
                      <select 
                        value={gstRate}
                        onChange={(e) => setGstRate(parseInt(e.target.value))}
                        className="text-xs border border-slate-200 rounded px-2 py-1"
                      >
                        {GST_RATES.filter(r => r.rate > 0).map(r => (
                          <option key={r.rate} value={r.rate}>{r.label}</option>
                        ))}
                      </select>
                    )}
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-500">Press ENTER to add entry</span>
                  </div>
                </td>
              </tr>
            </tbody>
            
            {/* Totals */}
            <tfoot className="bg-slate-50 border-t border-slate-200">
              <tr>
                <td colSpan="2" className="px-4 py-3 text-right uppercase text-[10px] font-bold tracking-widest text-slate-500">
                  Total Debit
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                  {formatCurrency(balance.totalDr)}
                </td>
                <td colSpan="2" className="px-4 py-3 text-center">
                  <span className="text-xs font-bold text-slate-400">Dr</span>
                </td>
              </tr>
              <tr>
                <td colSpan="2" className="px-4 py-3 text-right uppercase text-[10px] font-bold tracking-widest text-slate-500">
                  Total Credit
                </td>
                <td className="px-4 py-3 text-right font-mono font-bold text-slate-900">
                  {formatCurrency(balance.totalCr)}
                </td>
                <td colSpan="2" className="px-4 py-3 text-center">
                  <span className="text-xs font-bold text-slate-400">Cr</span>
                </td>
              </tr>
              <tr className={balance.isBalanced ? 'bg-emerald-50' : 'bg-red-50'}>
                <td colSpan="2" className="px-4 py-3 text-right uppercase text-[10px] font-bold tracking-widest">
                  {balance.isBalanced ? (
                    <span className="text-emerald-600 flex items-center justify-end">
                      <CheckCircle2 className="w-4 h-4 mr-1" /> Balanced
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center justify-end">
                      <AlertCircle className="w-4 h-4 mr-1" /> Difference
                    </span>
                  )}
                </td>
                <td className={`px-4 py-3 text-right font-mono font-bold ${balance.isBalanced ? 'text-emerald-700' : 'text-red-700'}`}>
                  {formatCurrency(balance.difference)}
                </td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-end justify-between gap-6">
          <div className="w-full sm:w-1/2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 block">Narration</label>
            <textarea 
              className="w-full border border-slate-200 rounded-sm p-3 text-sm h-20 focus:outline-none focus:border-black transition-all font-mono" 
              placeholder="Enter narration..."
              value={narration}
              onChange={(e) => setNarration(e.target.value)}
            />
          </div>
          <div className="flex space-x-3 w-full sm:w-auto">
            <Button variant="secondary" icon={Printer} onClick={handlePrint}>Print</Button>
            <Button 
              icon={Save} 
              onClick={handleSave}
              disabled={!balance.isBalanced || entries.length === 0}
            >
              Save Voucher
            </Button>
          </div>
        </div>
      </Card>
      
      <div className="flex justify-center text-xs text-slate-400 mt-4 font-mono space-x-4">
        <span>ENTER: Add Row</span>
        <span>•</span>
        <span>DEL: Remove Row</span>
        <span>•</span>
        <span>Ctrl+S: Save</span>
      </div>
    </div>
  );
};

export default VoucherEntry;
