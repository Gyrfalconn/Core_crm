
import React, { useState, useEffect } from 'react';
import { MOCK_TICKETS, MOCK_CUSTOMERS } from '../constants';
import { SupportTicket, Message } from '../types';
import { 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  X, 
  Send, 
  User, 
  Building2, 
  Mail, 
  Phone,
  ArrowRight,
  ShieldCheck,
  History,
  // Fix: Added missing Plus icon import
  Plus
} from 'lucide-react';

const Support: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>(MOCK_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Sync internal tickets state if MOCK_TICKETS changes (though usually static in mock)
  useEffect(() => {
    if (selectedTicket) {
      const updated = tickets.find(t => t.id === selectedTicket.id);
      if (updated) setSelectedTicket(updated);
    }
  }, [tickets]);

  const getCustomerDetails = (customerName: string) => {
    return MOCK_CUSTOMERS.find(c => c.name === customerName);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    
    setIsSending(true);

    // Simulate API delay
    setTimeout(() => {
      const newMessage: Message = {
        id: `M${Date.now()}`,
        sender: 'Support Team (You)',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAdmin: true
      };

      setTickets(prev => prev.map(t => 
        t.id === selectedTicket.id 
          ? { ...t, messages: [...t.messages, newMessage] } 
          : t
      ));

      setReplyText('');
      setIsSending(false);
      
      // Auto-scroll logic could be added here with a ref
    }, 600);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Resolved': return <CheckCircle2 size={14} className="text-emerald-500" />;
      case 'In Progress': return <Clock size={14} className="text-amber-500" />;
      default: return <AlertCircle size={14} className="text-indigo-500" />;
    }
  };

  const getPriorityClass = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 relative h-full animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Support Desk</h1>
          <p className="text-slate-500 text-sm">Real-time ticket monitoring and customer resolution engine.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
            <History size={16} />
            View Logs
          </button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
            New Ticket
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Open', count: tickets.filter(t => t.status === 'Open').length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'In Progress', count: tickets.filter(t => t.status === 'In Progress').length, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Resolved Today', count: tickets.filter(t => t.status === 'Resolved').length, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg. Response', count: '1.8h', color: 'text-slate-900', bg: 'bg-slate-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-transform hover:scale-[1.02]">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-3xl font-black mt-1 ${stat.color}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ticket Information</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Customer</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Priority</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">Age</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tickets.map(ticket => (
              <tr 
                key={ticket.id} 
                onClick={() => setSelectedTicket(ticket)}
                className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-xl group-hover:bg-indigo-100 transition-colors">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{ticket.subject}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-1 uppercase">Ref: {ticket.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                      {ticket.customer[0]}
                    </div>
                    <span className="text-sm text-slate-700 font-semibold">{ticket.customer}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex justify-center">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${getPriorityClass(ticket.priority)}`}>
                      {ticket.priority}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                    {getStatusIcon(ticket.status)}
                    {ticket.status}
                  </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <span className="text-xs font-medium text-slate-500">{ticket.createdAt.split(' ')[0]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ticket Details Side Overlay */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex justify-end animate-in fade-in duration-300">
          <div 
            className="w-full max-w-2xl bg-white h-screen shadow-2xl flex flex-col animate-in slide-in-from-right duration-500 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all transform active:scale-90"
                >
                  <X size={20} />
                </button>
                <div className="h-8 w-[1px] bg-slate-100"></div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-none mb-1.5 tracking-tight">{selectedTicket.subject}</h2>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>ID: {selectedTicket.id}</span>
                    <span className="text-slate-200">•</span>
                    <span className={`font-black ${
                      selectedTicket.status === 'Resolved' ? 'text-emerald-500' : 
                      selectedTicket.status === 'In Progress' ? 'text-amber-500' : 'text-indigo-500'
                    }`}>
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border-2 shadow-sm ${
                selectedTicket.priority === 'High' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-slate-50 text-slate-600 border-slate-100'
              }`}>
                {selectedTicket.priority} Priority
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50/30 custom-scrollbar">
              {/* Context Summary */}
              <div className="p-8 bg-white border-b border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                    <ShieldCheck size={14} />
                  </div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Initial Incident Report</h3>
                </div>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-100 rounded-full"></div>
                  <p className="text-sm text-slate-700 leading-relaxed pl-6 italic font-medium">
                    "{selectedTicket.description}"
                  </p>
                </div>
              </div>

              {/* Customer Profile Integration */}
              {(() => {
                const customer = getCustomerDetails(selectedTicket.customer);
                return (
                  <div className="p-8 bg-white border-b border-slate-100">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                          <User size={14} />
                        </div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Requester Identity</h3>
                      </div>
                      <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest flex items-center gap-1 group">
                        View CRM Profile <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { icon: <User size={16}/>, label: 'Full Legal Name', value: selectedTicket.customer },
                        { icon: <Building2 size={16}/>, label: 'Organization', value: customer?.company || 'External Guest' },
                        { icon: <Mail size={16}/>, label: 'Secure Email', value: customer?.email || 'N/A' },
                        { icon: <Phone size={16}/>, label: 'Direct Line', value: customer?.phone || 'N/A' }
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100 transition-all hover:bg-white hover:shadow-sm">
                          <div className="text-slate-400 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">{item.icon}</div>
                          <div className="min-w-0">
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-0.5 leading-none">{item.label}</p>
                            <p className="text-xs font-bold text-slate-900 truncate">{item.value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Conversation History */}
              <div className="p-8">
                <div className="flex items-center justify-center mb-10">
                  <div className="h-[1px] flex-1 bg-slate-100"></div>
                  <div className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <MessageSquare size={10} />
                    Audit Trail
                  </div>
                  <div className="h-[1px] flex-1 bg-slate-100"></div>
                </div>

                <div className="space-y-8 mb-8">
                  {selectedTicket.messages.map((msg, i) => (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${msg.isAdmin ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <div className={`group relative max-w-[85%] p-5 rounded-3xl text-sm shadow-sm transition-all hover:shadow-md ${
                        msg.isAdmin 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-900 border border-slate-200 rounded-tl-none'
                      }`}>
                        <p className="leading-relaxed font-medium">{msg.text}</p>
                        
                        {/* Status/Sender indicator */}
                        <div className={`absolute -bottom-6 flex items-center gap-2 ${msg.isAdmin ? 'right-0 flex-row-reverse' : 'left-0'}`}>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.sender}</span>
                          <span className="text-[10px] text-slate-300">•</span>
                          <span className="text-[10px] font-bold text-slate-400">{msg.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer / Smart Reply Input */}
            <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
              <form onSubmit={handleSendReply} className="flex items-center gap-4">
                <div className="relative flex-1">
                  <input 
                    type="text" 
                    placeholder="Message customer..."
                    disabled={isSending}
                    className="w-full p-4 pl-6 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 disabled:opacity-50"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    <button type="button" className="p-2 text-slate-300 hover:text-indigo-500 transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
                <button 
                  type="submit"
                  disabled={!replyText.trim() || isSending}
                  className="p-4 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 disabled:shadow-none flex items-center justify-center min-w-[56px]"
                >
                  {isSending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <Send size={20} className="transform rotate-12" />
                  )}
                </button>
              </form>
              <div className="flex gap-4 mt-4 px-2">
                <button 
                  type="button"
                  onClick={() => setReplyText("We are currently investigating the issue. Will update shortly.")}
                  className="text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-full hover:bg-indigo-50 transition-all"
                >
                  Quick: Under Investigation
                </button>
                <button 
                  type="button"
                  onClick={() => setReplyText("The reported issue has been resolved. Please confirm.")}
                  className="text-[9px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest border border-slate-100 px-3 py-1 rounded-full hover:bg-emerald-50 transition-all"
                >
                  Quick: Resolution Confirmation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
