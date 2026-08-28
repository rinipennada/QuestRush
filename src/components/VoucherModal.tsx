import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { X, Copy, Check, ExternalLink, ShieldCheck, Clock, Calendar } from 'lucide-react';

export const VoucherModal: React.FC = () => {
  const { selectedVoucherModal, setSelectedVoucherModal } = useGame();
  const [copied, setCopied] = useState(false);

  if (!selectedVoucherModal) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedVoucherModal.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-sm w-full p-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={() => setSelectedVoucherModal(null)}
          className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Voucher Top Brand Card */}
        <div className="text-center pt-2 pb-4">
          <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center overflow-hidden mb-3 shadow-md">
            <img
              src={selectedVoucherModal.image}
              alt={selectedVoucherModal.productName}
              className="w-full h-full object-cover"
            />
          </div>
          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wider mb-1">
            {selectedVoucherModal.status}
          </span>
          <h3 className="text-base font-extrabold text-white font-display">
            {selectedVoucherModal.productName}
          </h3>
          <p className="text-xs text-slate-400">
            Redeemed using {selectedVoucherModal.gemsSpent.toLocaleString()} 💎 + ₹{selectedVoucherModal.cashPaid}
          </p>
        </div>

        {/* Voucher Code Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 my-3">
          <div className="text-[10px] font-bold uppercase text-slate-400 mb-1 flex items-center justify-between">
            <span>Digital Voucher Code</span>
            <span className="text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> Verified Active
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 bg-slate-900 px-3 py-2 rounded-lg border border-slate-700/80">
            <code className="font-mono text-sm font-black text-amber-400 tracking-wider">
              {selectedVoucherModal.code}
            </code>
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-md bg-amber-400/10 hover:bg-amber-400/20 text-amber-400 hover:text-amber-300 transition-colors"
              title="Copy Code"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          {selectedVoucherModal.pin && (
            <div className="flex items-center justify-between text-xs text-slate-300 mt-2 px-1">
              <span className="text-slate-400">Security PIN:</span>
              <span className="font-mono font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {selectedVoucherModal.pin}
              </span>
            </div>
          )}
        </div>

        {/* Barcode Visual Placeholder */}
        <div className="bg-white p-2.5 rounded-lg text-center my-3">
          <div className="h-10 flex items-center justify-center gap-1">
            {Array.from({ length: 34 }).map((_, i) => (
              <div
                key={i}
                className="bg-black h-full"
                style={{ width: i % 3 === 0 ? '4px' : i % 2 === 0 ? '2px' : '1px' }}
              />
            ))}
          </div>
          <div className="font-mono text-[9px] text-slate-900 font-bold tracking-widest mt-1">
            {selectedVoucherModal.code.replace(/[^a-zA-Z0-9]/g, '')}
          </div>
        </div>

        {/* Meta Info */}
        <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800 pt-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" /> Redeemed:
            </span>
            <span className="text-slate-200">{selectedVoucherModal.redeemedAt}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" /> Valid Until:
            </span>
            <span className="text-slate-200">{selectedVoucherModal.expiresAt}</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={() => setSelectedVoucherModal(null)}
          className="w-full mt-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors"
        >
          Close Voucher
        </button>
      </div>
    </div>
  );
};
