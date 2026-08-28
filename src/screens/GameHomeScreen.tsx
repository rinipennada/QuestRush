import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GemHeader } from '../components/GemHeader';
import { sound } from '../utils/audio';
import {
  Play,
  Gift,
  Wallet,
  Sparkles,
  Flame,
  CheckCircle2,
  ChevronRight,
  Swords,
  Trophy,
  ArrowRight
} from 'lucide-react';

export const GameHomeScreen: React.FC = () => {
  const {
    navigateTo,
    gems,
    playerProfile,
    earnGemsFromPlay,
    unlockedStage,
    setSelectedStage,
    setStoreMode
  } = useGame();

  const [dailyClaimed, setDailyClaimed] = useState(false);
  const [missionClaimed, setMissionClaimed] = useState(false);

  const handlePlayLevel = (lvl: number) => {
    sound.playTap();
    setSelectedStage(lvl);
    navigateTo('play_game');
  };

  const handleOpenVouchers = () => {
    sound.playTap();
    setStoreMode('vouchers');
    navigateTo('loot_market');
  };

  const handleOpenCashOut = () => {
    sound.playTap();
    setStoreMode('cashout');
    navigateTo('loot_market');
  };

  const handleClaimStreak = () => {
    if (dailyClaimed) return;
    sound.playPowerup();
    setDailyClaimed(true);
    earnGemsFromPlay(100, "Daily Login Streak Bonus");
  };

  const handleClaimMission = () => {
    if (missionClaimed) return;
    sound.playGem();
    setMissionClaimed(true);
    earnGemsFromPlay(300, "Daily Arena Mission Bonus");
  };

  const cashEquivalentInr = Math.floor(gems / 10);

  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-slate-100 flex flex-col">
      {/* Top Header */}
      <GemHeader />

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-3 space-y-4">
        {/* ========================================================================= */}
        {/* 1. CLEAN PLAYER HERO & QUICK LAUNCH */}
        {/* ========================================================================= */}
        <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 p-4 shadow-lg space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 overflow-hidden shrink-0">
                <img
                  src={playerProfile.avatar}
                  alt={playerProfile.alias}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-white font-display">
                    {playerProfile.alias}
                  </span>
                  <span className="text-[10px] bg-amber-400/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-400/30">
                    Lvl {playerProfile.level}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {playerProfile.energy}/{playerProfile.maxEnergy} Energy • {playerProfile.streakDays}d Streak 🔥
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-black text-cyan-300 font-mono block">
                {gems.toLocaleString()} 💎
              </span>
              <span className="text-[10px] font-bold text-emerald-400">
                = ₹{cashEquivalentInr} Cash
              </span>
            </div>
          </div>

          {/* Primary Quick Play CTA */}
          <button
            id="quick-play-arena-button"
            onClick={() => handlePlayLevel(unlockedStage)}
            className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm font-display flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-transform active:scale-98 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>Play Arena Stage {unlockedStage} (Earn +350 💎)</span>
          </button>
        </section>

        {/* ========================================================================= */}
        {/* 2. DUAL-PRIVILEGE REWARDS HUB: VOUCHERS OR REAL MONEY */}
        {/* ========================================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Spend or Cash-Out Gems
            </h2>
            <span className="text-[10px] text-amber-400 font-bold">
              Dual Privilege
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Card 1: Brand Vouchers */}
            <div
              id="home-voucher-store-card"
              onClick={handleOpenVouchers}
              className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 p-3.5 flex flex-col justify-between transition-all hover:shadow-lg active:scale-98"
            >
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                  <Gift className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-black text-white font-display group-hover:text-amber-300 transition-colors">
                  Brand Vouchers
                </h3>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Amazon, Swiggy, Myntra, Uber & 50+ brands.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-amber-400">
                <span>Browse</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Instant Cash-Out */}
            <div
              id="home-cashout-upi-card"
              onClick={handleOpenCashOut}
              className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/60 p-3.5 flex flex-col justify-between transition-all hover:shadow-lg active:scale-98"
            >
              <div className="space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Wallet className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-black text-white font-display group-hover:text-emerald-300 transition-colors">
                  Cash-Out to UPI
                </h3>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Direct transfer: 10💎 = ₹1 real bank cash.
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-emerald-400">
                <span>Withdraw ₹{cashEquivalentInr}</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. DAILY REWARDS & BONUS (CLEAN & COMPACT) */}
        {/* ========================================================================= */}
        <section className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-400" /> Daily Bonus Quest
            </span>
            <span className="text-cyan-300 font-mono">+400 💎 Available</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Daily Streak Claim */}
            <button
              onClick={handleClaimStreak}
              disabled={dailyClaimed}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                dailyClaimed
                  ? 'bg-slate-950/60 border-slate-800 text-slate-500 cursor-default'
                  : 'bg-slate-950 border-amber-400/40 hover:border-amber-400 text-slate-200'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-amber-400">Day 8 Streak</div>
              <div className="font-extrabold text-white mt-0.5">
                {dailyClaimed ? 'Claimed (+100💎)' : 'Claim +100 💎'}
              </div>
            </button>

            {/* Daily Mission Claim */}
            <button
              onClick={handleClaimMission}
              disabled={missionClaimed}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                missionClaimed
                  ? 'bg-slate-950/60 border-slate-800 text-slate-500 cursor-default'
                  : 'bg-slate-950 border-cyan-400/40 hover:border-cyan-400 text-slate-200'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-cyan-400">Win 2 Games</div>
              <div className="font-extrabold text-white mt-0.5">
                {missionClaimed ? 'Claimed (+300💎)' : 'Claim +300 💎'}
              </div>
            </button>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. ARENA STAGES SELECTOR */}
        {/* ========================================================================= */}
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Swords className="w-3.5 h-3.5 text-cyan-400" /> Arena Stages
            </h2>
            <span className="text-[11px] text-cyan-400 font-semibold">
              Stage {unlockedStage} / 8 Unlocked
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((lvl) => {
              const isUnlocked = lvl <= unlockedStage;
              const isCurrent = lvl === unlockedStage;

              return (
                <button
                  key={lvl}
                  id={`stage-button-${lvl}`}
                  onClick={() => isUnlocked && handlePlayLevel(lvl)}
                  disabled={!isUnlocked}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 border-amber-300 font-black shadow-md scale-[1.03]'
                      : isUnlocked
                      ? 'bg-slate-900 text-white border-slate-800 hover:border-slate-600'
                      : 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed'
                  }`}
                >
                  <div className="text-xs font-black font-display">Stage {lvl}</div>
                  <div className="text-[9px] opacity-80 mt-0.5">
                    {isUnlocked ? (lvl < unlockedStage ? '⭐ 3/3' : 'READY') : '🔒 Locked'}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};
