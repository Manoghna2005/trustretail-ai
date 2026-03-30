import React from 'react';
import { 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  ShoppingCart, 
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { toast } from 'sonner';

export default function SystemDemo() {
  const [step, setStep] = React.useState(0);

  const demoSteps = [
    {
      title: "Shop Owner Updates Stock",
      desc: "A retailer marks 'Organic Milk' as In Stock with 15 units. The system logs the timestamp and update frequency.",
      icon: RefreshCw,
      color: "indigo"
    },
    {
      title: "Customer Browses & Buys",
      desc: "A customer sees the live stock and purchases 1 unit. The inventory decreases to 14 automatically.",
      icon: ShoppingCart,
      color: "green"
    },
    {
      title: "Accuracy Verification",
      desc: "The system compares the shop's update with the actual sale. High accuracy boosts the Reliability Score.",
      icon: CheckCircle2,
      color: "blue"
    },
    {
      title: "Handling Complaints",
      desc: "If a customer reports 'Wrong Info', the AI analyzes the claim and may drop the shop's trust score.",
      icon: AlertCircle,
      color: "red"
    },
    {
      title: "AI Trust Scoring",
      desc: "Gemini AI evaluates all behavior and assigns an Incentive Tier (e.g., Gold) to the honest retailer.",
      icon: ShieldCheck,
      color: "purple"
    }
  ];

  const nextStep = () => {
    if (step < demoSteps.length - 1) {
      setStep(step + 1);
      toast.info(`Simulating: ${demoSteps[step + 1].title}`);
    } else {
      setStep(0);
      toast.success("Demo simulation completed!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-black text-slate-800 tracking-tight">System Workflow Demo</h2>
        <p className="text-slate-500">Experience how the TrustRetail AI ecosystem works in real-time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {demoSteps.map((s, idx) => (
          <div 
            key={idx}
            className={cn(
              "p-4 rounded-2xl border transition-all duration-300",
              step === idx ? "bg-white border-indigo-500 shadow-lg scale-105 ring-1 ring-indigo-500" : "bg-slate-50 border-slate-200 opacity-50 grayscale"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center mb-3",
              s.color === 'indigo' ? "bg-indigo-100 text-indigo-600" :
              s.color === 'green' ? "bg-green-100 text-green-600" :
              s.color === 'blue' ? "bg-blue-100 text-blue-600" :
              s.color === 'red' ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-600"
            )}>
              <s.icon size={20} />
            </div>
            <h4 className="text-xs font-bold text-slate-800 mb-1">{s.title}</h4>
            <div className="w-full bg-slate-200 h-1 rounded-full mt-2">
              {step === idx && <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 3 }} className="bg-indigo-500 h-full rounded-full" />}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 p-12 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
          <motion.div 
            animate={{ width: `${((step + 1) / demoSteps.length) * 100}%` }}
            className="h-full bg-indigo-600"
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <div className={cn(
              "w-16 h-16 rounded-3xl flex items-center justify-center mb-4",
              demoSteps[step].color === 'indigo' ? "bg-indigo-100 text-indigo-600" :
              demoSteps[step].color === 'green' ? "bg-green-100 text-green-600" :
              demoSteps[step].color === 'blue' ? "bg-blue-100 text-blue-600" :
              demoSteps[step].color === 'red' ? "bg-red-100 text-red-600" : "bg-purple-100 text-purple-600"
            )}>
              {React.createElement(demoSteps[step].icon, { size: 32 })}
            </div>
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{demoSteps[step].title}</h3>
              <p className="text-lg text-slate-500 leading-relaxed">{demoSteps[step].desc}</p>
            </motion.div>
            
            <button 
              onClick={nextStep}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 group"
            >
              {step === demoSteps.length - 1 ? "Restart Demo" : "Next Step"}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="w-full md:w-80 h-80 bg-slate-50 rounded-[32px] border border-slate-200 flex items-center justify-center relative">
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="w-48 h-48 bg-indigo-500/5 rounded-full animate-ping" />
            </div>
            <div className="relative z-10 bg-white p-6 rounded-3xl shadow-xl border border-slate-100 w-64">
               <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">System Status</p>
                    <p className="text-sm font-bold text-slate-800">Processing...</p>
                  </div>
               </div>
               <div className="space-y-2">
                  <div className="h-2 bg-slate-100 rounded-full w-full" />
                  <div className="h-2 bg-slate-100 rounded-full w-3/4" />
                  <div className="h-2 bg-indigo-500 rounded-full w-1/2" />
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
