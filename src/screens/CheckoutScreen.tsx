import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GemHeader } from '../components/GemHeader';
import { sound } from '../utils/audio';
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Gift,
  Lock,
  Smartphone,
  CreditCard,
  Zap,
  Info,
  Sliders,
  Coins
} from 'lucide-react';

export const CheckoutScreen: React.FC = () => {
  const {
    selectedProduct,
    gems,
    redeemProduct,
    navigateTo,
    goBack,
    calculateCoPay
  } = useGame();

  const product = selectedProduct;

  // Custom Co-Pay Slider state: Defaults to standard product gem price (or player gems if less)
  const defaultSelectedGems = Math.min(gems, product.gemPrice);
  const [selectedGemsToUse, setSelectedGemsToUse] = useState<number>(defaultSelectedGems);
  const [paymentMethod, setPaymentMethod] = useState<'upi_gpay' | 'upi_phonepe' | 'upi_paytm' | 'card'>('upi_gpay');
  const [upiId, setUpiId] = useState('rini.pennada@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  const coPayInfo = calculateCoPay(product, selectedGemsToUse);
  const remainingGemsAfterRedeem = Math.max(0, gems - selectedGemsToUse);

  const handleSliderChange = (newVal: number) => {
    sound.playSliderTick(450 + (newVal / Math.max(1, product.gemPrice)) * 400);
    setSelectedGemsToUse(newVal);
  };

  const handleMethodSelect = (method: 'upi_gpay' | 'upi_phonepe' | 'upi_paytm' | 'card') => {
    sound.playTap();
    setPaymentMethod(method);
  };

  const handleRedeem = async () => {
    sound.playTargetLock();
    setIsProcessing(true);
    // Simulate realistic 1.2s instant checkout verification
    setTimeout(async () => {
      sound.playPurchase();
      await redeemProduct(product, paymentMethod, selectedGemsToUse, coPayInfo.cashToPay);
      setIsProcessing(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-24 text-slate-100 flex flex-col">
      {/* Header */}
      <GemHeader
        showBack={true}
        onBack={goBack}
        title="Redeem Reward"
        subtitle="Dual-Currency Co-Pay Checkout"
      />

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-3 space-y-4">
        {/* PRODUCT SUMMARY CARD */}
        <section className="rounded-3xl bg-slate-900 border border-slate-800 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-amber-400">
                  {product.brand} Official
                </span>
                <span className="text-xs font-black text-white bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                  ₹{product.value.toLocaleString()} Value
                </span>
              </div>
              <h3 className="text-sm font-extrabold text-white truncate font-display mt-0.5">
                {product.name}
              </h3>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                Instant digital voucher code generated upon redemption
              </p>
            </div>
          </div>
        </section>

        {/* INTERACTIVE CO-PAY SLIDER AT CHECKOUT */}
        <section className="rounded-3xl bg-slate-900 border border-slate-800 p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-amber-400" />
              Adjust Co-Pay Split
            </h2>
            <span className="text-[10px] font-bold text-amber-400 font-mono">
              {selectedGemsToUse.toLocaleString()} 💎 Applied
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={Math.min(gems, product.gemPrice)}
            step={50}
            value={selectedGemsToUse}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
          />

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>0 💎 (Full Real Money)</span>
            <span className="text-cyan-300 font-bold">💎 Balance: {gems.toLocaleString()}</span>
            <span>Max Gems ({Math.min(gems, product.gemPrice).toLocaleString()} 💎)</span>
          </div>
        </section>

        {/* PAYMENT BREAKDOWN (Game Currency + Real Money Breakdown) */}
        <section
          id="checkout-breakdown-card"
          className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/40 p-4.5 space-y-3.5 shadow-md"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-300 font-display flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Dual-Currency Invoice
            </h2>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded-full">
              {coPayInfo.discountPercent}% Saved with Gems
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            {/* Product Original Value */}
            <div className="flex justify-between items-center text-slate-400">
              <span>Voucher Face Value:</span>
              <span className="font-bold text-white font-mono">₹{product.value.toLocaleString()}</span>
            </div>

            {/* Gems Applied Discount */}
            <div className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-base">💎</span>
                <div>
                  <span className="font-bold text-white block">In-Game Gems Applied</span>
                  <span className="text-[10px] text-slate-400">Virtual game currency earned from gameplay</span>
                </div>
              </div>
              <span className="font-black text-cyan-300 font-display text-sm">
                -{selectedGemsToUse.toLocaleString()} 💎 (-₹{coPayInfo.savingsAmount})
              </span>
            </div>

            {/* Real Money Co-Pay */}
            <div className="flex justify-between items-center bg-slate-950/80 p-2.5 rounded-xl border border-emerald-500/40">
              <div className="flex items-center gap-2">
                <span className="text-base">💳</span>
                <div>
                  <span className="font-bold text-white block">Real Money Co-Pay</span>
                  <span className="text-[10px] text-slate-400">Payable via UPI / Debit / Credit Card</span>
                </div>
              </div>
              <span className="font-black text-emerald-400 font-display text-base">
                ₹{coPayInfo.cashToPay.toLocaleString()}
              </span>
            </div>

            {/* Balance Audit */}
            <div className="pt-2 border-t border-slate-800/80 space-y-1 text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Current Gem Balance:</span>
                <span className="font-bold text-white font-mono">{gems.toLocaleString()} 💎</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Remaining Gem Balance After Checkout:</span>
                <span className="font-bold text-amber-400 font-mono">{remainingGemsAfterRedeem.toLocaleString()} 💎</span>
              </div>
            </div>
          </div>
        </section>

        {/* PAYMENT METHOD SELECTOR (UPI & Cards) */}
        <section className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 space-y-3 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-display flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              Pay Real Money Co-Pay (₹{coPayInfo.cashToPay})
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> 256-Bit Encrypted
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleMethodSelect('upi_gpay')}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                paymentMethod === 'upi_gpay'
                  ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-bold shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="text-base">🟢</span>
              <span className="text-[11px]">Google Pay</span>
            </button>

            <button
              onClick={() => handleMethodSelect('upi_phonepe')}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                paymentMethod === 'upi_phonepe'
                  ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-bold shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="text-base">🟣</span>
              <span className="text-[11px]">PhonePe</span>
            </button>

            <button
              onClick={() => handleMethodSelect('upi_paytm')}
              className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 text-center transition-all ${
                paymentMethod === 'upi_paytm'
                  ? 'bg-amber-400/10 border-amber-400 text-amber-300 font-bold shadow-sm'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <span className="text-base">🔵</span>
              <span className="text-[11px]">Paytm UPI</span>
            </button>
          </div>

          {/* UPI ID preview */}
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">UPI ID:</span>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="bg-transparent font-mono text-white text-right focus:outline-none"
            />
          </div>
        </section>

        {/* PROTOTYPE SECURITY & SIMULATION NOTE */}
        <div className="p-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl flex items-center gap-2 text-[11px] text-slate-400">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            Hybrid Currency Settlement: Deducts {selectedGemsToUse.toLocaleString()} Gems and authorizes ₹{coPayInfo.cashToPay} real money co-pay.
          </span>
        </div>

        {/* REDEEM BUTTON */}
        <div className="pt-1">
          <button
            id="checkout-confirm-redeem-button"
            onClick={handleRedeem}
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-3xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-300 hover:from-emerald-400 hover:to-teal-200 text-slate-950 font-black text-base font-display shadow-[0_10px_30px_rgba(16,185,129,0.4)] transition-all transform active:scale-98 flex items-center justify-center gap-2 border-2 border-emerald-200"
          >
            {isProcessing ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>Authorizing Dual-Currency Payment...</span>
              </>
            ) : (
              <>
                <Gift className="w-5 h-5" />
                <span>
                  Confirm & Redeem ({selectedGemsToUse.toLocaleString()} 💎 + ₹{coPayInfo.cashToPay})
                </span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};
