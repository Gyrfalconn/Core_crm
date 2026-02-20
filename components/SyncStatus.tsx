import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Database } from 'lucide-react';

const SyncStatus: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 1200); 
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all duration-300 ${
        isOnline 
          ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-50' 
          : 'bg-rose-50 text-rose-600 border-rose-100 shadow-sm shadow-rose-50'
      }`}>
        {isOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
        <span>{isOnline ? 'Cloud Sync Active' : 'Offline Engine Active'}</span>
        {isOnline && (
          <button 
            onClick={triggerSync} 
            className={`ml-1 hover:text-emerald-800 transition-transform ${syncing ? 'animate-spin' : 'hover:rotate-180 duration-500'}`}
          >
            <RefreshCw size={10} />
          </button>
        )}
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 rounded-full text-[10px] font-bold uppercase tracking-tight">
        <Database size={10} className="text-slate-400" />
        <span>PostgreSQL Hybrid</span>
      </div>
    </div>
  );
};

export default SyncStatus;