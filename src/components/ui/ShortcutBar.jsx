// Shortcut Bar Component - Tally-style footer
import React from 'react';
import { getActiveShortcuts } from '../../hooks/useKeyboardShortcuts';

const ShortcutBar = ({ context = 'default' }) => {
  const shortcuts = getActiveShortcuts(context);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 text-white px-4 py-2 flex items-center justify-center space-x-6 text-xs font-mono z-50 border-t border-slate-700">
      {shortcuts.map(({ key, label }) => (
        <div key={key} className="flex items-center space-x-1">
          <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px] font-bold border border-slate-600">
            {key}
          </kbd>
          <span className="text-slate-300">{label}</span>
        </div>
      ))}
      <div className="flex items-center space-x-1 border-l border-slate-600 pl-6">
        <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-[10px] font-bold border border-slate-600">
          Esc
        </kbd>
        <span className="text-slate-300">Back</span>
      </div>
    </div>
  );
};

export default ShortcutBar;
