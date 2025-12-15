// Keyboard Shortcuts Hook - Tally-style navigation
import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Tally-style keyboard shortcuts
const SHORTCUTS = {
  // Function keys for vouchers
  'F4': { path: '/vouchers', type: 'contra', label: 'Contra' },
  'F5': { path: '/vouchers', type: 'payment', label: 'Payment' },
  'F6': { path: '/vouchers', type: 'receipt', label: 'Receipt' },
  'F7': { path: '/vouchers', type: 'journal', label: 'Journal' },
  'F8': { path: '/vouchers', type: 'sales', label: 'Sales' },
  'F9': { path: '/vouchers', type: 'purchase', label: 'Purchase' },
  
  // Navigation shortcuts
  'F10': { path: '/reports', label: 'Reports' },
  'F11': { path: '/ledgers', label: 'Ledgers' },
  'F12': { path: '/settings', label: 'Settings' },
  
  // Alt combinations
  'Alt+F1': { action: 'toggleDetail', label: 'Detailed Mode' },
  'Alt+F2': { action: 'changeDate', label: 'Change Date' },
  'Alt+F3': { action: 'selectClient', label: 'Select Company' },
  
  // Quick access
  'D': { path: '/', label: 'Dashboard', requireAlt: true },
  'C': { path: '/clients', label: 'Clients', requireAlt: true },
  'L': { path: '/ledgers', label: 'Ledgers', requireAlt: true },
  'V': { path: '/vouchers', label: 'Vouchers', requireAlt: true },
  'R': { path: '/reports', label: 'Reports', requireAlt: true },
  'G': { path: '/gst', label: 'GST', requireAlt: true },
};

export const useKeyboardShortcuts = (options = {}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { 
    onVoucherTypeChange, 
    onDateChange, 
    onClientSelect,
    onToggleDetail,
    enabled = true 
  } = options;

  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;
    
    // Don't trigger if typing in input/textarea
    const target = event.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
      // Allow Escape to blur
      if (event.key === 'Escape') {
        target.blur();
      }
      return;
    }

    // Build key string
    let keyString = '';
    if (event.altKey) keyString += 'Alt+';
    if (event.ctrlKey) keyString += 'Ctrl+';
    if (event.shiftKey) keyString += 'Shift+';
    keyString += event.key.toUpperCase();
    
    // Also check just the key for function keys
    const justKey = event.key.toUpperCase();
    
    // Check for shortcut
    let shortcut = SHORTCUTS[keyString] || SHORTCUTS[justKey];
    
    // Check for Alt-required single letter shortcuts
    if (!shortcut && event.altKey && SHORTCUTS[justKey]?.requireAlt) {
      shortcut = SHORTCUTS[justKey];
    }
    
    if (!shortcut) return;
    
    // Handle navigation shortcuts
    if (shortcut.path) {
      event.preventDefault();
      if (shortcut.type && onVoucherTypeChange) {
        onVoucherTypeChange(shortcut.type);
      }
      navigate(shortcut.path);
      return;
    }
    
    // Handle action shortcuts
    if (shortcut.action) {
      event.preventDefault();
      switch (shortcut.action) {
        case 'toggleDetail':
          onToggleDetail?.();
          break;
        case 'changeDate':
          onDateChange?.();
          break;
        case 'selectClient':
          onClientSelect?.();
          break;
      }
    }
    
    // Escape key handling
    if (event.key === 'Escape') {
      event.preventDefault();
      // Go back or close modal
      if (location.pathname !== '/') {
        navigate(-1);
      }
    }
  }, [enabled, navigate, location, onVoucherTypeChange, onDateChange, onClientSelect, onToggleDetail]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { shortcuts: SHORTCUTS };
};

// Get shortcut label for display
export const getShortcutLabel = (key) => {
  return SHORTCUTS[key]?.label || key;
};

// Get all shortcuts for current context
export const getActiveShortcuts = (context = 'default') => {
  const shortcuts = [];
  
  if (context === 'voucher') {
    shortcuts.push(
      { key: 'F4', label: 'Contra' },
      { key: 'F5', label: 'Payment' },
      { key: 'F6', label: 'Receipt' },
      { key: 'F7', label: 'Journal' },
      { key: 'F8', label: 'Sales' },
      { key: 'F9', label: 'Purchase' },
    );
  } else if (context === 'dashboard') {
    shortcuts.push(
      { key: 'Alt+C', label: 'Clients' },
      { key: 'Alt+L', label: 'Ledgers' },
      { key: 'Alt+V', label: 'Vouchers' },
      { key: 'Alt+R', label: 'Reports' },
    );
  } else {
    shortcuts.push(
      { key: 'F5', label: 'Payment' },
      { key: 'F6', label: 'Receipt' },
      { key: 'F10', label: 'Reports' },
      { key: 'Esc', label: 'Back' },
    );
  }
  
  return shortcuts;
};

export default useKeyboardShortcuts;
