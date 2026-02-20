
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Leads from './components/Leads';
import Pipeline from './components/Pipeline';
import EmployeeTracking from './components/EmployeeTracking';
import Support from './components/Support';
import Inventory from './components/Inventory';
import Profile from './components/Profile';
import SyncStatus from './components/SyncStatus';
import { Bell, Search, Settings, Loader2, LogIn, UserPlus, ShieldCheck } from 'lucide-react';
import { authService } from './services/api';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [formData, setFormData] = useState({ email: '', password: '', name: '', role: 'Employee' });
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const syncUser = () => {
      const savedToken = localStorage.getItem('core_token');
      const savedUser = localStorage.getItem('core_user');
      if (savedToken && savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch (e) {
          localStorage.removeItem('core_token');
          localStorage.removeItem('core_user');
        }
      }
    };
    
    syncUser();
    window.addEventListener('storage', syncUser);
    setLoading(false);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    try {
      if (isRegistering) {
        await authService.register(formData);
        setMessage({ text: 'User ID Registered. Access Granted.', type: 'success' });
        setIsRegistering(false);
      } else {
        const res = await authService.login({ email: formData.email, password: formData.password });
        if (rememberMe) {
          localStorage.setItem('core_token', res.token);
          localStorage.setItem('core_user', JSON.stringify(res.user));
        } else {
          localStorage.setItem('core_token', res.token);
        }
        setUser(res.user);
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Authentication Security Fault', type: 'error' });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('core_token');
    localStorage.removeItem('core_user');
    setUser(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'leads': return <Leads />;
      case 'pipeline': return <Pipeline />;
      case 'tracking': return <EmployeeTracking />;
      case 'support': return <Support />;
      case 'inventory': return <Inventory />;
      case 'profile': return <Profile />;
      default: return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
          <Settings size={48} className="mb-4 opacity-20" />
          <p className="text-lg font-medium">Core Module Under Maintenance</p>
        </div>
      );
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50">
      <Loader2 className="animate-spin text-indigo-600" size={40} />
    </div>
  );

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-950 overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="grid grid-cols-12 gap-1 h-full">
            {Array.from({length: 200}).map((_, i) => <div key={i} className="border-r border-b border-white/20" />)}
          </div>
        </div>
        
        <div className="bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full max-w-md z-10 border border-white/20">
           <div className="flex justify-center mb-10">
              <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-2xl shadow-indigo-600/40 transform rotate-3">C</div>
           </div>
           
           <h2 className="text-3xl font-black text-center mb-2 text-slate-900 tracking-tight leading-tight">
             {isRegistering ? 'Initialize User' : 'CORE Enterprise'}
           </h2>
           <p className="text-slate-400 text-center mb-10 text-xs font-bold uppercase tracking-[0.2em]">Restricted Access Area</p>
           
           <form onSubmit={handleAuth} className="space-y-5">
             {message.text && (
               <div className={`p-4 text-[11px] font-black rounded-xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                 message.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
               }`}>
                 <ShieldCheck size={16} />
                 {message.text}
               </div>
             )}

             {isRegistering && (
               <div>
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Full Name</label>
                 <input 
                  type="text" required
                  placeholder="John Doe"
                  className="w-full mt-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                 />
               </div>
             )}

             <div>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Work Email</label>
               <input 
                type="email" required
                placeholder="name@company.com"
                className="w-full mt-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
               />
             </div>

             <div>
               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Credentials</label>
               <input 
                type="password" required
                placeholder="••••••••"
                className="w-full mt-1.5 p-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
               />
             </div>

             {!isRegistering && (
               <div className="flex items-center justify-between py-1 px-1">
                 <label className="flex items-center gap-2 cursor-pointer group">
                   <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={rememberMe} 
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer appearance-none w-5 h-5 rounded-md border-2 border-slate-200 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer" 
                    />
                    <ShieldCheck className="absolute left-0.5 pointer-events-none opacity-0 peer-checked:opacity-100 text-white transition-opacity" size={16} />
                   </div>
                   <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">Remember Station</span>
                 </label>
               </div>
             )}

             <button type="submit" className="w-full py-4 mt-4 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-200 flex items-center justify-center gap-3">
               {isRegistering ? <UserPlus size={18} /> : <LogIn size={18} />}
               {isRegistering ? 'Finalize Registration' : 'Authorize Session'}
             </button>
           </form>
           
           <div className="mt-10 text-center pt-8 border-t border-slate-100">
             <button 
              onClick={() => { setIsRegistering(!isRegistering); setMessage({text:'', type:''}); }}
              className="text-xs font-black text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
             >
               {isRegistering ? 'Existing User? Return to Login' : 'System Initial Run? Request Access'}
             </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans antialiased text-slate-900 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 shrink-0 px-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
               <span className="hover:text-slate-600 cursor-pointer transition-colors">Terminal</span>
               <span className="text-slate-200">/</span>
               <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{activeTab}</span>
             </div>
             <div className="h-4 w-[1px] bg-slate-200 mx-1"></div>
             <SyncStatus />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-100 transition-all">
               <Search size={14} className="text-slate-400" />
               <input type="text" placeholder="OmniSearch..." className="bg-transparent text-[11px] font-bold outline-none w-40 text-slate-700 placeholder:text-slate-400" />
            </div>
            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg relative transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-1"></div>
            <div 
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-3 group cursor-pointer p-1 rounded-xl hover:bg-slate-50 transition-all"
            >
              <div className="text-right hidden sm:block">
                <p className="text-[11px] font-black text-slate-900 leading-none">{user.name}</p>
                <p className="text-[9px] text-indigo-500 font-black uppercase tracking-widest mt-1 opacity-80">{user.role}</p>
              </div>
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-indigo-700 border-2 border-white rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-200">
                {user.name?.[0]?.toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
