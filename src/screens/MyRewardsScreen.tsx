import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GemHeader } from '../components/GemHeader';
import { RedeemedReward } from '../types';
import { sound } from '../utils/audio';
import {
  Gift,
  Wallet,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Building2,
  Copy
} from 'lucide-react';

export const MyRewardsScreen: React.FC = () => {
  const {
    redeemedRewards,
    cashOutRecords,
    playerProfile,
    navigateTo,
    setSelectedVoucherModal,
    setStoreMode
  } = useGame();

  const [activeTab, setActiveTab] = useState<'vouchers' | 'cashouts'>('vouchers');

  const totalVoucherValue = redeemedRewards.reduce((sum, r) => sum + r.value, 0);
  const totalCashOutAmount = cashOutRecords.reduce((sum, c) => sum + c.amountInr, 0);

  const handleOpenVoucher = (reward: RedeemedReward) => {
    sound.playTap();
    setSelectedVoucherModal(reward);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-slate-100 flex flex-col">
      {/* Header */}
      <GemHeader
        title="My Wallet & Rewards"
        subtitle="Your digital vouchers and UPI cash-out history"
      />

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-3 space-y-4">
        {/* ========================================================================= */}
        {/* SUMMARY STATS BANNER */}
        {/* ========================================================================= */}
        <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/80 border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-amber-400 tracking-wider">
                Total Real-World Earnings
              </span>
              <h2 className="text-xl font-black text-white font-display mt-0.5">
                ₹{(totalVoucherValue + totalCashOutAmount).toLocaleString()} Total Won
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
                <span>🎁 ₹{totalVoucherValue.toLocaleString()} in Vouchers</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">💸 ₹{totalCashOutAmount.toLocaleString()} in Cash</span>
              </div>
            </div>

            <div className="w-11 h-11 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-xl shadow">
              🏆
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TAB SWITCHER: VOUCHERS VS CASHOUTS */}
        {/* ========================================================================= */}
        <section className="bg-slate-900 border border-slate-800 p-1 rounded-2xl flex items-center shadow-md">
          <button
            id="tab-vouchers-history-button"
            onClick={() => {
              sound.playTap();
              setActiveTab('vouchers');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'vouchers'
                ? 'bg-amber-400 text-slate-950 shadow font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gift className="w-3.5 h-3.5" />
            <span>Brand Vouchers ({redeemedRewards.length})</span>
          </button>

          <button
            id="tab-cashouts-history-button"
            onClick={() => {
              sound.playTap();
              setActiveTab('cashouts');
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'cashouts'
                ? 'bg-emerald-500 text-slate-950 shadow font-extrabold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>UPI Cash-Outs ({cashOutRecords.length})</span>
          </button>
        </section>

        {/* ========================================================================= */}
        {/* TAB 1: VOUCHERS LIST */}
        {/* ========================================================================= */}
        {activeTab === 'vouchers' && (
          <section className="space-y-3">
            {redeemedRewards.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                <p className="text-slate-400 text-xs">You have not redeemed any vouchers yet.</p>
                <button
                  onClick={() => {
                    sound.playTap();
                    setStoreMode('vouchers');
                    navigateTo('loot_market');
                  }}
                  className="px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Browse Brand Vouchers
                </button>
              </div>
            ) : (
              redeemedRewards.map((reward) => {
                const isRedeemed = reward.status === 'Redeemed';

                return (
                  <div
                    key={reward.id}
                    id={`reward-history-card-${reward.id}`}
                    onClick={() => handleOpenVoucher(reward)}
                    className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 p-3.5 transition-all duration-200 hover:shadow-lg active:scale-[0.99] flex flex-col gap-2.5"
                  >
                    <div className="flex items-start gap-3">
                      {/* Image */}
                      <div className="w-14 h-14 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
                        <img
                          src={reward.image}
                          alt={reward.productName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-bold uppercase text-amber-400">
                            {reward.brand}
                          </span>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                            isRedeemed
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          }`}>
                            {isRedeemed ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                            {reward.status}
                          </span>
                        </div>

                        <h3 className="text-xs font-extrabold text-white truncate font-display mt-0.5 group-hover:text-amber-300 transition-colors">
                          {reward.productName}
                        </h3>

                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {reward.gemsSpent.toLocaleString()} 💎 + ₹{reward.cashPaid} • {reward.redeemedAt}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Strip */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <span className="font-mono text-cyan-300 font-bold text-[11px] truncate">
                        Code: {reward.code}
                      </span>
                      <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform text-[11px]">
                        Inspect Voucher <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </section>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: UPI CASH-OUTS LIST */}
        {/* ========================================================================= */}
        {activeTab === 'cashouts' && (
          <section className="space-y-3">
            {cashOutRecords.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 space-y-3">
                <p className="text-slate-400 text-xs">No UPI cash-outs yet.</p>
                <button
                  onClick={() => {
                    sound.playTap();
                    setStoreMode('cashout');
                    navigateTo('loot_market');
                  }}
                  className="px-4 py-2 bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs"
                >
                  Withdraw Cash Now
                </button>
              </div>
            ) : (
              cashOutRecords.map((record) => (
                <div
                  key={record.id}
                  className="rounded-2xl bg-slate-900 border border-slate-800 p-3.5 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
                        ₹
                      </div>
                      <div>
                        <div className="text-sm font-black text-white font-display">
                          ₹{record.amountInr}.00 Transferred
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          To: {record.upiId}
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {record.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>UTR: {record.utrNumber}</span>
                    <span className="text-cyan-300 font-bold">-{record.gemsConverted.toLocaleString()} 💎</span>
                  </div>
                </div>
              ))
            )}
          </section>
        )}

        {/* Action Button to Store */}
        <div className="pt-2">
          <button
            onClick={() => {
              sound.playTap();
              navigateTo('loot_market');
            }}
            className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-xs shadow transition-all flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            <span>Open Redeem & Cash-Out Hub</span>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </main>
    </div>
  );
};
