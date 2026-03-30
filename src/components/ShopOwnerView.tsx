import React from 'react';
import { Shop } from '../types';
import { 
  TrendingUp, 
  Package, 
  AlertTriangle, 
  Award, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Gift,
  History,
  Zap
} from 'lucide-react';
import { formatCurrency, formatDate, cn } from '../lib/utils';
import { predictReliability } from '../services/geminiService';
import { toast } from 'sonner';

interface ShopOwnerViewProps {
  shop: Shop;
  onUpdateStock: (shopId: string, productId: string, newQuantity: number) => void;
  onRefreshAI: (shopId: string) => void;
}

export default function ShopOwnerView({ shop, onUpdateStock, onRefreshAI }: ShopOwnerViewProps) {
  const [isPredicting, setIsPredicting] = React.useState(false);

  const handleRefreshAI = async () => {
    setIsPredicting(true);
    toast.info('AI is analyzing your shop behavior...');
    try {
      const result = await predictReliability(
        shop.updateFrequency,
        shop.accuracyRate,
        shop.averageUpdateDelay,
        shop.feedbackScore,
        shop.complaintsCount
      );
      onRefreshAI(shop.id);
      toast.success('Reliability score updated by AI!');
    } catch (error) {
      toast.error('Failed to update AI score');
    } finally {
      setIsPredicting(false);
    }
  };

  const rewards = [
    { id: 1, name: 'Featured Shop Placement', cost: 500, icon: TrendingUp, description: 'Get listed at the top of customer search results for 24h.' },
    { id: 2, name: 'Lower Transaction Fees', cost: 1200, icon: Zap, description: 'Reduce platform fees by 2% for the next 30 days.' },
    { id: 3, name: 'Verified Badge Boost', cost: 800, icon: Award, description: 'Enhanced trust badge that attracts 30% more customers.' },
  ];

  return (
    <div className="space-y-8">
      {/* KPI Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Reliability Score" 
          value={`${(shop.reliabilityScore * 100).toFixed(0)}%`} 
          icon={TrendingUp} 
          color="indigo"
          subtitle={shop.reliabilityReasoning}
        />
        <StatCard 
          title="Incentive Tier" 
          value={shop.incentiveTier} 
          icon={Award} 
          color="amber"
          subtitle={`${shop.incentivePoints} points earned`}
        />
        <StatCard 
          title="Accuracy Rate" 
          value={`${(shop.accuracyRate * 100).toFixed(0)}%`} 
          icon={CheckCircle2} 
          color="green"
          subtitle="Based on customer verification"
        />
        <StatCard 
          title="Active Complaints" 
          value={shop.complaintsCount.toString()} 
          icon={AlertTriangle} 
          color={shop.complaintsCount > 5 ? "red" : "slate"}
          subtitle="Requires attention"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inventory Management */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Package className="text-indigo-600" size={20} />
                Inventory Management
              </h3>
              <button 
                onClick={() => toast.info('Add product feature coming soon!')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-colors"
              >
                Add Product
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                    <th className="px-6 py-4">Product</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Last Updated</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {shop.inventory.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-700">{product.name}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {formatCurrency(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => onUpdateStock(shop.id, product.id, Math.max(0, product.quantity - 1))}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-all"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-bold text-slate-800">{product.quantity}</span>
                          <button 
                            onClick={() => onUpdateStock(shop.id, product.id, product.quantity + 1)}
                            className="w-8 h-8 rounded-lg border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-white hover:border-indigo-300 hover:text-indigo-600 transition-all"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          product.status === 'In Stock' ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {formatDate(product.lastUpdated)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => onUpdateStock(shop.id, product.id, product.quantity === 0 ? 10 : 0)}
                          className={cn(
                            "text-xs font-bold transition-colors",
                            product.quantity === 0 ? "text-indigo-600 hover:text-indigo-700" : "text-red-600 hover:text-red-700"
                          )}
                        >
                          {product.quantity === 0 ? 'Restock' : 'Mark OOS'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Gift className="text-amber-500" size={20} />
              Redeem Rewards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {rewards.map((reward) => (
                <div key={reward.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-amber-200 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <reward.icon size={20} />
                  </div>
                  <h4 className="font-bold text-sm text-slate-800 mb-1">{reward.name}</h4>
                  <p className="text-[10px] text-slate-500 mb-3 leading-relaxed">{reward.description}</p>
                  <button 
                    disabled={shop.incentivePoints < reward.cost}
                    className={cn(
                      "w-full py-2 rounded-lg text-xs font-bold transition-all",
                      shop.incentivePoints >= reward.cost 
                        ? "bg-amber-500 text-white hover:bg-amber-600" 
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    {reward.cost} Points
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights & Activity */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheckIcon className="text-indigo-600" size={20} />
                AI Reliability Analysis
              </h3>
              <button 
                onClick={handleRefreshAI}
                disabled={isPredicting}
                className={cn(
                  "p-2 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all",
                  isPredicting && "animate-spin"
                )}
              >
                <RefreshCw size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "{shop.reliabilityReasoning}"
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Update Frequency</span>
                  <span className="font-bold text-slate-700">{shop.updateFrequency} / week</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full" style={{ width: `${Math.min(100, (shop.updateFrequency / 14) * 100)}%` }} />
                </div>

                <div className="flex justify-between text-sm pt-2">
                  <span className="text-slate-500">Avg. Update Delay</span>
                  <span className="font-bold text-slate-700">{shop.averageUpdateDelay}h</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full" style={{ width: `${Math.min(100, (shop.averageUpdateDelay / 24) * 100)}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
            <h4 className="font-bold mb-2 flex items-center gap-2">
              <Award size={18} />
              Incentive Program
            </h4>
            <p className="text-indigo-100 text-sm mb-4">
              You are currently in the <span className="font-bold text-white uppercase tracking-wider">{shop.incentiveTier}</span> tier. 
              Maintain a score above 90% to reach Platinum.
            </p>
            <div className="flex items-center justify-between bg-white/10 rounded-2xl p-4">
              <div>
                <p className="text-xs text-indigo-200 uppercase font-bold">Points</p>
                <p className="text-2xl font-bold">{shop.incentivePoints}</p>
              </div>
              <button className="px-4 py-2 bg-white text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors">
                Redeem
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <History className="text-indigo-600" size={18} />
              Live Activity
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                  <RefreshCw size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Auto-Update Sync</p>
                  <p className="text-[10px] text-slate-500">Inventory levels synchronized with POS system.</p>
                  <p className="text-[9px] text-indigo-500 mt-1 font-bold">+5 Incentive Points</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 opacity-60">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 size={14} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">Manual Verification</p>
                  <p className="text-[10px] text-slate-500">Stock confirmed by store manager.</p>
                  <p className="text-[9px] text-indigo-500 mt-1 font-bold">+10 Incentive Points</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, subtitle }: any) {
  const colors: any = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    green: "bg-green-50 text-green-600 border-green-100",
    red: "bg-red-50 text-red-600 border-red-100",
    slate: "bg-slate-50 text-slate-600 border-slate-100",
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className={cn("p-3 rounded-2xl border", colors[color])}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-tight line-clamp-2">{subtitle}</p>
    </div>
  );
}

import { ShieldCheck as ShieldCheckIcon } from 'lucide-react';
