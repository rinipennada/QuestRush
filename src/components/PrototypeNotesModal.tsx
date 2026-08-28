import React from 'react';
import { useGame } from '../context/GameContext';
import { X, CheckCircle, Sparkles, TrendingUp, DollarSign, Target, ShieldCheck, Gamepad2, ArrowRight } from 'lucide-react';

export const PrototypeNotesModal: React.FC = () => {
  const { showPrototypeNotes, setShowPrototypeNotes } = useGame();

  if (!showPrototypeNotes) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white font-display">
                Product Thinking & Prototype Notes
              </h2>
              <p className="text-xs text-amber-400/90 font-medium">
                PlaySuper Product Associate Intern Assignment
              </p>
            </div>
          </div>
          <button
            id="close-notes-modal-button"
            onClick={() => setShowPrototypeNotes(false)}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-slate-300 text-xs sm:text-sm leading-relaxed">
          {/* Section 1: The Core Product Challenge */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              1. The Core Challenge & Strategic Thesis
            </h3>
            <p className="text-slate-300">
              Traditional e-commerce is transactional (<span className="text-slate-400 font-mono">Discover → Buy → Receive</span>). When games simply graft a standard web shop, it feels like an intrusive commercial distraction that pulls players out of their flow.
            </p>
            <div className="mt-3 p-3 bg-cyan-950/40 border border-cyan-500/30 rounded-lg text-cyan-200">
              <strong>QuestRush Thesis:</strong> Connect real-world commerce directly into the core gameplay progression loop (<span className="text-amber-300 font-bold">PLAY → EARN → PROGRESS → UNLOCK → CO-PAY → REDEEM → RETURN</span>). The reward is not just bought; it is <em>earned through gameplay victory</em>.
            </div>
          </div>

          {/* Section 2: Traditional E-Commerce vs QuestRush Loot Market */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              2. Paradigm Shift: Traditional vs. In-Game Commerce
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-rose-950/20 border border-rose-900/50 rounded-xl p-3.5">
                <div className="font-bold text-rose-400 mb-2 uppercase tracking-wide">
                  Traditional E-Commerce
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  <li>❌ Currency is purely external cash</li>
                  <li>❌ Shopping interrupts game engagement</li>
                  <li>❌ Full upfront financial commitment</li>
                  <li>❌ No intrinsic progression or achievement</li>
                  <li>❌ Player leaves app to shop elsewhere</li>
                </ul>
              </div>

              <div className="bg-emerald-950/20 border border-emerald-800/60 rounded-xl p-3.5">
                <div className="font-bold text-emerald-400 mb-2 uppercase tracking-wide">
                  QuestRush Loot Market
                </div>
                <ul className="space-y-1.5 text-slate-300">
                  <li>✅ Gems provide tangible real-world purchasing power</li>
                  <li>✅ High motivation when "Only 650💎 away" (Goal Gradient)</li>
                  <li>✅ Hybrid Co-Pay (Gems + ₹199) lowers checkout friction</li>
                  <li>✅ Psychological "Win Feeling" (Effort Justification)</li>
                  <li>✅ Drives D1, D7, and D30 game retention cycles</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Behavioral Economics & Retention Mechanics */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-amber-400" />
              3. Behavioral Economics Principles Applied
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div>
                <strong className="text-amber-300">Goal-Gradient Hypothesis:</strong> Players accelerate their session time and mission completions when shown they are 85% of the way to a ₹1,000 gift card.
              </div>
              <div>
                <strong className="text-cyan-300">Effort Justification & Value Perception:</strong> By investing 15 minutes of gameplay to earn the missing 650 Gems, paying ₹199 cash for a ₹1,000 voucher feels like an extraordinary 80% discount triumph rather than an expense.
              </div>
              <div>
                <strong className="text-emerald-300">Actionable Shortage over Dead Ends:</strong> If a player is short on gems, never disable the purchase button with an error. Instead, convert the shortage into actionable missions ("Earn 650 Gems ⚡").
              </div>
            </div>
          </div>

          {/* Section 4: Unit Economics & Monetization Assumptions */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              4. Business Viability & Unit Economics Assumptions
            </h3>
            <div className="space-y-2 text-xs">
              <p>
                How can QuestRush afford offering a <strong>₹1,000 Myntra voucher</strong> for <strong>4,500 💎 + ₹199</strong>?
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block">User Cash Co-Pay:</span>
                  <span className="text-emerald-400 font-bold">+₹199</span>
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block">Brand Partner Co-Sponsor:</span>
                  <span className="text-cyan-400 font-bold">+₹500</span> (CAC subsidy)
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-400 block">Ad Views & Retention LTV:</span>
                  <span className="text-amber-400 font-bold">+₹301</span> (Gameplay ads)
                </div>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Total Value Realized: ₹1,000. The merchant acquires a high-intent new customer, the game captures advertising revenue & 4x higher retention, and the player receives immense perceived value.
              </p>
            </div>
          </div>

          {/* Section 5: Prototype Technical Scope & Assumptions */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              5. Prototype Assumptions & Scope
            </h3>
            <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
              <li>Starting state: Level 18, 3,850 💎 balance.</li>
              <li>Missions simulate live gameplay completion (+200, +300, +150 💎) updating state persistently.</li>
              <li>Checkout simulates UPI transaction without real bank gateway calls.</li>
              <li>Voucher codes are generated dynamically and stored in the My Rewards locker.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 rounded-b-2xl flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Interactive Prototype for PlaySuper
          </span>
          <button
            onClick={() => setShowPrototypeNotes(false)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5"
          >
            <span>Back to Prototype</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
