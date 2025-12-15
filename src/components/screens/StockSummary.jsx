// Stock Summary Report Screen
import React, { useState, useEffect, useMemo } from 'react';
import { Package, Download, FileSpreadsheet, Filter, TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, Badge, Button, ShortcutBar } from '../ui';
import { STOCK_GROUPS, STOCK_UNITS } from '../../constants';
import { getStockItems, getStockGroups, generateStockSummary } from '../../services/inventory';
import { formatCurrency } from '../../utils/formatters';

const StockSummary = () => {
  const { selectedClient, getClientVouchers, selectedFinancialYear } = useApp();
  const vouchers = getClientVouchers();
  
  const [items, setItems] = useState([]);
  const [customGroups, setCustomGroups] = useState([]);
  const [viewMode, setViewMode] = useState('summary'); // summary, detailed, group
  const [filterGroup, setFilterGroup] = useState('');

  // Load data
  useEffect(() => {
    if (selectedClient) {
      const stockSummary = generateStockSummary(selectedClient.id, vouchers);
      setItems(stockSummary);
      setCustomGroups(getStockGroups(selectedClient.id));
    }
  }, [selectedClient, vouchers]);

  // All groups
  const allGroups = useMemo(() => {
    return [...STOCK_GROUPS, ...customGroups];
  }, [customGroups]);

  // Filter & calculate
  const filteredItems = useMemo(() => {
    return items.filter(item => !filterGroup || item.group === filterGroup);
  }, [items, filterGroup]);

  // Totals
  const totals = useMemo(() => {
    return filteredItems.reduce((acc, item) => ({
      openingQty: acc.openingQty + (item.opening || 0),
      openingValue: acc.openingValue + ((item.opening || 0) * (item.openingRate || 0)),
      inwardQty: acc.inwardQty + (item.inward || 0),
      outwardQty: acc.outwardQty + (item.outward || 0),
      closingQty: acc.closingQty + (item.closing || 0),
      closingValue: acc.closingValue + (item.value || 0)
    }), { openingQty: 0, openingValue: 0, inwardQty: 0, outwardQty: 0, closingQty: 0, closingValue: 0 });
  }, [filteredItems]);

  // Group-wise summary
  const groupSummary = useMemo(() => {
    const groups = {};
    filteredItems.forEach(item => {
      const group = item.group || 'uncategorized';
      if (!groups[group]) {
        groups[group] = { count: 0, qty: 0, value: 0 };
      }
      groups[group].count++;
      groups[group].qty += item.closing || 0;
      groups[group].value += item.value || 0;
    });
    return groups;
  }, [filteredItems]);

  // Low stock items
  const lowStockItems = useMemo(() => {
    return filteredItems.filter(item => 
      item.reorderLevel && item.closing < item.reorderLevel
    );
  }, [filteredItems]);

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
            <Package className="w-5 h-5 mr-2 text-violet-500" />
            Stock Summary
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {selectedClient?.name || 'Select a client'} • FY {selectedFinancialYear}
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" icon={Download}>PDF</Button>
          <Button variant="secondary" icon={FileSpreadsheet}>Excel</Button>
        </div>
      </div>

      {!selectedClient && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-sm text-sm text-amber-800">
          ⚠️ Select a client from the header to view stock summary.
        </div>
      )}

      {/* View Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 p-1 bg-slate-100 rounded-md">
          {['summary', 'detailed', 'group'].map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm transition-all ${
                viewMode === mode ? 'bg-black text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode === 'summary' ? 'Summary' : mode === 'detailed' ? 'Detailed' : 'By Group'}
            </button>
          ))}
        </div>
        <select
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-black"
        >
          <option value="">All Groups</option>
          {allGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-blue-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Opening Stock</p>
          <p className="text-xl font-bold font-mono text-slate-900 mt-1">{totals.openingQty.toLocaleString()}</p>
          <p className="text-xs text-slate-500 font-mono">{formatCurrency(totals.openingValue)}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-emerald-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
            <TrendingUp className="w-3 h-3 mr-1" /> Inward
          </p>
          <p className="text-xl font-bold font-mono text-emerald-600 mt-1">{totals.inwardQty.toLocaleString()}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-red-500">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center">
            <TrendingDown className="w-3 h-3 mr-1" /> Outward
          </p>
          <p className="text-xl font-bold font-mono text-red-600 mt-1">{totals.outwardQty.toLocaleString()}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-violet-500 bg-violet-50">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Closing Stock</p>
          <p className="text-xl font-bold font-mono text-violet-700 mt-1">{totals.closingQty.toLocaleString()}</p>
          <p className="text-xs text-violet-600 font-mono font-bold">{formatCurrency(totals.closingValue)}</p>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Card className="p-4 bg-amber-50 border-amber-200">
          <div className="flex items-center space-x-2 text-amber-800">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-bold text-sm">Low Stock Alert: {lowStockItems.length} items below reorder level</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {lowStockItems.slice(0, 5).map(item => (
              <Badge key={item.id} type="warning">{item.name} ({item.closing})</Badge>
            ))}
            {lowStockItems.length > 5 && (
              <Badge type="neutral">+{lowStockItems.length - 5} more</Badge>
            )}
          </div>
        </Card>
      )}

      {/* Group View */}
      {viewMode === 'group' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(groupSummary).map(([groupId, data]) => (
            <Card key={groupId} className="p-4 hover:border-black transition-colors">
              <h3 className="font-bold text-slate-900">{getGroupName(groupId)}</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Items</span>
                  <span className="font-mono font-bold">{data.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Qty</span>
                  <span className="font-mono font-bold">{data.qty.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Value</span>
                  <span className="font-mono font-bold text-emerald-600">{formatCurrency(data.value)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Summary/Detailed Table */}
      {(viewMode === 'summary' || viewMode === 'detailed') && (
        <Card className="overflow-hidden">
          <div className="p-4 bg-slate-800 text-white">
            <h3 className="font-bold">Stock Register</h3>
            <p className="text-xs text-slate-300">As on {new Date().toLocaleDateString('en-IN')}</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 text-left">Item Name</th>
                  <th className="px-4 py-3 text-center">Unit</th>
                  <th className="px-4 py-3 text-right">Opening</th>
                  {viewMode === 'detailed' && (
                    <>
                      <th className="px-4 py-3 text-right text-emerald-600">Inward</th>
                      <th className="px-4 py-3 text-right text-red-600">Outward</th>
                    </>
                  )}
                  <th className="px-4 py-3 text-right">Closing</th>
                  <th className="px-4 py-3 text-right">Rate</th>
                  <th className="px-4 py-3 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-xs">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={viewMode === 'detailed' ? 8 : 6} className="px-4 py-8 text-center text-slate-400">
                      No stock items found
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="font-sans font-semibold text-slate-800">{item.name}</p>
                        <p className="text-[10px] text-slate-400">{getGroupName(item.group)}</p>
                      </td>
                      <td className="px-4 py-3 text-center text-slate-500">{getUnitName(item.unit)}</td>
                      <td className="px-4 py-3 text-right">{item.opening || 0}</td>
                      {viewMode === 'detailed' && (
                        <>
                          <td className="px-4 py-3 text-right text-emerald-600">{item.inward || 0}</td>
                          <td className="px-4 py-3 text-right text-red-600">{item.outward || 0}</td>
                        </>
                      )}
                      <td className="px-4 py-3 text-right font-bold">{item.closing || 0}</td>
                      <td className="px-4 py-3 text-right text-slate-600">{formatCurrency(item.openingRate || 0)}</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-600">{formatCurrency(item.value || 0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-slate-100 border-t-2 border-slate-300 font-bold">
                <tr>
                  <td colSpan={2} className="px-4 py-3 text-right text-xs uppercase text-slate-600">Total</td>
                  <td className="px-4 py-3 text-right font-mono">{totals.openingQty}</td>
                  {viewMode === 'detailed' && (
                    <>
                      <td className="px-4 py-3 text-right font-mono text-emerald-600">{totals.inwardQty}</td>
                      <td className="px-4 py-3 text-right font-mono text-red-600">{totals.outwardQty}</td>
                    </>
                  )}
                  <td className="px-4 py-3 text-right font-mono">{totals.closingQty}</td>
                  <td className="px-4 py-3"></td>
                  <td className="px-4 py-3 text-right font-mono text-emerald-600">{formatCurrency(totals.closingValue)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card>
      )}

      <ShortcutBar context="default" />
    </div>
  );
};

export default StockSummary;
