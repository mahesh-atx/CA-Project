// Placeholder screens
import React from 'react';
import { Card, Button } from '../ui';
import { Lock, FolderOpen, Settings as SettingsIcon, Building2 } from 'lucide-react';

// Companies placeholder
export const Companies = () => (
  <div className="flex flex-col items-center justify-center h-96 text-slate-300 animate-in fade-in">
    <div className="p-6 bg-slate-50 rounded-full mb-4">
      <Building2 className="w-8 h-8 text-slate-400" />
    </div>
    <p className="font-mono text-sm text-slate-500">Companies Module</p>
    <p className="text-xs text-slate-400 mt-2">Coming in Phase 2</p>
  </div>
);

// Documents placeholder
export const DocumentManager = () => (
  <div className="flex flex-col items-center justify-center h-96 text-slate-300 animate-in fade-in">
    <div className="p-6 bg-slate-50 rounded-full mb-4">
      <FolderOpen className="w-8 h-8 text-slate-400" />
    </div>
    <p className="font-mono text-sm text-slate-500">Document Manager</p>
    <p className="text-xs text-slate-400 mt-2">Upload & Download coming in Phase 4</p>
  </div>
);

// Settings placeholder
export const SettingsScreen = () => (
  <div className="flex flex-col items-center justify-center h-96 text-slate-300 animate-in fade-in">
    <div className="p-6 bg-slate-50 rounded-full mb-4">
      <SettingsIcon className="w-8 h-8 text-slate-400" />
    </div>
    <p className="font-mono text-sm text-slate-500">Settings</p>
    <p className="text-xs text-slate-400 mt-2">Configuration options coming soon</p>
  </div>
);

// Access Denied placeholder
export const AccessDenied = () => (
  <div className="flex flex-col items-center justify-center h-96 text-slate-300 animate-in fade-in">
    <div className="p-6 bg-slate-50 rounded-full mb-4">
      <Lock className="w-8 h-8 text-slate-400" />
    </div>
    <p className="font-mono text-sm">Module Access Restricted</p>
  </div>
);
