
import React from 'react';
import { MOCK_INVENTORY } from '../constants';
import { Package, Search, Plus, Boxes } from 'lucide-react';

const Inventory: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory Catalog</h1>
          <p className="text-slate-500 text-sm">Track products, services, and stock availability.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100">
            <Plus size={18} />
            Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_INVENTORY.map(item => (
          <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-200 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-slate-50 rounded-xl">
                <Package size={24} className="text-indigo-600" />
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{item.category}</p>
                <p className="text-lg font-bold text-slate-900">${item.price}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-bold text-slate-900 text-lg">{item.name}</h3>
              <p className="text-xs text-slate-400 font-mono mt-1">{item.sku}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2">
                <Boxes size={16} className="text-slate-400" />
                <span className={`text-sm font-bold ${item.stock < 20 ? 'text-rose-500' : 'text-slate-600'}`}>
                  {item.stock} in stock
                </span>
              </div>
              <button className="text-indigo-600 text-sm font-bold hover:underline">Edit Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
