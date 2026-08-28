import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, RotateCcw, FileText, ChevronDown, ChevronUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { ScreenType } from '../types';

export const DemoGuideBar: React.FC = () => {
  const {
    currentScreen,
    navigateTo,
    resetDemo,
    setShowPrototypeNotes,
    gems,
    missions,
    selectProduct,
    products
  } = useGame();

  const [collapsed, setCollapsed] = useState(false);

  const steps: { number: number; label: string; screen: ScreenType; completed: boolean }[] = [
    { number: 1, label: 'Game Home', screen: 'home', completed: currentScreen !== 'home' },
    { number: 2, label: 'Loot Market', screen: 'loot_market', completed: currentScreen !== 'home' && currentScreen !== 'loot_market' },
    { number: 3, label: 'Myntra Detail', screen: 'product_detail', completed: currentScreen === 'earn_gems' || currentScreen === 'checkout' || currentScreen === 'success' || currentScreen === 'my_rewards' },
    { number: 4, label: 'Earn 650💎', screen: 'earn_gems', completed: missions.every(m => m.completed) || gems >= 4500 },
    { number: 5, label: 'Checkout', screen: 'checkout', completed: currentScreen === 'success' || currentScreen === 'my_rewards' },
    { number: 6, label: 'Reward Unlocked', screen: 'success', completed: currentScreen === 'my_rewards' },
    { number: 7, label: 'My Rewards', screen: 'my_rewards', completed: currentScreen === 'my_rewards' }
  ];

  const handleStepClick = (screen: ScreenType) => {
    if (screen === 'product_detail' || screen === 'earn_gems' || screen === 'checkout') {
      const myntra = products.find(p => p.id === 'myntra-1000') || products[0];
      selectProduct(myntra, false);
    }
    navigateTo(screen);
  };

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-xs text-slate-300">
      <div className="max-w-4xl mx-auto px-3 py-1.5 flex items-center justify-between gap-2">
        {/* Left: Tag & Title */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="bg-amber-400/10 text-amber-400 border border-amber-400/30 px-2 py-0.5 rounded font-black text-[10px] uppercase tracking-wider shrink-0">
            PlaySuper Intern Demo
          </span>
          <span className="font-semibold text-slate-200 truncate hidden sm:inline">
            QuestRush + Loot Market Interactive Prototype
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            id="demo-notes-button"
            onClick={() => setShowPrototypeNotes(true)}
            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-cyan-200 border border-slate-700 px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all"
            title="Read Product Thinking & Assumptions"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Product Notes</span>
          </button>

          <button
            id="demo-reset-button"
            onClick={resetDemo}
            className="flex items-center gap-1 bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/40 px-2.5 py-1 rounded-lg font-medium text-[11px] transition-all"
            title="Reset to 3,850 Gems & Initial State"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Reset</span>
          </button>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title={collapsed ? 'Show Demo Flow Steps' : 'Hide Demo Flow Steps'}
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Interactive Step Strip */}
      {!collapsed && (
        <div className="bg-slate-950/60 border-t border-slate-800/60 px-3 py-1.5 overflow-x-auto no-scrollbar">
          <div className="max-w-4xl mx-auto flex items-center gap-1 sm:gap-2 min-w-max text-[11px]">
            <span className="text-[10px] uppercase font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Demo Path:
            </span>
            {steps.map((s, idx) => {
              const isCurrent =
                (s.screen === currentScreen) ||
                (s.screen === 'product_detail' && currentScreen === 'product_detail');

              return (
                <React.Fragment key={s.screen}>
                  <button
                    onClick={() => handleStepClick(s.screen)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full border transition-all ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-extrabold shadow-sm'
                        : s.completed
                        ? 'bg-slate-900 text-emerald-400 border-emerald-500/30 hover:bg-slate-800'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {s.completed && !isCurrent ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    ) : (
                      <span className={`w-3.5 h-3.5 rounded-full text-[9px] flex items-center justify-center font-black ${
                        isCurrent ? 'bg-slate-950 text-amber-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {s.number}
                      </span>
                    )}
                    <span>{s.label}</span>
                  </button>
                  {idx < steps.length - 1 && (
                    <ArrowRight className="w-2.5 h-2.5 text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
