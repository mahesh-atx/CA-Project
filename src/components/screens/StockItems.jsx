// Stock Items Management Screen
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Package, Edit2, Trash2, X, ChevronDown, ArrowUpDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, Input, ShortcutBar } from '../ui';
import { STOCK_GROUPS, STOCK_UNITS, STOCK_VALUATION_METHODS, GST_RATES } from '../../constants';
import { getStockItems, saveStockItem, deleteStockItem, getStockGroups, calculateStockBalance } from '../../services/inventory';
import { formatCurrency } from '../../utils/formatters';

const StockItems = () => {
  const { selectedClient, getClientVouchers } = useApp();
  const vouchers = getClientVouchers();
  
  const [items, setItems] = useState([]);
  const [customGroups, setCustomGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [filterGroup, setFilterGroup] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    group: 'trading-goods',
    unit: 'nos',
    openingQty: 0,
    openingRate: 0,
    openingValue: 0,
    gstRate: 18,
    hsnCode: '',
    valuationMethod: 'avg',
    reorderLevel: 0,
    minQty: 0,
    maxQty: 0
  });

  // Load data
  useEffect(() => {
    if (selectedClient) {
      setItems(getStockItems(selectedClient.id));
      setCustomGroups(getStockGroups(selectedClient.id));
    }
  }, [selectedClient]);

  // All groups (predefined + custom)
  const allGroups = useMemo(() => {
    return [...STOCK_GROUPS, ...customGroups];
  }, [customGroups]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items
      .filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.alias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.hsnCode?.includes(searchTerm);
        const matchesGroup = !filterGroup || item.group === filterGroup;
        return matchesSearch && matchesGroup;
      })
      .map(item => ({
        ...item,
        balance: calculateStockBalance(item.id, vouchers)
      }));
  }, [items, searchTerm, filterGroup, vouchers]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredItems.reduce((acc, item) => ({
      items: acc.items + 1,
      qty: acc.qty + (item.balance?.closing || 0),
      value: acc.value + ((item.balance?.closing || 0) * (item.openingRate || 0))
    }), { items: 0, qty: 0, value: 0 });
  }, [filteredItems]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    const itemData = {
      ...formData,
      clientId: selectedClient.id,
      openingQty: parseFloat(formData.openingQty) || 0,
      openingRate: parseFloat(formData.openingRate) || 0,
      openingValue: (parseFloat(formData.openingQty) || 0) * (parseFloat(formData.openingRate) || 0)
    };

    if (editingItem) {
      saveStockItem({ ...editingItem, ...itemData });
    } else {
      saveStockItem(itemData);
    }

    setItems(getStockItems(selectedClient.id));
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '', alias: '', group: 'trading-goods', unit: 'nos',
      openingQty: 0, openingRate: 0, openingValue: 0, gstRate: 18,
      hsnCode: '', valuationMethod: 'avg', reorderLevel: 0, minQty: 0, maxQty: 0
    });
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name || '',
      alias: item.alias || '',
      group: item.group || 'trading-goods',
      unit: item.unit || 'nos',
      openingQty: item.openingQty || 0,
      openingRate: item.openingRate || 0,
      openingValue: item.openingValue || 0,
      gstRate: item.gstRate || 18,
      hsnCode: item.hsnCode || '',
      valuationMethod: item.valuationMethod || 'avg',
      reorderLevel: item.reorderLevel || 0,
      minQty: item.minQty || 0,
      maxQty: item.maxQty || 0
    });
    setEditingItem(item);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this stock item?')) {
      deleteStockItem(id);
      setItems(getStockItems(selectedClient.id));
    }
  };

  const getGroupName = (groupId) => {
    return allGroups.find(g => g.id === groupId)?.name || groupId;
  };

  const getUnitName = (unitId) => {
    return STOCK_UNITS.find(u => u.id === unitId)?.name || unitId;
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-indigo-500" />
            Stock Items
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {selectedClient?.name || 'Select a client'} • {items.length} items
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
          >
            <option value="">All Groups</option>
            {allGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-sm focus:outline-none focus:border-black"
            />
          </div>
          <Button icon={Plus} onClick={() => setShowForm(true)} disabled={!selectedClient}>
            Add Item
          </Button>
        </div>
      </div>

      {!selectedClient && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
          ⚠️ Select a client from the header to manage stock items.
        </div>
      )}

      {/* Form */}
      {showForm && (
        <Card className="p-6 border-t-4 border-t-indigo-500">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
              {editingItem ? 'Edit Stock Item' : 'Create Stock Item'}
            </h3>
            <button onClick={resetForm} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Input
                label="Item Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Product A"
                required
              />
              <Input
                label="Alias / Short Name"
                value={formData.alias}
                onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                placeholder="PA"
              />
              <div className="flex flex-col">
                <label className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Group</label>
                <select
                  value={formData.group}
                  onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
                >
                  {allGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
                >
                  {STOCK_UNITS.map(u => <option key={u.id} value={u.id}>{u.name} ({u.fullName})</option>)}
                </select>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mb-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Opening Stock</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Opening Qty"
                  type="number"
                  value={formData.openingQty}
                  onChange={(e) => setFormData({ ...formData, openingQty: e.target.value })}
                />
                <Input
                  label="Rate per Unit (₹)"
                  type="number"
                  value={formData.openingRate}
                  onChange={(e) => setFormData({ ...formData, openingRate: e.target.value })}
                />
                <div className="flex flex-col">
                  <label className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Value</label>
                  <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-sm text-sm font-mono">
                    {formatCurrency((formData.openingQty || 0) * (formData.openingRate || 0))}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mb-6">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">GST & Other Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <label className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">GST Rate</label>
                  <select
                    value={formData.gstRate}
                    onChange={(e) => setFormData({ ...formData, gstRate: parseInt(e.target.value) })}
                    className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
                  >
                    {GST_RATES.map(r => <option key={r.rate} value={r.rate}>{r.label}</option>)}
                  </select>
                </div>
                <Input
                  label="HSN/SAC Code"
                  value={formData.hsnCode}
                  onChange={(e) => setFormData({ ...formData, hsnCode: e.target.value })}
                  placeholder="8 digits"
                  maxLength={8}
                />
                <div className="flex flex-col">
                  <label className="mb-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Valuation</label>
                  <select
                    value={formData.valuationMethod}
                    onChange={(e) => setFormData({ ...formData, valuationMethod: e.target.value })}
                    className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
                  >
                    {STOCK_VALUATION_METHODS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <Input
                  label="Reorder Level"
                  type="number"
                  value={formData.reorderLevel}
                  onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <Button type="button" variant="secondary" onClick={resetForm}>Cancel</Button>
              <Button type="submit">{editingItem ? 'Update' : 'Create'} Item</Button>
            </div>
          </form>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Items</p>
          <p className="text-2xl font-bold font-mono text-slate-900">{totals.items}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Qty</p>
          <p className="text-2xl font-bold font-mono text-slate-900">{totals.qty.toLocaleString()}</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Value</p>
          <p className="text-2xl font-bold font-mono text-emerald-600">{formatCurrency(totals.value)}</p>
        </Card>
      </div>

      {/* Items Table */}
      <Card className="overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{searchTerm ? 'No items found' : 'No stock items yet'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left">Item Name</th>
                  <th className="px-4 py-3 text-left">Group</th>
                  <th className="px-4 py-3 text-right">Stock Qty</th>
                  <th className="px-4 py-3 text-center">Unit</th>
                  <th className="px-4 py-3 text-right">Rate</th>
                  <th className="px-4 py-3 text-right">Value</th>
                  <th className="px-4 py-3 text-center">GST</th>
                  <th className="px-4 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 group">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{item.name}</p>
                      {item.alias && <p className="text-[10px] text-slate-400">{item.alias}</p>}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{getGroupName(item.group)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold">
                      <span className={item.balance?.closing < (item.reorderLevel || 0) ? 'text-red-600' : 'text-slate-900'}>
                        {item.balance?.closing || 0}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-xs font-mono text-slate-500">{getUnitName(item.unit)}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-600">{formatCurrency(item.openingRate || 0)}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-600">
                      {formatCurrency((item.balance?.closing || 0) * (item.openingRate || 0))}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <Badge type="neutral">{item.gstRate}%</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100">
                        <button onClick={() => handleEdit(item)} className="p-1 text-slate-400 hover:text-blue-600">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="p-1 text-slate-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <ShortcutBar context="default" />
    </div>
  );
};

export default StockItems;
