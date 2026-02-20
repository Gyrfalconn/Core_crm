
import React, { useState } from 'react';
import { MOCK_DEALS } from '../constants';
import { Deal } from '../types';
import { Plus, MoreVertical, DollarSign } from 'lucide-react';

const STAGES = ['Prospect', 'Proposal', 'Negotiation', 'Closed Won'];

const Pipeline: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>(MOCK_DEALS);

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Sales Pipeline</h1>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Pipeline Value</p>
            <p className="text-lg font-bold text-indigo-600">$1,452,000</p>
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200">
            Create Deal
          </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-x-auto pb-4">
        {STAGES.map((stage) => (
          <div key={stage} className="min-w-[320px] flex-1 flex flex-col bg-slate-100/50 rounded-2xl p-4 border border-slate-200/60">
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800">{stage}</h3>
                <span className="bg-slate-200 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {deals.filter(d => d.stage === stage).length}
                </span>
              </div>
              <button className="p-1 hover:bg-slate-200 rounded text-slate-500">
                <Plus size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto pr-1">
              {deals.filter(d => d.stage === stage).map(deal => (
                <div key={deal.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600">{deal.title}</h4>
                    <button className="text-slate-300 hover:text-slate-500"><MoreVertical size={14} /></button>
                  </div>
                  <p className="text-xs text-slate-500 mb-4">{deal.company}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-slate-900 font-bold text-sm">
                      <DollarSign size={14} className="text-emerald-500" />
                      {deal.value.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${deal.probability > 70 ? 'bg-emerald-500' : 'bg-amber-400'}`} 
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-slate-400">{deal.probability}%</span>
                    </div>
                  </div>
                </div>
              ))}
              {deals.filter(d => d.stage === stage).length === 0 && (
                <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs italic">
                  No deals in this stage
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pipeline;
