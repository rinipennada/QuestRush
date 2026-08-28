import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';
import {
  CheckCircle2,
  Copy,
  Check,
  ShoppingBag,
  Gamepad2,
  Gift,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Share2,
  ExternalLink,
  Flame
} from 'lucide-react';

export const SuccessScreen: React.FC = () => {
  const {
    lastRedemption,
    gems,
    navigateTo,
    setSelectedVoucherModal
  } = useGame();

  const [copied, setCopied] = useState(false);

  const redemption = lastRedemption;

  useEffect(() => {
    // Sound + celebratory confetti on mount
    sound.playPurchase();
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#fbbf24', '#34d399', '#f43f5e', '#a855f7']
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#fbbf24', '#38bdf8']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#34d399', '#a855f7']
        });
      }, 350);
    } catch (e) {
      console.error('Confetti error', e);
    }
  }, []);

  const handleCopy = () => {
    sound.playTap();
    if (redemption?.code) {
      navigator.clipboard.writeText(redemption.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleNav = (screen: 'loot_market' | 'my_rewards' | 'home') => {
    sound.playTap();
    navigateTo(screen);
  };

  if (!redemption) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
        <p className="text-slate-400">No active redemption found.</p>
        <button
          onClick={() => navigateTo('loot_market')}
          className="mt-4 px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
        >
          Go to Loot Market
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pb-20 text-slate-100 flex flex-col justify-between">
      {/* Top Victory Bar */}
      <div className="p-4 text-center pt-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-slate-950 shadow-[0_0_40px_rgba(245,158,11,0.6)] mb-3 animate-bounce">
          <span className="text-4xl">🎉</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display drop-shadow">
          REWARD UNLOCKED!
        </h1>
        <p className="text-xs text-amber-300 font-semibold mt-1">
          You turned your gameplay into a real-world reward.
        </p>
      </div>

      <main className="flex-1 max-w-md mx-auto w-full px-4 space-y-4">
        {/* REWARD CARD */}
        <section className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-amber-400/60 p-5 shadow-2xl space-y-4 relative overflow-hidden">
          {/* Shimmer background */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-transparent pointer-events-none" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 shadow-md">
              <img
                src={redemption.image}
                alt={redemption.productName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-black uppercase text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30">
                {redemption.brand} Voucher
              </span>
              <h2 className="text-base font-black text-white truncate font-display mt-0.5">
                {redemption.productName}
              </h2>
              <p className="text-xs text-emerald-400 font-bold">
                ₹{redemption.value.toLocaleString()} Value
              </p>
            </div>
          </div>

          {/* Redemption Details Tag */}
          <div className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 text-center relative z-10">
            <span className="text-[11px] text-slate-300 block">
              Redeemed using <strong className="text-cyan-300">{redemption.gemsSpent.toLocaleString()} Gems</strong> + <strong className="text-emerald-400">₹{redemption.cashPaid}</strong>
            </span>
          </div>

          {/* Voucher Code Box */}
          <div className="bg-slate-950 border border-amber-400/40 rounded-2xl p-3.5 space-y-2 relative z-10">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase text-slate-400">
              <span>Your Voucher Code</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Saved in My Rewards
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 bg-slate-900 px-3.5 py-2.5 rounded-xl border border-slate-700">
              <code className="font-mono text-base font-black text-amber-400 tracking-wider select-all">
                {redemption.code}
              </code>
              <button
                id="copy-voucher-code-button"
                onClick={handleCopy}
                className="flex items-center gap-1 bg-amber-400/15 hover:bg-amber-400/30 text-amber-300 px-2.5 py-1 rounded-lg text-xs font-bold transition-all active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {redemption.pin && (
              <div className="flex justify-between items-center text-xs text-slate-300 px-1">
                <span className="text-slate-400">Security PIN:</span>
                <span className="font-mono font-bold text-white">{redemption.pin}</span>
              </div>
            )}
          </div>

          {/* Updated Gem Balance Status */}
          <div className="flex items-center justify-between text-xs pt-1 text-slate-400 relative z-10">
            <span>Updated Gem Balance:</span>
            <div className="flex items-center gap-1 font-bold text-cyan-300 font-mono text-sm">
              <span>💎</span>
              <span>{gems.toLocaleString()} Gems</span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER CALL TO ACTIONS */}
      <footer className="p-4 max-w-md mx-auto w-full space-y-2.5">
        {/* Primary CTA: Explore More Rewards */}
        <button
          id="success-explore-more-cta-button"
          onClick={() => handleNav('loot_market')}
          className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 text-slate-950 font-black text-sm font-display shadow-lg transition-transform active:scale-98 flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Explore More Rewards in Loot Market</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        {/* Secondary CTAs */}
        <div className="grid grid-cols-2 gap-2">
          <button
            id="success-my-rewards-cta-button"
            onClick={() => handleNav('my_rewards')}
            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Gift className="w-3.5 h-3.5 text-cyan-400" />
            <span>My Rewards Locker</span>
          </button>

          <button
            id="success-back-to-game-cta-button"
            onClick={() => handleNav('home')}
            className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
          >
            <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Back to QuestRush</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
