import React from 'react';
import { 
  ShieldCheck, 
  LayoutGrid, 
  Users, 
  Network, 
  FileCode, 
  LogIn,
  X
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutGrid },
    { id: 'identities', label: 'Identities (Kratos)', icon: Users },
    { id: 'access', label: 'Access Control (Keto)', icon: Network },
    { id: 'architecture', label: 'Architecture & Code', icon: FileCode },
    { id: 'login-demo', label: 'Login Demo', icon: LogIn },
  ];

  const handleNav = (id: string) => {
    onNavigate(id);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Content */}
      <div className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-slate-900 border-r border-slate-800 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:h-screen flex flex-col
      `}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">Ory IAM</span>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="font-medium text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Service Health</p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">Kratos (Identity)</span>
                </div>
                <span className="text-emerald-500">OK</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-slate-300">Keto (Perms)</span>
                </div>
                <span className="text-emerald-500">OK</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
