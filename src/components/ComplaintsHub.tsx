import React from 'react';
import { Complaint } from '../types';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Search,
  MessageSquare,
  Flag
} from 'lucide-react';
import { formatDate, cn } from '../lib/utils';

interface ComplaintsHubProps {
  complaints: Complaint[];
  onResolve: (id: string) => void;
}

export default function ComplaintsHub({ complaints, onResolve }: ComplaintsHubProps) {
  const [filter, setFilter] = React.useState<string>('All');

  const filteredComplaints = filter === 'All' 
    ? complaints 
    : complaints.filter(c => c.status === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search complaints..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {['All', 'Pending', 'Resolved', 'Flagged'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-bold transition-all",
                filter === f 
                  ? "bg-indigo-600 text-white shadow-sm" 
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredComplaints.length > 0 ? (
          filteredComplaints.map((complaint) => (
            <div 
              key={complaint.id} 
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                  complaint.status === 'Pending' ? "bg-amber-100 text-amber-600" :
                  complaint.status === 'Resolved' ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                )}>
                  <AlertCircle size={24} />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-lg">{complaint.shopName}</h4>
                      <p className="text-sm text-slate-500 font-medium">Issue with: <span className="text-indigo-600">{complaint.productName}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        complaint.issueType === 'Not in stock' ? "bg-red-100 text-red-700" :
                        complaint.issueType === 'Wrong info' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                      )}>
                        {complaint.issueType}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <Clock size={14} />
                        {formatDate(complaint.timestamp)}
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <div className="flex gap-2 text-slate-600 italic text-sm">
                      <MessageSquare size={16} className="shrink-0 mt-1 opacity-50" />
                      <p>"{complaint.comment}"</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        complaint.status === 'Pending' ? "bg-amber-500" :
                        complaint.status === 'Resolved' ? "bg-green-500" : "bg-red-500"
                      )} />
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{complaint.status}</span>
                    </div>
                    
                    {complaint.status === 'Pending' && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => onResolve(complaint.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <CheckCircle2 size={14} />
                          Resolve
                        </button>
                        <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
                          <Flag size={14} />
                          Flag Fraud
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <CheckCircle2 size={48} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-lg font-bold text-slate-700">No complaints found</h3>
            <p className="text-slate-400">All systems are running smoothly. No issues reported for this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
