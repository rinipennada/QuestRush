import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { GemHeader } from '../components/GemHeader';
import { ProductCategory, Product, StoreRedemptionMode } from '../types';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Search,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
  Gift,
  Coins,
  CreditCard,
  Building2,
  Clock,
  Sparkles,
  Copy,
  ExternalLink,
  Wallet
} from 'lucide-react';

export const LootMarketScreen: React.FC = () => {
  const {
    gems,
    products,
    selectedCategory,
    setSelectedCategory,
    selectProduct,
    calculateCoPay,
    storeMode,
    setStoreMode,
    cashOutToUPI,
    cashOutRecords,
    lastCashOut
  } = useGame();

  const [searchQuery, setSearchQuery] = useState('');

  // Cash-Out State
  const [selectedInrAmount, setSelectedInrAmount] = useState<number>(100);
  const [customUpiId, setCustomUpiId] = useState('rini@okaxis');
  const [selectedUpiProvider, setSelectedUpiProvider] = useState<'GPay' | 'PhonePe' | 'Paytm' | 'BHIM'>('GPay');
  const [isCashOutProcessing, setIsCashOutProcessing] = useState(false);
  const [showCashOutSuccessModal, setShowCashOutSuccessModal] = useState(false);
  const [copiedUtr, setCopiedUtr] = useState(false);

  // Conversion formula: 10 Gems = ₹1.00 INR
  const maxInrAvailable = Math.floor(gems / 10);
  const gemsForSelectedAmount = selectedInrAmount * 10;
  const hasEnoughForCashOut = gems >= gemsForSelectedAmount && selectedInrAmount > 0;

  const categories: ProductCategory[] = [
    'For You',
    'All Rewards',
    'Food & Dining',
    'Rides & Travel',
    'Fashion & Apparel',
    'Retail & Shopping',
    'Electronics & Tech',
    'Gaming & Entertainment'
  ];

  // Filter products cleanly
  const categoryFiltered = selectedCategory === 'For You' || selectedCategory === 'All Rewards'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const finalFiltered = searchQuery.trim() === ''
    ? categoryFiltered
    : categoryFiltered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const handleModeChange = (mode: StoreRedemptionMode) => {
    sound.playTap();
    setStoreMode(mode);
  };

  const handleSelectProduct = (product: Product) => {
    sound.playTap();
    selectProduct(product);
  };

  const handleCategoryChange = (cat: ProductCategory) => {
    sound.playTap();
    setSelectedCategory(cat);
  };

  const handleQuickAmountSelect = (inr: number) => {
    sound.playSliderTick(550 + inr * 2);
    setSelectedInrAmount(inr);
  };

  const handleAppendUpiSuffix = (suffix: string) => {
    sound.playTap();
    const prefix = customUpiId.includes('@') ? customUpiId.split('@')[0] : customUpiId;
    setCustomUpiId(`${prefix}${suffix}`);
  };

  const handleExecuteCashOut = async () => {
    if (!hasEnoughForCashOut || !customUpiId.trim()) return;

    sound.playTargetLock();
    setIsCashOutProcessing(true);

    setTimeout(async () => {
      const success = await cashOutToUPI(
        customUpiId.trim(),
        gemsForSelectedAmount,
        selectedInrAmount,
        `${selectedUpiProvider} (Instant UPI)`
      );

      setIsCashOutProcessing(false);
      if (success) {
        sound.playPurchase();
        setShowCashOutSuccessModal(true);
        try {
          confetti({
            particleCount: 75,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#10b981', '#38bdf8', '#fbbf24', '#f59e0b']
          });
        } catch {}
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-950 pb-28 text-slate-100 flex flex-col">
      {/* Top Header */}
      <GemHeader
        title="Redeem & Cash Out"
        subtitle="Choose to withdraw real cash or redeem vouchers"
      />

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-3 space-y-4">
        {/* ========================================================================= */}
        {/* DUAL-PRIVILEGE MODE SELECTOR: VOUCHERS VS CASH OUT */}
        {/* ========================================================================= */}
        <section className="bg-slate-900/90 border border-slate-800 p-1.5 rounded-2xl flex items-center shadow-lg">
          <button
            id="tab-brand-vouchers-button"
            onClick={() => handleModeChange('vouchers')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              storeMode === 'vouchers'
                ? 'bg-gradient-to-r from-amber-400 to-amber-300 text-slate-950 shadow-md scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gift className="w-4 h-4 stroke-[2.5]" />
            <span>Brand Vouchers</span>
          </button>

          <button
            id="tab-cashout-upi-button"
            onClick={() => handleModeChange('cashout')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              storeMode === 'cashout'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-md scale-[1.02]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wallet className="w-4 h-4 stroke-[2.5]" />
            <span>Cash-Out to UPI</span>
          </button>
        </section>

        {/* ========================================================================= */}
        {/* MODE 1: BRAND VOUCHERS & CO-PAY */}
        {/* ========================================================================= */}
        {storeMode === 'vouchers' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Quick Summary Card */}
            <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/60 border border-slate-800 p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 block tracking-wide">
                  Your Balance
                </span>
                <span className="text-sm font-extrabold text-white">
                  <span className="text-cyan-300 font-mono">{gems.toLocaleString()} 💎</span> available for vouchers
                </span>
              </div>

              <button
                onClick={() => handleModeChange('cashout')}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-2.5 py-1.5 rounded-xl flex items-center gap-1 transition-all"
              >
                <span>Withdraw Cash</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Clean Search Bar */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="text"
                id="search-vouchers-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Amazon, Swiggy, Myntra, Uber, Starbucks..."
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-amber-400/80 rounded-2xl pl-10 pr-8 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Horizontal Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 shadow-sm font-extrabold'
                        : 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            {/* Clean Products Grid */}
            <div className="space-y-3 pt-1">
              {finalFiltered.length === 0 ? (
                <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800">
                  <p className="text-slate-400 text-xs">No vouchers matching your search.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All Rewards');
                    }}
                    className="mt-3 px-4 py-2 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs"
                  >
                    Show All
                  </button>
                </div>
              ) : (
                finalFiltered.map((product) => {
                  const productCoPay = calculateCoPay(product, Math.min(gems, product.gemPrice));
                  const canAfford = gems >= product.gemPrice;

                  return (
                    <div
                      key={product.id}
                      id={`product-card-${product.id}`}
                      onClick={() => handleSelectProduct(product)}
                      className="group cursor-pointer rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-400/60 p-3.5 transition-all duration-200 hover:shadow-lg active:scale-[0.99] flex flex-col gap-3"
                    >
                      <div className="flex items-start gap-3.5">
                        {/* Image */}
                        <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 overflow-hidden shrink-0 relative">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                          <span className="absolute bottom-1 right-1 text-xs bg-slate-950/80 px-1 rounded">
                            {product.brandLogo}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[10px] font-bold uppercase text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
                              {product.brand}
                            </span>
                            <span className="text-xs font-bold text-slate-200">
                              ₹{product.value.toLocaleString()} Card
                            </span>
                          </div>

                          <h4 className="text-sm font-extrabold text-white truncate font-display group-hover:text-amber-300 transition-colors mt-0.5">
                            {product.name}
                          </h4>

                          {/* Dual-currency pricing tag */}
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <div className="flex items-center gap-1 bg-sky-950/80 border border-sky-500/40 px-2 py-0.5 rounded-lg text-xs font-black text-cyan-200">
                              <span>💎</span> {productCoPay.gemsUsed.toLocaleString()}
                            </div>
                            <span className="text-xs text-slate-400 font-bold">+</span>
                            <div className="bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 rounded-lg text-xs font-black text-emerald-300">
                              ₹{productCoPay.cashToPay}
                            </div>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-tight ml-auto bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
                              Save ₹{productCoPay.savingsAmount}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Action Bar */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                        <span className="text-[11px] text-slate-400">
                          {canAfford ? '✅ Full discount eligible' : '⚡ Co-pay discount ready'}
                        </span>
                        <button
                          className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center gap-1 transition-colors"
                        >
                          <span>Redeem</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODE 2: DIRECT CASH-OUT TO UPI / BANK */}
        {/* ========================================================================= */}
        {storeMode === 'cashout' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Real Money Balance Card */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-950/90 via-slate-900 to-teal-950/90 border border-emerald-500/50 p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider flex items-center gap-1">
                    <Coins className="w-3 h-3" /> DIRECT REAL CASH CONVERSION
                  </span>
                  <div className="text-2xl font-black text-white font-display mt-0.5">
                    ₹{maxInrAvailable.toFixed(2)}{' '}
                    <span className="text-xs font-normal text-emerald-300">INR</span>
                  </div>
                </div>

                <div className="text-right bg-slate-950/80 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">
                    Wallet Gems
                  </span>
                  <span className="text-sm font-black text-cyan-300 font-mono">
                    {gems.toLocaleString()} 💎
                  </span>
                </div>
              </div>

              {/* Conversion Rate Badge */}
              <div className="p-2.5 rounded-xl bg-slate-950/90 border border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <span>Exchange Formula:</span>
                <span className="font-bold text-emerald-300 font-mono">
                  10 Gems = ₹1.00 INR (1,000 💎 = ₹100)
                </span>
              </div>
            </div>

            {/* Step 1: Select Withdrawal Amount */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">1</span>
                  Select Withdrawal Amount
                </h3>
                <span className="text-xs font-bold text-cyan-300 font-mono">
                  Costs {gemsForSelectedAmount.toLocaleString()} 💎
                </span>
              </div>

              {/* Preset Amount Pills */}
              <div className="grid grid-cols-4 gap-2">
                {[50, 100, 200, 350].map((amt) => {
                  const isSelected = selectedInrAmount === amt;
                  const isAffordable = gems >= amt * 10;
                  return (
                    <button
                      key={amt}
                      onClick={() => handleQuickAmountSelect(amt)}
                      disabled={!isAffordable && gems < amt * 10}
                      className={`py-2 px-1 rounded-xl text-center border transition-all ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 font-black border-emerald-400 shadow-md'
                          : isAffordable
                          ? 'bg-slate-950 text-slate-200 border-slate-800 hover:border-emerald-500/50'
                          : 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed'
                      }`}
                    >
                      <div className="text-xs font-black font-display">₹{amt}</div>
                      <div className="text-[9px] opacity-80">{amt * 10}💎</div>
                    </button>
                  );
                })}
              </div>

              {/* Max Balance Preset Button */}
              {maxInrAvailable > 0 && (
                <button
                  onClick={() => handleQuickAmountSelect(maxInrAvailable)}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                    selectedInrAmount === maxInrAvailable
                      ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 font-black'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <span>Withdraw Full Balance</span>
                  <span className="font-mono text-emerald-400">₹{maxInrAvailable} (All {gems.toLocaleString()} 💎)</span>
                </button>
              )}
            </div>

            {/* Step 2: UPI Destination */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">2</span>
                Enter UPI ID for Instant Transfer
              </h3>

              {/* Quick Provider Chips */}
              <div className="grid grid-cols-4 gap-1.5">
                {(['GPay', 'PhonePe', 'Paytm', 'BHIM'] as const).map((prov) => (
                  <button
                    key={prov}
                    onClick={() => {
                      sound.playTap();
                      setSelectedUpiProvider(prov);
                    }}
                    className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all text-center ${
                      selectedUpiProvider === prov
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-extrabold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {prov}
                  </button>
                ))}
              </div>

              {/* UPI ID Input */}
              <div className="space-y-1.5">
                <div className="relative">
                  <input
                    type="text"
                    id="cashout-upi-id-input"
                    value={customUpiId}
                    onChange={(e) => setCustomUpiId(e.target.value)}
                    placeholder="e.g. yourname@okhdfcbank or 9876543210@paytm"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-emerald-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-600 focus:outline-none font-mono"
                  />
                </div>

                {/* Quick Suffix Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                  <span className="text-[10px] text-slate-500 uppercase shrink-0">Quick Suffix:</span>
                  {['@okaxis', '@okhdfcbank', '@paytm', '@ybl', '@upi'].map((suf) => (
                    <button
                      key={suf}
                      onClick={() => handleAppendUpiSuffix(suf)}
                      className="px-2 py-0.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-400 hover:text-emerald-300 font-mono shrink-0 transition-colors"
                    >
                      {suf}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Instant Cash-Out Action Button */}
            <div className="space-y-2 pt-1">
              <button
                id="execute-cashout-submit-button"
                onClick={handleExecuteCashOut}
                disabled={!hasEnoughForCashOut || !customUpiId.trim() || isCashOutProcessing}
                className={`w-full py-3.5 px-4 rounded-2xl font-black text-sm font-display flex items-center justify-center gap-2 shadow-lg transition-all ${
                  hasEnoughForCashOut && customUpiId.trim() && !isCashOutProcessing
                    ? 'bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 active:scale-98 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                }`}
              >
                {isCashOutProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Authorizing UPI Auto-Payout...</span>
                  </div>
                ) : (
                  <>
                    <Wallet className="w-4 h-4 stroke-[2.5]" />
                    <span>
                      Transfer ₹{selectedInrAmount} to {customUpiId || 'UPI'}
                    </span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Instant 24x7 Bank Payout • 0% Transaction Fee</span>
              </div>
            </div>

            {/* Recent Cash-Out Transactions */}
            {cashOutRecords.length > 0 && (
              <div className="space-y-2.5 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recent Cash-Out Transfers ({cashOutRecords.length})
                </h4>

                <div className="space-y-2">
                  {cashOutRecords.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-white font-display">
                            +₹{rec.amountInr} Transferred
                          </span>
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.2 rounded border border-emerald-400/20">
                            {rec.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                          To: {rec.upiId}
                        </p>
                        <p className="text-[10px] text-slate-500 font-mono">
                          UTR: {rec.utrNumber}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold text-cyan-300 block">
                          -{rec.gemsConverted.toLocaleString()} 💎
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {rec.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* CASH-OUT RECEIPT MODAL */}
      {/* ========================================================================= */}
      {showCashOutSuccessModal && lastCashOut && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-3xl bg-slate-900 border-2 border-emerald-400 p-5 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/30 font-mono">
                TRANSFER SUCCESSFUL
              </span>
              <h3 className="text-xl font-black text-white font-display mt-1">
                ₹{lastCashOut.amountInr}.00 Sent!
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Funds have been transferred to your UPI account.
              </p>
            </div>

            {/* Receipt details */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-left text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">UPI ID:</span>
                <span className="text-white font-bold">{lastCashOut.upiId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gems Converted:</span>
                <span className="text-cyan-300 font-bold">-{lastCashOut.gemsConverted.toLocaleString()} 💎</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">UTR Reference:</span>
                <span className="text-amber-300 font-bold">{lastCashOut.utrNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payout Mode:</span>
                <span className="text-slate-200">{lastCashOut.paymentMethod}</span>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                setShowCashOutSuccessModal(false);
              }}
              className="w-full py-3 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs font-display shadow-lg transition-transform active:scale-95"
            >
              Done & Return to Wallet
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
