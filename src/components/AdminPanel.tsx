import React from 'react';
import { Shop, Complaint } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  AlertTriangle, 
  Award, 
  Search,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical
} from 'lucide-react';
import { cn } from '../lib/utils';

interface AdminPanelProps {
  shops: Shop[];
  complaints: Complaint[];
}

export default function AdminPanel({ shops, complaints }: AdminPanelProps) {
  const avgReliability = shops.reduce((acc, s) => acc + s.reliabilityScore, 0) / shops.length;
  const totalIncentives = shops.reduce((acc, s) => acc + s.incentivePoints, 0);
  const suspiciousShops = shops.filter(s => s.isSuspicious).length;

  const chartData = shops.map(s => ({
    name: s.name,
    reliability: s.reliabilityScore * 100,
    complaints: s.complaintsCount
  }));

  const tierData = [
    { name: 'Bronze', value: shops.filter(s => s.incentiveTier === 'Bronze').length, color: '#D97706' },
    { name: 'Silver', value: shops.filter(s => s.incentiveTier === 'Silver').length, color: '#94A3B8' },
    { name: 'Gold', value: shops.filter(s => s.incentiveTier === 'Gold').length, color: '#F59E0B' },
    { name: 'Platinum', value: shops.filter(s => s.incentiveTier === 'Platinum').length, color: '#6366F1' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard 
          title="Avg. System Reliability" 
          value={`${(avgReliability * 100).toFixed(1)}%`} 
          trend="+2.4%" 
          isUp={true}
          icon={TrendingUp}
        />
        <AdminStatCard 
          title="Active Retailers" 
          value={shops.length.toString()} 
          trend="+1" 
          isUp={true}
          icon={Users}
        />
        <AdminStatCard 
          title="Total Incentives" 
          value={totalIncentives.toLocaleString()} 
          trend="+450" 
          isUp={true}
          icon={Award}
        />
        <AdminStatCard 
          title="Fraud Flags" 
          value={suspiciousShops.toString()} 
          trend="-2" 
          isUp={false}
          icon={AlertTriangle}
          isDanger={suspiciousShops > 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Reliability Chart */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center justify-between">
            Shop Reliability Comparison
            <span className="text-xs font-medium text-slate-400">Live Data</span>
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748B', fontSize: 12 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  cursor={{ fill: '#F1F5F9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="reliability" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={entry.reliability > 80 ? '#10B981' : entry.reliability > 50 ? '#F59E0B' : '#EF4444'} 
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incentive Distribution */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Incentive Tier Distribution</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="h-64 w-64 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {tierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-4 flex-1">
              {tierData.map((tier) => (
                <div key={tier.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tier.color }} />
                    <span className="text-sm font-medium text-slate-600">{tier.name}</span>
                  </div>
                  <span className="font-bold text-slate-800">{tier.value} Shops</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Shop Performance Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Retailer Performance Audit</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter shops..."
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                <th className="px-6 py-4">Shop Name</th>
                <th className="px-6 py-4">Reliability</th>
                <th className="px-6 py-4">Accuracy</th>
                <th className="px-6 py-4">Complaints</th>
                <th className="px-6 py-4">Incentives</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shops.map((shop) => (
                <tr key={shop.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{shop.name}</span>
                      <span className="text-xs text-slate-400">{shop.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full",
                            shop.reliabilityScore > 0.8 ? "bg-green-500" : shop.reliabilityScore > 0.5 ? "bg-amber-500" : "bg-red-500"
                          )} 
                          style={{ width: `${shop.reliabilityScore * 100}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-600">{(shop.reliabilityScore * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-600">
                    {(shop.accuracyRate * 100).toFixed(0)}%
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold",
                      shop.complaintsCount > 10 ? "bg-red-100 text-red-700" : "bg-slate-100 text-slate-600"
                    )}>
                      {shop.complaintsCount} Reports
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-600">
                    {shop.incentivePoints.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {shop.isSuspicious ? (
                      <span className="flex items-center gap-1 text-red-600 text-xs font-bold">
                        <AlertTriangle size={12} />
                        Flagged
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-green-600 text-xs font-bold">
                        <CheckCircle2Icon size={12} />
                        Verified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({ title, value, trend, isUp, icon: Icon, isDanger }: any) {
  return (
    <div className={cn(
      "bg-white p-6 rounded-3xl border shadow-sm transition-all",
      isDanger ? "border-red-200 bg-red-50/30" : "border-slate-200"
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className={cn(
          "p-3 rounded-2xl",
          isDanger ? "bg-red-100 text-red-600" : "bg-indigo-50 text-indigo-600"
        )}>
          <Icon size={20} />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold",
          isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        )}>
          {isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
          {trend}
        </div>
      </div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
    </div>
  );
}

import { CheckCircle2 as CheckCircle2Icon } from 'lucide-react';
