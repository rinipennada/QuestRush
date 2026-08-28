import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GemHeader } from '../components/GemHeader';
import {
  Award,
  Flame,
  Gift,
  RotateCcw,
  Sparkles,
  Shield,
  Star,
  Swords,
  Crown,
  CheckCircle2
} from 'lucide-react';

export const ProfileScreen: React.FC = () => {
  const {
    playerProfile,
    setPlayerAlias,
    gems,
    redeemedRewards,
    resetDemo,
    navigateTo,
    stageRecords,
    unlockedStage
  } = useGame();

  const [customInput, setCustomInput] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);

  // Calculate total stars
  const totalStars = Object.values(stageRecords || {}).reduce((acc: number, curr: { stars: number }) => acc + (curr?.stars || 0), 0);

  const availableTitles = playerProfile.titles || [
    'Vixen Queen',
    'Warrior Princess',
    'Cyber Valkyrie',
    'Neon Empress',
    'Shadow Slayer'
  ];

  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-slate-100 flex flex-col">
      {/* Header */}
      <GemHeader
        title="Warrior Identity"
        subtitle="Rank, Aliases & Campaign Milestones"
      />

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-3 space-y-4">
        {/* PLAYER AVATAR & LEVEL HERO */}
        <section className="rounded-3xl bg-gradient-to-b from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/40 p-5 shadow-xl text-center relative overflow-hidden">
          <div className="relative inline-block mb-3">
            <img
              src={playerProfile.avatar}
              alt={playerProfile.name}
              className="w-24 h-24 rounded-3xl object-cover border-4 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.4)] mx-auto"
            />
            <div className="absolute -bottom-2 -right-1 bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-0.5 rounded-full border-2 border-slate-950 font-display shadow">
              LVL {playerProfile.level}
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 border border-amber-400/40 rounded-full text-xs font-black text-amber-300 font-display mb-1">
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>{playerProfile.alias}</span>
          </div>

          <h2 className="text-2xl font-black text-white font-display">
            {playerProfile.name}
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {playerProfile.handle}
          </p>

          <div className="mt-2 inline-flex items-center gap-1.5 bg-purple-950/80 border border-purple-500/40 px-3.5 py-1 rounded-full text-xs font-bold text-purple-200">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            {playerProfile.rank}
          </div>

          {/* Level Progress */}
          <div className="mt-4 pt-4 border-t border-slate-800 text-left">
            <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
              <span>Next Level (Lvl 25 Master)</span>
              <span className="text-cyan-300">{playerProfile.currentXp} / {playerProfile.nextLevelXp} XP</span>
            </div>
            <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${(playerProfile.currentXp / playerProfile.nextLevelXp) * 100}%` }}
              />
            </div>
          </div>
        </section>

        {/* ALIAS SWITCHER */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 font-display">
                Select Gamer Title & Alias
              </h3>
            </div>
            <span className="text-[10px] text-amber-400 font-bold">
              Instant Sync
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {availableTitles.map((title) => {
              const isSelected = playerProfile.alias === title;
              return (
                <button
                  key={title}
                  id={`title-select-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  onClick={() => setPlayerAlias(title)}
                  className={`p-2.5 rounded-2xl border text-xs font-extrabold flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 border-white shadow-[0_0_15px_rgba(245,158,11,0.3)] scale-[1.02]'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{title}</span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 fill-slate-950 text-amber-400 shrink-0" />}
                </button>
              );
            })}
          </div>
        </section>

        {/* CAMPAIGN & COMBAT STATS */}
        <section className="grid grid-cols-2 gap-2.5">
          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Campaign Stars
            </div>
            <div className="text-xl font-black text-amber-300 font-display">
              {totalStars} / 24 ⭐
            </div>
            <span className="text-[10px] text-slate-400">Stages 1–{unlockedStage} Unlocked</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
              <span className="text-base">💎</span> Current Gems
            </div>
            <div className="text-xl font-black text-cyan-300 font-display">
              {gems.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">Available to redeem</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
              <span className="text-base">💸</span> Total Cash Out
            </div>
            <div className="text-xl font-black text-emerald-400 font-display">
              ₹{(playerProfile.totalCashOutInr || 0).toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">Direct UPI transfers</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
              <span className="text-base">💰</span> Vouchers Saved
            </div>
            <div className="text-xl font-black text-amber-300 font-display">
              ₹{playerProfile.totalMoneySaved.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-400">Real commerce savings</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
              <Flame className="w-4 h-4 text-rose-400" /> Active Streak
            </div>
            <div className="text-xl font-black text-white font-display">
              {playerProfile.streakDays} Days
            </div>
            <span className="text-[10px] text-rose-400 font-semibold">+100 💎 daily bonus</span>
          </div>
        </section>

        {/* ACCOUNT & BALANCE CONTROLS */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-2.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-display">
            Account & Locker Shortcuts
          </h3>

          <div className="flex items-center justify-between gap-2">
            <button
              onClick={resetDemo}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-rose-950/40 hover:bg-rose-950/70 border border-rose-500/30 text-rose-300 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Balance</span>
            </button>

            <button
              onClick={() => navigateTo('my_rewards')}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>My Rewards Locker ({redeemedRewards.length})</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};
