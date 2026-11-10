import React from 'react';
import { LayoutDashboard, ReceiptText, Plus, PieChart, Coins } from 'lucide-react';

export type TabId = 'dashboard' | 'expenses' | 'income' | 'statistics';

interface BottomNavProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onOpenAddChoice: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenAddChoice,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-[0_-4px_20px_rgba(15,23,42,0.06)] pb-safe transition-all">
      <div className="max-w-xl mx-auto px-2 h-16 flex items-center justify-around relative">
        {/* Dashboard / Home Tab */}
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'dashboard'
              ? 'text-[#00685f] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div
            className={`flex items-center justify-center w-9 h-7 rounded-full transition-all ${
              activeTab === 'dashboard' ? 'bg-teal-50 text-teal-800' : ''
            }`}
          >
            <LayoutDashboard size={18} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
        </button>

        {/* Expenses Tab */}
        <button
          onClick={() => onTabChange('expenses')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'expenses'
              ? 'text-[#00685f] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div
            className={`flex items-center justify-center w-9 h-7 rounded-full transition-all ${
              activeTab === 'expenses' ? 'bg-teal-50 text-teal-800' : ''
            }`}
          >
            <ReceiptText size={18} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Expenses</span>
        </button>

        {/* Center Prominent Add Button */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={onOpenAddChoice}
            className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#00685f] via-[#0D9488] to-emerald-500 text-white shadow-lg shadow-teal-900/30 hover:shadow-teal-900/50 hover:scale-105 active:scale-95 transition-all ring-4 ring-white"
            aria-label="Add transaction"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
        </div>

        {/* Income Tab (Requirement 1: Dedicated Income section) */}
        <button
          onClick={() => onTabChange('income')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'income'
              ? 'text-emerald-700 font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div
            className={`flex items-center justify-center w-9 h-7 rounded-full transition-all ${
              activeTab === 'income' ? 'bg-emerald-50 text-emerald-700' : ''
            }`}
          >
            <Coins size={18} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Income</span>
        </button>

        {/* Statistics Tab */}
        <button
          onClick={() => onTabChange('statistics')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
            activeTab === 'statistics'
              ? 'text-[#00685f] font-bold'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
        >
          <div
            className={`flex items-center justify-center w-9 h-7 rounded-full transition-all ${
              activeTab === 'statistics' ? 'bg-teal-50 text-teal-800' : ''
            }`}
          >
            <PieChart size={18} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Stats</span>
        </button>
      </div>
    </nav>
  );
};
