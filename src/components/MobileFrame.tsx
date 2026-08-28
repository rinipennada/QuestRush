import React, { useState, useRef, useEffect } from 'react';
import {
  Smartphone,
  Maximize2,
  Minimize2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [frameMode, setFrameMode] = useState<'mobile' | 'responsive'>('mobile');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showScrollTab, setShowScrollTab] = useState<boolean>(true);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const { resetDemo } = useGame();

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Monitor internal scroll position to update scroll tab & progress
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const totalScrollable = target.scrollHeight - target.clientHeight;
    if (totalScrollable > 0) {
      const progress = Math.min(100, Math.max(0, (target.scrollTop / totalScrollable) * 100));
      setScrollProgress(progress);
    }
  };

  const scrollToTop = () => {
    sound.playTap();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    sound.playTap();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const toggleSound = () => {
    const nextState = !soundMuted;
    setSoundMuted(nextState);
    sound.setMuted(nextState);
    if (!nextState) {
      sound.playTap();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 lg:py-4 relative selection:bg-amber-400 selection:text-slate-950">
      {/* ========================================================================= */}
      {/* MOBILE DEVICE CONTAINER */}
      {/* ========================================================================= */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col ${
          frameMode === 'mobile'
            ? 'lg:w-[412px] lg:h-[844px] lg:max-h-[94vh] lg:rounded-[44px] lg:border-[8px] lg:border-slate-800 lg:shadow-[0_0_50px_rgba(0,0,0,0.9),0_0_25px_rgba(245,158,11,0.15)] lg:overflow-hidden bg-slate-950'
            : 'max-w-2xl h-screen lg:h-[880px] lg:max-h-[95vh] lg:rounded-3xl lg:border-2 lg:border-slate-800 bg-slate-950 overflow-hidden'
        }`}
      >
        {/* ========================================================================= */}
        {/* MOBILE TOP CONTROLS BAR (DIRECTLY ON MOBILE SCREEN) */}
        {/* ========================================================================= */}
        <header className="w-full bg-slate-950/95 border-b border-slate-900/80 px-3.5 py-1.5 flex items-center justify-between z-30 shrink-0 select-none">
          {/* Left: Device Time & Indicator */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-300 font-mono tracking-tight">
              9:41
            </span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span className="text-[10px] text-slate-400 font-semibold hidden sm:inline">
                QuestRush
              </span>
            </div>
          </div>

          {/* Center: Mobile Speaker Notch */}
          <div className="w-16 h-3 bg-slate-900 rounded-full flex items-center justify-center gap-1.5 border border-slate-800/80">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800"></div>
            <div className="w-6 h-1 rounded-full bg-slate-800"></div>
          </div>

          {/* Right: Quick Action Controls right on the mobile screen itself */}
          <div className="flex items-center gap-1">
            {/* View Mode Toggle Button */}
            <button
              id="mobile-view-mode-button"
              onClick={() => {
                sound.playTap();
                setFrameMode(prev => (prev === 'mobile' ? 'responsive' : 'mobile'));
              }}
              title={frameMode === 'mobile' ? 'Switch to Expanded View' : 'Switch to Phone View'}
              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 transition-colors text-[10px] flex items-center gap-0.5 px-1.5"
            >
              {frameMode === 'mobile' ? (
                <>
                  <Maximize2 className="w-3 h-3 text-cyan-400" />
                  <span className="font-bold">Phone</span>
                </>
              ) : (
                <>
                  <Minimize2 className="w-3 h-3 text-amber-400" />
                  <span className="font-bold">Fluid</span>
                </>
              )}
            </button>

            {/* Sound Mute Toggle */}
            <button
              id="mobile-sound-toggle-button"
              onClick={toggleSound}
              title={soundMuted ? 'Unmute SFX' : 'Mute SFX'}
              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              {soundMuted ? (
                <VolumeX className="w-3 h-3 text-rose-400" />
              ) : (
                <Volume2 className="w-3 h-3 text-emerald-400" />
              )}
            </button>

            {/* Reset Demo Quick Button */}
            <button
              id="mobile-reset-demo-button"
              onClick={() => {
                sound.playTap();
                resetDemo();
              }}
              title="Reset Demo Wallet & Missions"
              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* INTERNAL SCROLLABLE VIEWPORT (PREVENTS INFINITY SCROLL) */}
        {/* ========================================================================= */}
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          id="mobile-viewport-scroll-container"
          className="flex-1 w-full overflow-y-auto overscroll-contain mobile-scrollbar relative bg-slate-950"
        >
          {children}
        </div>

        {/* ========================================================================= */}
        {/* FLOATING SCROLL TAB CONTROLS (QUICK SCROLL UP / DOWN ON SCREEN) */}
        {/* ========================================================================= */}
        {showScrollTab && (
          <aside
            aria-label="Scroll helper tab"
            className="absolute right-2.5 bottom-20 z-50 flex flex-col items-center bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-xl p-1 gap-1 backdrop-blur-md transition-transform"
          >
            {/* Scroll to Top */}
            <button
              id="scroll-to-top-button"
              onClick={scrollToTop}
              title="Scroll to Top"
              className="w-6 h-6 rounded-xl bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-colors active:scale-90"
            >
              <ChevronUp className="w-3.5 h-3.5" />
            </button>

            {/* Visual Scroll Progress Indicator Bar */}
            <div className="w-1 h-6 bg-slate-800 rounded-full overflow-hidden my-0.5 relative">
              <div
                className="w-full bg-gradient-to-b from-amber-400 to-cyan-400 rounded-full transition-all duration-150"
                style={{ height: `${Math.max(15, scrollProgress)}%` }}
              />
            </div>

            {/* Scroll to Bottom */}
            <button
              id="scroll-to-bottom-button"
              onClick={scrollToBottom}
              title="Scroll to Bottom"
              className="w-6 h-6 rounded-xl bg-slate-800 hover:bg-cyan-400 hover:text-slate-950 text-slate-300 flex items-center justify-center transition-colors active:scale-90"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </aside>
        )}
      </div>
    </div>
  );
};
