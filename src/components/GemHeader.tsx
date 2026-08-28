import React from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Zap, ChevronLeft, Award } from 'lucide-react';

interface GemHeaderProps {
  showBack?: boolean;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}

export const GemHeader: React.FC<GemHeaderProps> = ({
  showBack = false,
  onBack,
  title,
  subtitle
}) => {
  const { gems, playerProfile, goBack, navigateTo, currentScreen } = useGame();

  const handleBack = onBack || goBack;

  return (
    <header className="sticky top-0 z-30 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5 transition-all">
      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
        {/* Left Side: Avatar or Back Button */}
        <div className="flex items-center gap-2.5 min-w-0">
          {showBack ? (
            <button
              id="header-back-button"
              onClick={handleBack}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 hover:bg-slate-800 hover:text-white active:scale-95 transition-all"
              aria-label="Go Back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <div
              onClick={() => navigateTo('profile')}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={playerProfile.avatar}
                  alt={playerProfile.name}
                  className="w-9 h-9 rounded-full object-cover border-2 border-amber-400/80 group-hover:border-amber-300 transition-all shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black px-1 rounded-full border border-slate-950 shadow">
                  L{playerProfile.level}
                </div>
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-200 leading-tight group-hover:text-amber-400 transition-colors">
                  {playerProfile.name}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Award className="w-2.5 h-2.5 text-amber-400" />
                  {playerProfile.rank}
                </div>
              </div>
            </div>
          )}

          {title && (
            <div className="min-w-0">
              <h1 className="text-base font-extrabold text-white truncate tracking-tight font-display">
                {title}
              </h1>
              {subtitle && (
                <p className="text-[11px] text-slate-400 truncate -mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Energy & Prominent Gem Balance */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Energy */}
          <div
            onClick={() => navigateTo('play_game')}
            className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 px-2 py-1 rounded-lg text-[11px] font-bold text-amber-300 cursor-pointer hover:bg-slate-800/80 active:scale-95 transition-all"
            title="Energy: Play games to earn gems"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{playerProfile.energy}/{playerProfile.maxEnergy}</span>
          </div>

          {/* Prominent Gem Balance Chip */}
          <div
            id="header-gem-balance-chip"
            onClick={() => {
              if (currentScreen !== 'earn_gems') {
                navigateTo('earn_gems');
              }
            }}
            className="group relative flex items-center gap-1.5 bg-gradient-to-r from-sky-950/90 via-cyan-900/80 to-blue-950/90 border border-cyan-500/40 hover:border-cyan-400 px-2.5 py-1 rounded-xl cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.25)] hover:shadow-[0_0_16px_rgba(6,182,212,0.4)] active:scale-95 transition-all"
            title="Click to view Gem Earnings & Missions"
          >
            <span className="text-base animate-gem-glow inline-block select-none">💎</span>
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-black tracking-tight text-cyan-200 group-hover:text-white transition-colors leading-none font-display">
                {gems.toLocaleString()}
              </span>
              <span className="text-[9px] font-medium text-cyan-400/90 group-hover:text-cyan-300 leading-tight">
                GEMS
              </span>
            </div>
            <Sparkles className="w-3 h-3 text-cyan-400 ml-0.5 opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </header>
  );
};
