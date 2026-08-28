import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GemHeader } from '../components/GemHeader';
import { sound } from '../utils/audio';
import {
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ChevronRight,
  Clock,
  Info,
  Gift,
  Flame,
  Award,
  Sliders,
  CreditCard,
  Coins,
  Store,
  QrCode
} from 'lucide-react';

export const ProductDetailScreen: React.FC = () => {
  const {
    selectedProduct,
    gems,
    navigateTo,
    goBack,
    calculateCoPay
  } = useGame();

  const product = selectedProduct;
  
  // Custom Co-Pay Slider state: Defaults to standard product gem price (or player gems if less)
  const defaultSelectedGems = Math.min(gems, product.gemPrice);
  const [selectedGemsToUse, setSelectedGemsToUse] = useState<number>(defaultSelectedGems);

  // Live calculation
  const coPayInfo = calculateCoPay(product, selectedGemsToUse);
  const isUnlockedStandard = gems >= product.gemPrice;
  const missingGemsForStandard = Math.max(0, product.gemPrice - gems);
  const progressPercent = Math.min(100, Math.round((gems / product.gemPrice) * 100));

  const handleSliderChange = (newVal: number) => {
    sound.playSliderTick(450 + (newVal / Math.max(1, product.gemPrice)) * 400);
    setSelectedGemsToUse(newVal);
  };

  const handleSetPreset = (gemAmount: number) => {
    sound.playTap();
    setSelectedGemsToUse(Math.min(gemAmount, gems));
  };

  const handleProceedToCheckout = () => {
    sound.playTap();
    navigateTo('checkout');
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100 flex flex-col">
      {/* Header */}
      <GemHeader
        showBack={true}
        onBack={goBack}
        title="Reward Details"
        subtitle={product.brand}
      />

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-3 space-y-4">
        {/* Product Visual Card */}
        <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 shadow-xl">
          <div className="relative h-48 sm:h-52 w-full overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            
            {/* Value Badge */}
            <div className="absolute top-3 right-3 bg-slate-950/90 border border-amber-400/50 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-black text-amber-300 shadow-lg">
              ₹{product.value.toLocaleString()} Card Value
            </div>

            {/* Brand Chip */}
            <div className="absolute bottom-3 left-3 flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-slate-900/90 border border-slate-700 flex items-center justify-center text-xl shadow">
                {product.brandLogo}
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/30">
                  {product.brand} Official
                </span>
                <h1 className="text-lg font-black text-white font-display leading-tight drop-shadow">
                  {product.name}
                </h1>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900/90 space-y-2">
            <p className="text-xs text-slate-300 leading-relaxed">
              {product.description}
            </p>

            {/* Merchant Guarantee Chips */}
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
              <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                <Store className="w-3 h-3 text-cyan-400" /> Authorized Retailer
              </span>
              <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                <QrCode className="w-3 h-3 text-emerald-400" /> In-Store & Online
              </span>
              <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                <Clock className="w-3 h-3 text-amber-400" /> 12 Mo Validity
              </span>
            </div>
          </div>
        </div>

        {/* HYBRID CURRENCY CO-PAY CUSTOMIZER (Gems + Real Money) */}
        <section
          id="product-hybrid-copay-card"
          className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/50 p-4.5 shadow-xl space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 flex items-center justify-center">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-black text-white font-display uppercase tracking-wide flex items-center gap-1.5">
                  Dual-Currency Co-Pay Rig
                </h2>
                <span className="text-[10px] text-cyan-400 font-medium">
                  Slide to adjust Gem discount vs Out-of-pocket Cash
                </span>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/90 border border-emerald-500/40 px-2.5 py-1 rounded-full shadow-sm">
              Save ₹{coPayInfo.savingsAmount} ({coPayInfo.discountPercent}%)
            </span>
          </div>

          {/* DYNAMIC RATIO BREAKDOWN DISPLAY */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Gems Applied Box */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-cyan-500/30 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-cyan-400 block mb-1">
                💎 In-Game Gems Applied
              </span>
              <div className="text-cyan-200 font-black text-lg font-display flex items-baseline gap-1">
                <span>{selectedGemsToUse.toLocaleString()}</span>
                <span className="text-xs text-cyan-400 font-medium">/ {gems.toLocaleString()}</span>
              </div>
              <span className="text-[10px] text-slate-400">
                -₹{coPayInfo.savingsAmount} discount
              </span>
            </div>

            {/* Cash Co-Pay Required Box */}
            <div className="p-3 bg-slate-950 rounded-2xl border border-emerald-500/30 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                💳 Real Money Payable
              </span>
              <div className="text-emerald-300 font-black text-lg font-display">
                ₹{coPayInfo.cashToPay.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400">
                via UPI / Card / NetBanking
              </span>
            </div>
          </div>

          {/* INTERACTIVE CO-PAY SLIDER */}
          <div className="space-y-2 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                Drag to Tune Co-Pay Split:
              </span>
              <span className="text-amber-400 font-mono font-bold">
                {selectedGemsToUse.toLocaleString()} 💎 applied
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={Math.min(gems, product.gemPrice)}
              step={50}
              value={selectedGemsToUse}
              onChange={(e) => handleSliderChange(Number(e.target.value))}
              className="w-full h-3 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400 transition-all"
            />

            {/* Quick Preset Buttons */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              <button
                onClick={() => handleSetPreset(0)}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all ${
                  selectedGemsToUse === 0
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                0 💎 (Full Cash)
              </button>

              <button
                onClick={() => handleSetPreset(Math.round(product.gemPrice * 0.5))}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all ${
                  selectedGemsToUse === Math.round(product.gemPrice * 0.5)
                    ? 'bg-amber-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                ⚡ 50% Split
              </button>

              <button
                onClick={() => handleSetPreset(product.gemPrice)}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all ${
                  selectedGemsToUse === product.gemPrice
                    ? 'bg-cyan-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                🎯 Target Rate
              </button>

              <button
                onClick={() => handleSetPreset(gems)}
                className={`py-1.5 px-1 rounded-xl text-[10px] font-bold transition-all ${
                  selectedGemsToUse === Math.min(gems, product.gemPrice) && selectedGemsToUse > 0
                    ? 'bg-emerald-400 text-slate-950 font-black shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                💎 Max Balance
              </button>
            </div>
          </div>

          {/* Progress to Target Recommendation */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold">
                {isUnlockedStandard ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Max Discount Unlocked!
                  </span>
                ) : (
                  <span className="text-amber-400 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5" /> Standard discount is {missingGemsForStandard.toLocaleString()} 💎 away
                  </span>
                )}
              </span>
              <span className="text-cyan-300 font-bold font-mono">
                {gems.toLocaleString()} / {product.gemPrice.toLocaleString()} 💎 ({progressPercent}%)
              </span>
            </div>

            <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isUnlockedStandard
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-cyan-500 via-amber-400 to-amber-500'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </section>

        {/* PRIMARY CALL TO ACTION BUTTONS */}
        <section className="space-y-2.5 pt-1">
          {/* Main Redeem / Checkout CTA */}
          <button
            id="proceed-to-checkout-button"
            onClick={handleProceedToCheckout}
            className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-300 hover:from-emerald-400 hover:to-teal-200 text-slate-950 font-black text-base font-display shadow-[0_10px_25px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-98 flex items-center justify-center gap-2 border-2 border-emerald-200"
          >
            <Gift className="w-5 h-5" />
            <span>
              Redeem ({selectedGemsToUse.toLocaleString()} 💎 + ₹{coPayInfo.cashToPay})
            </span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>

          {!isUnlockedStandard && (
            <button
              id="earn-more-gems-cta-button"
              onClick={() => navigateTo('earn_gems')}
              className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-extrabold text-xs flex items-center justify-center gap-2 border border-amber-400/40 transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>Earn {missingGemsForStandard} more Gems to lower cash price to ₹{product.cashPrice}</span>
            </button>
          )}

          <div className="text-center text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Instant digital code generation & secure real-time UPI co-pay</span>
          </div>
        </section>

        {/* HOW TO REDEEM & TERMS ACCORDION */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-3">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
            Terms & Redemption Info
          </h3>
          <ul className="space-y-2 text-xs text-slate-300">
            {product.terms.map((term, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};
