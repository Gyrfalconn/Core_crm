
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { LogOut } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const userStr = localStorage.getItem('core_user');
  const user = userStr ? JSON.parse(userStr) : { name: 'Admin User', role: 'Admin' };

  return (
    <aside className="w-64 bg-slate-900 h-screen flex flex-col sticky top-0 shrink-0 text-slate-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/20">
          C
        </div>
        <span className="text-xl font-black text-white tracking-tighter uppercase italic">CORE Engine</span>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className={`${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} transition-colors`}>
              {item.icon}
            </div>
            <span className="font-bold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-800/40 rounded-2xl p-4 mb-4 border border-slate-700/50">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
              {user.name[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest">{user.role}</p>
            </div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-all font-bold text-sm"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
