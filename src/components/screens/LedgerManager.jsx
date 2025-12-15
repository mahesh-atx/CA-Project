// Ledger Manager Screen
import React, { useState, useMemo } from 'react';
import { Search, Plus, ChevronRight, X, Edit2, Trash2, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, Input } from '../ui';
import { LEDGER_GROUPS, GST_RATES } from '../../constants';

const LedgerManager = () => {
  const { getClientLedgers, addLedger, updateLedger, removeLedger, selectedClient } = useApp();
  const ledgers = getClientLedgers();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingLedger, setEditingLedger] = useState(null);
  const [expandedGroups, setExpandedGroups] = useState(new Set(['Current Assets', 'Current Liabilities']));
  
  const [formData, setFormData] = useState({
    name: '',
    group: 'Current Assets',
    subGroup: '',
    openingBalance: 0,
    openingBalanceType: 'Dr',
    gstApplicable: false,
    gstRate: 18
  });

  // Group ledgers by their group
  const groupedLedgers = useMemo(() => {
    const filtered = ledgers.filter(l => 
      l.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const grouped = {};
    filtered.forEach(ledger => {
      const group = ledger.group || 'Uncategorized';
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(ledger);
    });
    
    return grouped;
  }, [ledgers, searchTerm]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.group) return;
    
    const ledgerData = {
      ...formData,
      clientId: selectedClient?.id,
      openingBalance: parseFloat(formData.openingBalance) || 0
    };
    
    if (editingLedger) {
      updateLedger({ ...editingLedger, ...ledgerData });
    } else {
      addLedger(ledgerData);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', group: 'Current Assets', subGroup: '', openingBalance: 0, openingBalanceType: 'Dr', gstApplicable: false, gstRate: 18 });
    setEditingLedger(null);
    setShowForm(false);
  };

  const handleEdit = (ledger) => {
    setFormData({
      name: ledger.name || '',
      group: ledger.group || 'Current Assets',
      subGroup: ledger.subGroup || '',
      openingBalance: ledger.openingBalance || 0,
      openingBalanceType: ledger.openingBalanceType || 'Dr',
      gstApplicable: ledger.gstApplicable || false,
      gstRate: ledger.gstRate || 18
    });
    setEditingLedger(ledger);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this ledger?')) {
      removeLedger(id);
    }
  };

  const toggleGroup = (group) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(group)) {
      newExpanded.delete(group);
    } else {
      newExpanded.add(group);
    }
    setExpandedGroups(newExpanded);
  };

  const getSubGroups = (group) => {
    return LEDGER_GROUPS[group]?.subGroups || [];
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Chart of Accounts</h2>
          {selectedClient && (
            <p className="text-xs text-slate-500 mt-1">Client: {selectedClient.name}</p>
          )}
        </div>
        <div className="flex space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search ledgers..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:border-black transition-all" 
            />
          </div>
          <Button icon={Plus} onClick={() => setShowForm(true)}>Add Ledger</Button>
        </div>
      </div>

      {!selectedClient && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
          ⚠️ Select a client from the header to manage their ledgers.
        </div>
      )}

      {/* Form */}
      {showForm && (
        <Card className="p-6 border-t-4 border-t-emerald-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              {editingLedger ? 'Edit Ledger' : 'Create Ledger'}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input 
              label="Ledger Name *" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g., Cash in Hand"
              required
            />
            <div className="flex flex-col">
              <label className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Group *</label>
              <select 
                value={formData.group}
                onChange={(e) => setFormData({...formData, group: e.target.value, subGroup: ''})}
                className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
              >
                {Object.keys(LEDGER_GROUPS).map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            {getSubGroups(formData.group).length > 0 && (
              <div className="flex flex-col">
                <label className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Sub-Group</label>
                <select 
                  value={formData.subGroup}
                  onChange={(e) => setFormData({...formData, subGroup: e.target.value})}
                  className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
                >
                  <option value="">-- Select --</option>
                  {getSubGroups(formData.group).map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
            <Input 
              label="Opening Balance" 
              type="number"
              value={formData.openingBalance}
              onChange={(e) => setFormData({...formData, openingBalance: e.target.value})}
              placeholder="0.00"
            />
            <div className="flex flex-col">
              <label className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Balance Type</label>
              <select 
                value={formData.openingBalanceType}
                onChange={(e) => setFormData({...formData, openingBalanceType: e.target.value})}
                className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
              >
                <option value="Dr">Debit (Dr)</option>
                <option value="Cr">Credit (Cr)</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">GST Applicable</label>
              <div className="flex items-center space-x-4 py-2">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={formData.gstApplicable}
                    onChange={(e) => setFormData({...formData, gstApplicable: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm">Yes</span>
                </label>
                {formData.gstApplicable && (
                  <select 
                    value={formData.gstRate}
                    onChange={(e) => setFormData({...formData, gstRate: parseInt(e.target.value)})}
                    className="px-2 py-1 border border-slate-200 rounded-sm text-sm"
                  >
                    {GST_RATES.map(r => <option key={r.rate} value={r.rate}>{r.label}</option>)}
                  </select>
                )}
              </div>
            </div>
            <div className="md:col-span-3 flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
              <Button type="submit">{editingLedger ? 'Update' : 'Create'} Ledger</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Ledger List */}
      <Card className="overflow-hidden">
        {Object.keys(groupedLedgers).length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            {searchTerm ? 'No ledgers found' : 'No ledgers yet. Click "Add Ledger" to create one.'}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {Object.entries(LEDGER_GROUPS).map(([group, info]) => {
              const groupLedgers = groupedLedgers[group] || [];
              if (groupLedgers.length === 0 && searchTerm) return null;
              
              return (
                <div key={group}>
                  <button
                    onClick={() => toggleGroup(group)}
                    className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expandedGroups.has(group) ? '' : '-rotate-90'}`} />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">{group}</span>
                      <Badge type={info.type === 'Asset' || info.type === 'Expense' ? 'brand' : info.type === 'Income' ? 'success' : 'neutral'}>
                        {info.nature}
                      </Badge>
                    </div>
                    <span className="text-xs text-slate-400">{groupLedgers.length} ledgers</span>
                  </button>
                  
                  {expandedGroups.has(group) && groupLedgers.length > 0 && (
                    <div className="bg-white">
                      {groupLedgers.map(ledger => (
                        <div 
                          key={ledger.id}
                          className="flex items-center justify-between px-6 py-3 border-b border-slate-50 hover:bg-slate-50 group"
                        >
                          <div className="flex items-center space-x-4">
                            <ChevronRight className="w-3 h-3 text-slate-300" />
                            <div>
                              <p className="font-medium text-slate-800">{ledger.name}</p>
                              {ledger.subGroup && (
                                <p className="text-[10px] text-slate-400 uppercase">{ledger.subGroup}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="text-sm font-mono text-slate-500">
                              ₹{(ledger.openingBalance || 0).toLocaleString('en-IN')} {ledger.openingBalanceType}
                            </span>
                            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100">
                              <button onClick={() => handleEdit(ledger)} className="p-1 text-slate-400 hover:text-blue-600">
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(ledger.id)} className="p-1 text-slate-400 hover:text-red-600">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default LedgerManager;
