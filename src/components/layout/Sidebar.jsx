// Sidebar Component
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  BookOpen, 
  BookMarked,
  FileText, 
  PieChart, 
  FileSpreadsheet, 
  UploadCloud, 
  Settings,
  LogOut,
  Calculator,
  Calendar,
  Package,
  BarChart3,
  FileOutput,
  FileBarChart,
  Landmark,
  DollarSign
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MENU_ITEMS } from '../../constants';

const iconMap = {
  LayoutDashboard,
  Users,
  Briefcase,
  BookOpen,
  BookMarked,
  FileText,
  PieChart,
  FileSpreadsheet,
  UploadCloud,
  Settings,
  Calendar,
  Package,
  BarChart3,
  FileOutput,
  FileBarChart,
  Landmark,
  DollarSign
};

const Sidebar = () => {
  const { sidebarOpen, logout } = useApp();

  return (
    <aside className={`
      fixed md:relative z-20 h-screen bg-black flex flex-col text-white
      transition-all duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]
      ${sidebarOpen ? 'w-64' : 'w-20'}
    `}>
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className={`flex items-center space-x-3 font-bold text-lg tracking-tight transition-all ${!sidebarOpen && 'justify-center w-full px-0'}`}>
          <div className="w-8 h-8 bg-white text-black rounded-sm flex items-center justify-center flex-shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          {sidebarOpen && <span>CA Pro</span>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 space-y-1 px-3">
        {MENU_ITEMS.map((item) => {
          const Icon = iconMap[item.icon];
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) => `
                w-full flex items-center space-x-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-all group relative
                ${isActive
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  {Icon && <Icon className={`w-5 h-5 transition-colors ${isActive ? item.color : 'text-slate-500 group-hover:text-slate-300'}`} />}
                  {sidebarOpen && <span>{item.label}</span>}
                  {!sidebarOpen && isActive && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full"></div>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <button 
          onClick={logout} 
          className={`flex items-center space-x-3 text-slate-400 hover:text-white w-full px-2 py-2 rounded-sm hover:bg-white/10 transition-colors ${!sidebarOpen && 'justify-center'}`}
        >
          <LogOut className="w-5 h-5" />
          {sidebarOpen && <span className="text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
