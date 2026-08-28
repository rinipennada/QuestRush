import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { activeToast, dismissToast } = useGame();

  if (!activeToast) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm pointer-events-auto">
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-indigo-950 border-2 border-cyan-400/80 rounded-2xl p-3.5 shadow-[0_10px_25px_rgba(6,182,212,0.4)] flex items-center justify-between gap-3 animate-in slide-in-from-top-4 duration-300">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/60 flex items-center justify-center shrink-0">
            <span className="text-xl animate-gem-glow">💎</span>
          </div>
          <div>
            <div className="text-xs font-black text-white font-display flex items-center gap-1.5">
              {activeToast.title}
              {activeToast.gems && (
                <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  +{activeToast.gems} 💎
                </span>
              )}
            </div>
            <div className="text-[11px] text-cyan-200/90 leading-tight mt-0.5">
              {activeToast.message}
            </div>
          </div>
        </div>
        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
