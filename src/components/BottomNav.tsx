import React from 'react';
import { useGame } from '../context/GameContext';
import { Home, Gamepad2, ShoppingBag, Gift, User } from 'lucide-react';
import { ScreenType } from '../types';

export const BottomNav: React.FC = () => {
  const { currentScreen, navigateTo, redeemedRewards } = useGame();

  const navItems: { id: ScreenType; label: string; icon: React.FC<{ className?: string }>; isPrimary?: boolean }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'play_game', label: 'Play', icon: Gamepad2 },
    { id: 'loot_market', label: 'Loot Market', icon: ShoppingBag, isPrimary: true },
    { id: 'my_rewards', label: 'Rewards', icon: Gift },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // If in checkout or success screen, hide or simplify nav to reduce distraction if needed, but keeping it accessible or subtle
  const isImmersiveScreen = currentScreen === 'checkout' || currentScreen === 'success';

  if (isImmersiveScreen) {
    return null;
  }

  return (
    <nav className="sticky bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/90 pb-2.5 pt-1.5 px-3 w-full shrink-0 shadow-[0_-8px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentScreen === item.id ||
            (item.id === 'loot_market' && (currentScreen === 'product_detail' || currentScreen === 'earn_gems')) ||
            (item.id === 'home' && currentScreen === 'home');

          if (item.isPrimary) {
            return (
              <button
                key={item.id}
                id="nav-loot-market-button"
                onClick={() => navigateTo('loot_market')}
                className="relative -top-3.5 flex flex-col items-center group focus:outline-none"
                aria-label="Loot Market"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 transform group-hover:scale-105 group-active:scale-95 border ${
                    isActive
                      ? 'bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 text-slate-950 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                      : 'bg-gradient-to-tr from-cyan-600 via-sky-500 to-indigo-600 text-white border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-6 h-6 stroke-[2.5]" />
                    <span className="absolute -top-1.5 -right-2 text-[11px] animate-bounce">💎</span>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-extrabold mt-0.5 tracking-tight font-display transition-colors ${
                    isActive ? 'text-amber-400' : 'text-cyan-300 group-hover:text-white'
                  }`}
                >
                  {item.label}
                </span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 mt-0.5 shadow-[0_0_6px_#f59e0b]"></span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              id={`nav-${item.id}-button`}
              onClick={() => navigateTo(item.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 relative group ${
                isActive ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                {item.id === 'my_rewards' && redeemedRewards.length > 0 && (
                  <span className="absolute -top-1 -right-2.5 bg-cyan-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-slate-950">
                    {redeemedRewards.length}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 font-medium transition-all ${isActive ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="w-1 h-1 rounded-full bg-amber-400 mt-0.5 shadow-[0_0_4px_#f59e0b]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
