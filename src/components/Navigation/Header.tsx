import React from 'react';
import { Settings, Wallet, Smartphone, Monitor, ShieldCheck, Plus } from 'lucide-react';
import { UserBudget } from '../../types/expense';
import { getCurrentMonthName } from '../../utils/formatters';

interface HeaderProps {
  budget: UserBudget;
  onOpenSettings: () => void;
  onOpenBudget: () => void;
  isMobileFrame: boolean;
  onToggleMobileFrame: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  budget,
  onOpenSettings,
  onOpenBudget,
  isMobileFrame,
  onToggleMobileFrame,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F8FAFC]/90 backdrop-blur-md border-b border-slate-200/60 px-4 py-3 sm:py-3.5 transition-all">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        {/* Brand Lockup */}
        <div className="flex items-center space-x-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#00685f] to-emerald-500 text-white shadow-md shadow-teal-900/20">
            <span className="font-display font-black text-lg">S</span>
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <h1 className="font-display text-lg font-extrabold tracking-tight text-slate-900">
                Spendly
              </h1>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                PRO
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400">
              {getCurrentMonthName()}
            </p>
          </div>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center space-x-1.5">
          {/* Quick Currency / Budget Pill */}
          <button
            onClick={onOpenBudget}
            className="flex items-center space-x-1 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 px-2.5 py-1 text-xs font-bold text-slate-700 shadow-2xs transition-all active:scale-95"
            title="Configure Budget & Currency"
          >
            <Wallet size={13} className="text-teal-700" />
            <span className="tabular-nums">{budget.currencySymbol}</span>
          </button>

          {/* Device Frame View Toggle (Mobile vs Expanded) */}
          <button
            onClick={onToggleMobileFrame}
            className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-600 transition-all active:scale-95 shadow-2xs"
            title={isMobileFrame ? 'Expand to fluid layout' : 'Simulate Android mobile frame'}
          >
            {isMobileFrame ? <Monitor size={15} /> : <Smartphone size={15} />}
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 text-slate-600 hover:text-slate-900 transition-all active:scale-95 shadow-2xs"
            title="Settings & Data Export"
          >
            <Settings size={15} />
          </button>
        </div>
      </div>
    </header>
  );
};
