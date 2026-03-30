import React from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  AlertCircle, 
  ShieldCheck, 
  FileText, 
  PlayCircle,
  Menu,
  X
} from 'lucide-react';
import { UserRole } from '../types';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export default function Layout({ children, activeRole, onRoleChange }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navItems = [
    { id: 'Project Plan', icon: FileText, label: 'Project Plan' },
    { id: 'System Demo', icon: PlayCircle, label: 'System Demo' },
    { id: 'Shop Owner', icon: Store, label: 'Shop Owner' },
    { id: 'Customer', icon: Users, label: 'Customer' },
    { id: 'Complaints Hub', icon: AlertCircle, label: 'Complaints Hub' },
    { id: 'Admin', icon: ShieldCheck, label: 'Admin Panel' },
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-white border-r border-slate-200 flex flex-col z-20"
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-slate-800 tracking-tight">TrustRetail AI</span>
            </div>
          )}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onRoleChange(item.id as UserRole)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeRole === item.id 
                  ? "bg-indigo-50 text-indigo-600 shadow-sm" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-transform duration-200",
                activeRole === item.id ? "scale-110" : "group-hover:scale-110"
              )} />
              {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100">
          {isSidebarOpen ? (
            <div className="bg-slate-50 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Active Role</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-bold text-slate-700">{activeRole}</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-bottom border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-bold text-slate-800">{activeRole} View</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold border border-amber-100">
              <AlertCircle size={14} />
              <span>System Status: Operational</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
              JD
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 bg-[#F8FAFC]">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
