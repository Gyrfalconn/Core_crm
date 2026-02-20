
import React, { useState, useEffect, useRef } from 'react';
import { trackingService } from '../services/api';
import { MapPin, Clock, Circle, Filter, Loader2, RefreshCw, LogIn, LogOut, ShieldCheck, Timer } from 'lucide-react';

const EmployeeTracking: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Offline'>('All');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [sessionTime, setSessionTime] = useState<string>('00:00:00');
  
  const userStr = localStorage.getItem('core_user');
  const currentUser = userStr ? JSON.parse(userStr) : null;
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await trackingService.getLogs();
      setLogs(data);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const userActiveLog = logs.find(log => log.userId === currentUser?.id && log.status === 'Active');

  // Live Timer logic for the active session
  useEffect(() => {
    if (userActiveLog) {
      const start = new Date(userActiveLog.checkIn).getTime();
      timerRef.current = setInterval(() => {
        const now = new Date().getTime();
        const diff = now - start;
        const h = Math.floor(diff / 3600000).toString().padStart(2, '0');
        const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
        const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
        setSessionTime(`${h}:${m}:${s}`);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setSessionTime('00:00:00');
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [userActiveLog]);

  const handleCheckIn = async () => {
    setActionLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await trackingService.checkIn('Main Office');
      setMessage({ text: 'Session Started. Tracking Active.', type: 'success' });
      await fetchLogs();
    } catch (error) {
      setMessage({ text: 'Security Fault: Check-in denied.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setActionLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await trackingService.checkOut();
      setMessage({ text: 'Session Terminated. Status: Offline.', type: 'info' });
      await fetchLogs();
    } catch (error) {
      setMessage({ text: 'Error: Session termination failed.', type: 'error' });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredLogs = statusFilter === 'All' 
    ? logs 
    : logs.filter(log => log.status === statusFilter);

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return '--:--';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Terminal Presence</h1>
          <p className="text-sm text-slate-500 font-medium">Monitoring real-time operational status of authenticated field units.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchLogs}
            disabled={loading}
            className="p-2.5 text-slate-400 hover:text-indigo-600 bg-white border border-slate-200 rounded-xl transition-all hover:shadow-md active:scale-95"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
            {(['All', 'Active', 'Offline'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Action Header for current user */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -translate-y-1/2 translate-x-1/2 -z-0"></div>
        
        <div className="flex items-center gap-5 z-10">
          <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-2xl transition-all duration-500 ${userActiveLog ? 'bg-indigo-600 rotate-3' : 'bg-slate-300'}`}>
            {currentUser?.name[0].toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 leading-tight">Identity: {currentUser?.name}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${userActiveLog ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                <Circle size={8} className={userActiveLog ? 'fill-emerald-500' : 'fill-slate-300'} />
                {userActiveLog ? 'Status: Active' : 'Status: Offline'}
              </span>
              {userActiveLog && (
                <span className="flex items-center gap-1.5 text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">
                  <Timer size={10} />
                  {sessionTime}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-3 z-10 w-full md:w-auto">
          {message.text && (
            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 animate-in slide-in-from-right-4 duration-300 ${
              message.type === 'error' ? 'bg-rose-50 text-rose-600' : 
              message.type === 'info' ? 'bg-slate-100 text-slate-600' : 'bg-emerald-50 text-emerald-600'
            }`}>
              <ShieldCheck size={14} />
              {message.text}
            </div>
          )}
          <div className="flex gap-3 w-full md:w-auto">
            {!userActiveLog ? (
              <button 
                onClick={handleCheckIn}
                disabled={actionLoading}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                Initiate Session
              </button>
            ) : (
              <button 
                onClick={handleCheckOut}
                disabled={actionLoading}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 shadow-xl shadow-rose-100 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <LogOut size={16} />}
                Terminate Session
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="animate-spin mb-4 text-indigo-600" size={48} />
          <p className="text-[10px] font-black uppercase tracking-[0.3em]">Synchronizing Field Matrix...</p>
        </div>
      ) : filteredLogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLogs.map((log) => (
            <div key={log.id} className={`bg-white p-6 rounded-[2rem] border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative group ${log.userId === currentUser?.id ? 'border-indigo-200 shadow-lg shadow-indigo-50' : 'border-slate-200'}`}>
              {log.userId === currentUser?.id && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full shadow-lg">
                  Authenticated Unit
                </div>
              )}
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm transition-colors ${log.status === 'Active' ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                    <span className="text-xl font-black">
                      {log.employeeName?.[0] || 'U'}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 tracking-tight">{log.employeeName}</h3>
                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest mt-1 ${log.status === 'Active' ? 'text-emerald-600' : 'text-slate-400'}`}>
                      <Circle size={8} className={log.status === 'Active' ? 'fill-emerald-500' : 'fill-slate-300'} />
                      {log.status}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <Clock size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Entry</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg">{formatTime(log.checkIn)}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <LogOut size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Exit</span>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-lg ${log.checkOut ? 'text-slate-900 bg-slate-50' : 'text-indigo-600 bg-indigo-50 animate-pulse'}`}>
                    {log.checkOut ? formatTime(log.checkOut) : 'Session Active'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <MapPin size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Zone</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg truncate max-w-[120px]">{log.location}</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button className="flex-1 py-3 bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all">
                  History
                </button>
                <button className="flex-1 py-3 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-100 transition-all">
                  Comms
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] border border-slate-200 border-dashed py-32 flex flex-col items-center justify-center text-slate-400 text-center px-10">
          <div className="p-6 bg-slate-50 rounded-full mb-6">
            <Filter size={48} className="opacity-20" />
          </div>
          <p className="font-black text-slate-900 uppercase tracking-widest text-lg">No Operations Detected</p>
          <p className="text-sm mt-2 font-medium max-w-xs">There are currently no synchronized records matching the filter criteria.</p>
          <button 
            onClick={() => setStatusFilter('All')}
            className="mt-6 text-indigo-600 text-xs font-black uppercase tracking-[0.2em] hover:bg-indigo-50 px-6 py-2 rounded-full transition-all"
          >
            Clear Filter Constraints
          </button>
        </div>
      )}

      {/* Footer Summary Bar */}
      <div className="bg-slate-900 text-white rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-indigo-100 border border-slate-800">
        <div>
          <h2 className="text-2xl font-black mb-3 tracking-tight">Enterprise Presence Matrix</h2>
          <p className="text-slate-400 text-sm max-w-md font-medium leading-relaxed">System protocols mandate that all field check-ins are logged with geo-spatial and temporal markers for organizational integrity.</p>
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-white/5 p-6 rounded-[2rem] text-center min-w-[140px] border border-white/5 backdrop-blur-sm group hover:bg-indigo-600 transition-all cursor-default">
            <p className="text-4xl font-black mb-1 transition-transform group-hover:scale-110">{logs.filter(e => e.status === 'Active').length}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 group-hover:text-white">Live Units</p>
          </div>
          <div className="bg-white/5 p-6 rounded-[2rem] text-center min-w-[140px] border border-white/5 backdrop-blur-sm group hover:bg-slate-700 transition-all cursor-default">
            <p className="text-4xl font-black mb-1 transition-transform group-hover:scale-110">{logs.filter(e => e.status === 'Offline').length}</p>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white">Standby</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeTracking;
