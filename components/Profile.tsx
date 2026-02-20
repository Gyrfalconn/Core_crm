
import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Save, CheckCircle2, AlertCircle, Camera, Loader2 } from 'lucide-react';
import { authService } from '../services/api';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const savedUser = localStorage.getItem('core_user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      setFormData({
        name: parsed.name || '',
        email: parsed.email || '',
        role: parsed.role || 'Employee'
      });
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });

    try {
      const res = await authService.updateProfile(formData);
      // Update local storage and state
      const updatedUser = { ...user, ...res.user };
      localStorage.setItem('core_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      
      // Dispatch custom event to notify other components (like Sidebar)
      window.dispatchEvent(new Event('storage'));
    } catch (err: any) {
      setMessage({ text: err.message || 'Failed to update profile', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System Identity</h1>
          <p className="text-slate-500 text-sm">Manage your workstation credentials and personal information.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            
            <div className="relative inline-block mb-6">
              <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white font-black text-4xl shadow-2xl shadow-indigo-200 border-4 border-white">
                {formData.name[0]?.toUpperCase()}
              </div>
              <button className="absolute -bottom-2 -right-2 p-3 bg-white text-indigo-600 rounded-2xl shadow-xl border border-slate-100 hover:scale-110 transition-all">
                <Camera size={18} />
              </button>
            </div>

            <h2 className="text-xl font-black text-slate-900 mb-1">{formData.name}</h2>
            <p className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] mb-4">{formData.role}</p>
            
            <div className="pt-6 border-t border-slate-50 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Account Status</span>
                <span className="text-emerald-500">Active</span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span>Security Clearance</span>
                <span>Level 4</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-[2rem] text-white shadow-xl shadow-slate-200">
             <div className="flex items-center gap-3 mb-4">
               <Shield className="text-indigo-400" size={20} />
               <h3 className="font-bold text-sm tracking-tight">Security Protocol</h3>
             </div>
             <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
               Your access level is determined by organizational hierarchy. Certain fields like 'Role' may require administrative overrides for modification.
             </p>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-2">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm h-full">
            <form onSubmit={handleUpdate} className="space-y-6">
              {message.text && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300 ${
                  message.type === 'error' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                }`}>
                  {message.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
                  <span className="text-xs font-black uppercase tracking-widest leading-none">{message.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">System Display Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      placeholder="Your Name"
                      className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-bold text-slate-900"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Enterprise Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required
                      placeholder="email@company.com"
                      className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-bold text-slate-900"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Organizational Role</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select 
                    className="w-full p-4 pl-12 rounded-2xl bg-slate-50 border border-slate-100 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all text-sm font-bold text-slate-900 appearance-none"
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Manager">Manager</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-xl shadow-indigo-100 flex items-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  Synchronize Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
