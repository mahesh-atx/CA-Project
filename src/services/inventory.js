// Inventory Storage Service
import { STORAGE_KEYS } from '../constants';

// --- Stock Groups ---
export const getStockGroups = (clientId) => {
  const data = localStorage.getItem(STORAGE_KEYS.STOCK_GROUPS);
  const groups = data ? JSON.parse(data) : [];
  return clientId ? groups.filter(g => g.clientId === clientId) : groups;
};

export const saveStockGroup = (group) => {
  const groups = getStockGroups();
  const id = group.id || `sg_${Date.now()}`;
  const existing = groups.findIndex(g => g.id === id);
  
  if (existing >= 0) {
    groups[existing] = { ...groups[existing], ...group };
  } else {
    groups.push({ ...group, id, createdAt: new Date().toISOString() });
  }
  
  localStorage.setItem(STORAGE_KEYS.STOCK_GROUPS, JSON.stringify(groups));
  return groups;
};

export const deleteStockGroup = (id) => {
  const groups = getStockGroups().filter(g => g.id !== id);
  localStorage.setItem(STORAGE_KEYS.STOCK_GROUPS, JSON.stringify(groups));
  return groups;
};

// --- Stock Items ---
export const getStockItems = (clientId) => {
  const data = localStorage.getItem(STORAGE_KEYS.STOCK_ITEMS);
  const items = data ? JSON.parse(data) : [];
  return clientId ? items.filter(i => i.clientId === clientId) : items;
};

export const saveStockItem = (item) => {
  const items = getStockItems();
  const id = item.id || `si_${Date.now()}`;
  const existing = items.findIndex(i => i.id === id);
  
  if (existing >= 0) {
    items[existing] = { ...items[existing], ...item };
  } else {
    items.push({ ...item, id, createdAt: new Date().toISOString() });
  }
  
  localStorage.setItem(STORAGE_KEYS.STOCK_ITEMS, JSON.stringify(items));
  return items;
};

export const deleteStockItem = (id) => {
  const items = getStockItems().filter(i => i.id !== id);
  localStorage.setItem(STORAGE_KEYS.STOCK_ITEMS, JSON.stringify(items));
  return items;
};

// --- Godowns ---
export const getGodowns = (clientId) => {
  const data = localStorage.getItem(STORAGE_KEYS.GODOWNS);
  const godowns = data ? JSON.parse(data) : [];
  return clientId ? godowns.filter(g => g.clientId === clientId) : godowns;
};

export const saveGodown = (godown) => {
  const godowns = getGodowns();
  const id = godown.id || `gd_${Date.now()}`;
  const existing = godowns.findIndex(g => g.id === id);
  
  if (existing >= 0) {
    godowns[existing] = { ...godowns[existing], ...godown };
  } else {
    godowns.push({ ...godown, id, createdAt: new Date().toISOString() });
  }
  
  localStorage.setItem(STORAGE_KEYS.GODOWNS, JSON.stringify(godowns));
  return godowns;
};

export const deleteGodown = (id) => {
  const godowns = getGodowns().filter(g => g.id !== id);
  localStorage.setItem(STORAGE_KEYS.GODOWNS, JSON.stringify(godowns));
  return godowns;
};

// --- Stock Calculations ---
export const calculateStockBalance = (itemId, vouchers, asOnDate = null) => {
  let openingQty = 0;
  let inwardQty = 0;
  let outwardQty = 0;
  
  // Get item for opening stock
  const items = getStockItems();
  const item = items.find(i => i.id === itemId);
  if (item?.openingQty) {
    openingQty = parseFloat(item.openingQty) || 0;
  }
  
  // Calculate from vouchers
  vouchers.forEach(v => {
    if (asOnDate && v.date > asOnDate) return;
    
    v.stockEntries?.forEach(entry => {
      if (entry.itemId === itemId) {
        if (entry.type === 'in') {
          inwardQty += parseFloat(entry.qty) || 0;
        } else {
          outwardQty += parseFloat(entry.qty) || 0;
        }
      }
    });
  });
  
  return {
    opening: openingQty,
    inward: inwardQty,
    outward: outwardQty,
    closing: openingQty + inwardQty - outwardQty
  };
};

export const generateStockSummary = (clientId, vouchers) => {
  const items = getStockItems(clientId);
  
  return items.map(item => {
    const balance = calculateStockBalance(item.id, vouchers);
    return {
      ...item,
      ...balance,
      value: balance.closing * (item.rate || 0)
    };
  });
};
