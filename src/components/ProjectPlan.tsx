import React from 'react';
import { 
  Lightbulb, 
  Target, 
  Cpu, 
  ShieldCheck, 
  TrendingUp, 
  Users,
  Layers,
  Zap,
  ArrowRight
} from 'lucide-react';
import { motion } from 'motion/react';

export default function ProjectPlan() {
  const sections = [
    {
      title: "Problem Statement",
      icon: Target,
      color: "red",
      content: "Local retail inventory data is often outdated or inaccurate. Customers face 'phantom stock' issues where items listed as 'available' are actually out of stock, leading to wasted time and poor user experience."
    },
    {
      title: "Proposed Solution",
      icon: Lightbulb,
      color: "indigo",
      content: "A trust-based inventory monitoring system that uses AI to score shop reliability. By incentivizing honest updates and penalizing inaccuracies through customer feedback, we create a self-regulating trust layer."
    },
    {
      title: "AI Integration",
      icon: Cpu,
      color: "purple",
      content: "Gemini AI analyzes behavioral patterns: update frequency, accuracy rates, and feedback trends to predict a Reliability Score. This score determines the shop's visibility and incentive tier."
    },
    {
      title: "Revenue Model",
      icon: TrendingUp,
      color: "green",
      content: "Subscription tiers for retailers to access advanced analytics, featured placement for high-reliability shops, and a small commission on verified 'Trust-Buy' transactions."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-xs font-bold border border-indigo-100"
        >
          <Zap size={14} />
          <span>Next-Gen Retail Intelligence</span>
        </motion.div>
        <h1 className="text-5xl font-black text-slate-800 tracking-tight leading-tight">
          AI-Powered Retail <br />
          <span className="text-indigo-600">Reliability System</span>
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Building trust between local retailers and customers through behavioral analytics and AI-driven scoring.
        </p>
      </div>

      {/* Core Concept Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section, idx) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110",
              section.color === 'red' ? "bg-red-50 text-red-600" :
              section.color === 'indigo' ? "bg-indigo-50 text-indigo-600" :
              section.color === 'purple' ? "bg-purple-50 text-purple-600" : "bg-green-50 text-green-600"
            )}>
              <section.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">{section.title}</h3>
            <p className="text-slate-500 leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </div>

      {/* Technical Flow */}
      <div className="bg-slate-900 rounded-[40px] p-12 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-12 flex items-center gap-3">
            <Layers className="text-indigo-400" />
            System Architecture
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FlowStep 
              number="01" 
              title="Data Ingestion" 
              desc="Shop owners update stock via dashboard. Every change is logged with timestamp and quantity." 
            />
            <FlowStep 
              number="02" 
              title="AI Processing" 
              desc="Gemini API analyzes update patterns, delays, and customer feedback to calculate trust metrics." 
            />
            <FlowStep 
              number="03" 
              title="Trust Output" 
              desc="Reliability Score is published. High-trust shops get incentives; low-trust shops are flagged." 
            />
          </div>
        </div>
      </div>

      {/* User Roles */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-slate-800 text-center">Multi-Role Ecosystem</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RoleCard 
            role="Shop Owner" 
            desc="Manages inventory, monitors reliability, and earns incentives for accurate updates." 
            icon={Store}
          />
          <RoleCard 
            role="Customer" 
            desc="Browses live stock, makes purchases, and reports inaccuracies to maintain system integrity." 
            icon={Users}
          />
          <RoleCard 
            role="Admin" 
            desc="Monitors platform health, manages fraud flags, and analyzes market reliability trends." 
            icon={ShieldCheck}
          />
        </div>
      </div>
    </div>
  );
}

function FlowStep({ number, title, desc }: any) {
  return (
    <div className="space-y-4">
      <div className="text-4xl font-black text-indigo-500/30">{number}</div>
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function RoleCard({ role, desc, icon: Icon }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-4">
      <div className="p-3 bg-slate-50 rounded-2xl text-indigo-600">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="font-bold text-slate-800 mb-1">{role}</h4>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

import { cn } from '../lib/utils';
import { Store } from 'lucide-react';
