
import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Sparkles, Loader2, X } from 'lucide-react';
import { Lead } from '../types';
import { leadService } from '../services/api';
import { getSmartLeadInsight } from '../services/geminiService';

const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [aiInsight, setAiInsight] = useState<Record<string, string>>({});
  const [loadingInsight, setLoadingInsight] = useState<string | null>(null);

  const [newLead, setNewLead] = useState({ name: '', company: '', email: '', estimatedValue: 5000, score: 50 });

  const fetchData = async () => {
    try {
      const data = await leadService.getAll();
      setLeads(data);
    } catch (e) {
      console.warn("Backend unavailable, using mock fallback.");
      // Fallback logic could go here
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await leadService.create(newLead);
      setShowAddForm(false);
      fetchData();
    } catch (e) { alert("Error creating lead"); }
  };

  const fetchInsight = async (lead: Lead) => {
    setLoadingInsight(lead.id);
    const insight = await getSmartLeadInsight(lead.name, lead.company, lead.score);
    setAiInsight(prev => ({ ...prev, [lead.id]: insight }));
    setLoadingInsight(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Lead Pipeline</h1>
          <p className="text-sm text-slate-500">Managing {leads.length} potential opportunities.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm w-48 focus:ring-2 focus:ring-indigo-500/20 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">
            <Plus size={18} />
            Capture Lead
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-2xl border border-indigo-100 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">Add New Business Prospect</h3>
            <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors"><X size={20}/></button>
          </div>
          <form onSubmit={handleAddLead} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="Full Name" required className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} />
            <input type="text" placeholder="Company Name" required className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={newLead.company} onChange={e => setNewLead({...newLead, company: e.target.value})} />
            <input type="email" placeholder="Email Address" required className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={newLead.email} onChange={e => setNewLead({...newLead, email: e.target.value})} />
            <input type="number" placeholder="Value ($)" className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm" value={newLead.estimatedValue} onChange={e => setNewLead({...newLead, estimatedValue: Number(e.target.value)})} />
            <div className="md:col-span-2 flex justify-end gap-3 mt-4">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-6 py-2 text-sm font-bold text-slate-500">Cancel</button>
              <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-100">Save Lead</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-500" size={40}/></div> : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">AI Guidance</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Potential</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leads.filter(l => l.name.toLowerCase().includes(searchTerm.toLowerCase())).map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">{lead.name}</div>
                    <div className="text-xs text-slate-500">{lead.company}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${lead.score}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{lead.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-xs">
                    {aiInsight[lead.id] ? (
                      <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-xl text-[11px] text-indigo-800 italic leading-snug">
                        {aiInsight[lead.id]}
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <button onClick={() => fetchInsight(lead)} className="flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold hover:bg-indigo-100 transition-colors">
                          {loadingInsight === lead.id ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                          Consult Gemini
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    ${lead.estimatedValue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leads;
