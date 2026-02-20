
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { TrendingUp, Users, DollarSign, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MOCK_ACTIVITIES } from '../constants';

const data = [
  { name: 'Mon', sales: 4000, leads: 2400 },
  { name: 'Tue', sales: 3000, leads: 1398 },
  { name: 'Wed', sales: 2000, leads: 9800 },
  { name: 'Thu', sales: 2780, leads: 3908 },
  { name: 'Fri', sales: 1890, leads: 4800 },
  { name: 'Sat', sales: 2390, leads: 3800 },
  { name: 'Sun', sales: 3490, leads: 4300 },
];

const StatCard = ({ title, value, change, isPositive, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} text-white`}>
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-semibold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {change}
      </div>
    </div>
    <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Operations Overview</h1>
          <p className="text-slate-500">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50">Download Report</button>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Add Lead</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value="$428,500" change="+12.5%" isPositive={true} icon={DollarSign} color="bg-indigo-600" />
        <StatCard title="New Leads" value="154" change="+8.2%" isPositive={true} icon={Users} color="bg-emerald-600" />
        <StatCard title="Conversion Rate" value="3.2%" change="-0.4%" isPositive={false} icon={Target} color="bg-amber-600" />
        <StatCard title="Avg Deal Value" value="$12,400" change="+18.7%" isPositive={true} icon={TrendingUp} color="bg-violet-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Sales Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="sales" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {MOCK_ACTIVITIES.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                  activity.type === 'sale' ? 'bg-indigo-500' : 
                  activity.type === 'support' ? 'bg-amber-500' : 'bg-slate-300'
                }`} />
                <div>
                  <p className="text-sm text-slate-900 font-medium">{activity.action}</p>
                  <div className="flex gap-2 items-center text-xs text-slate-400 mt-1">
                    <span>{activity.user}</span>
                    <span>•</span>
                    <span>{activity.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2 text-indigo-600 font-medium text-sm hover:underline">View all activities</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
