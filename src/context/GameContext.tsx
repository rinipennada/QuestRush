import React, { createContext, useContext, useState } from 'react';
import { ScreenType, ProductCategory, Product, Mission, RedeemedReward, PlayerProfile, CashOutRecord, StoreRedemptionMode } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { INITIAL_MISSIONS, INITIAL_REDEEMED_REWARDS, INITIAL_CASHOUT_RECORDS } from '../data/missions';

interface ToastNotification {
  id: string;
  title: string;
  message: string;
  gems?: number;
}

export interface StageRecord {
  stars: number;
  highscore: number;
  completed: boolean;
}

interface GameContextType {
  currentScreen: ScreenType;
  previousScreen: ScreenType;
  selectedProduct: Product;
  selectedCategory: ProductCategory;
  gems: number;
  playerProfile: PlayerProfile;
  missions: Mission[];
  products: Product[];
  redeemedRewards: RedeemedReward[];
  lastRedemption: RedeemedReward | null;
  cashOutRecords: CashOutRecord[];
  lastCashOut: CashOutRecord | null;
  storeMode: StoreRedemptionMode;
  setStoreMode: (mode: StoreRedemptionMode) => void;
  showPrototypeNotes: boolean;
  activeToast: ToastNotification | null;
  
  // Stages & Gameplay
  selectedStage: number;
  setSelectedStage: (lvl: number) => void;
  unlockedStage: number;
  stageRecords: Record<number, StageRecord>;
  completeStageProgress: (level: number, score: number, stars: number, gemBonus: number, xpBonus: number) => void;
  setPlayerAlias: (alias: string) => void;
  
  // Navigation & Actions
  navigateTo: (screen: ScreenType) => void;
  goBack: () => void;
  selectProduct: (product: Product, navigate?: boolean) => void;
  setSelectedCategory: (category: ProductCategory) => void;
  completeMission: (missionId: string) => void;
  completeAllMissions: () => void;
  redeemProduct: (product: Product, paymentMethod?: string, customGems?: number, customCash?: number) => Promise<boolean>;
  cashOutToUPI: (upiId: string, gemAmount: number, inrAmount: number, paymentMethod?: string) => Promise<boolean>;
  resetDemo: () => void;
  earnGemsFromPlay: (amount: number, reason?: string) => void;
  setShowPrototypeNotes: (show: boolean) => void;
  dismissToast: () => void;
  selectedVoucherModal: RedeemedReward | null;
  setSelectedVoucherModal: (voucher: RedeemedReward | null) => void;
  
  // Custom Co-Pay calculation helper
  calculateCoPay: (product: Product, gemsToUse: number) => {
    gemsUsed: number;
    cashToPay: number;
    savingsAmount: number;
    discountPercent: number;
  };
}

const INITIAL_PROFILE: PlayerProfile = {
  name: 'Rini Pennada',
  alias: 'Vixen Queen',
  handle: '@vixenqueen_rini',
  avatar: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&auto=format&fit=crop&q=80',
  level: 24,
  currentXp: 4850,
  nextLevelXp: 6000,
  energy: 95,
  maxEnergy: 100,
  streakDays: 8,
  totalGemsEarned: 28400,
  totalMoneySaved: 3850,
  totalCashOutInr: 150,
  rank: 'Apex Vixen Queen (Grandmaster)',
  titles: ['Vixen Queen', 'Warrior Princess', 'Cyber Valkyrie', 'Neon Empress', 'Shadow Slayer']
};

const INITIAL_STAGE_RECORDS: Record<number, StageRecord> = {
  1: { stars: 3, highscore: 2450, completed: true },
  2: { stars: 3, highscore: 3800, completed: true },
  3: { stars: 2, highscore: 4200, completed: true },
  4: { stars: 0, highscore: 0, completed: false },
  5: { stars: 0, highscore: 0, completed: false },
  6: { stars: 0, highscore: 0, completed: false },
  7: { stars: 0, highscore: 0, completed: false },
  8: { stars: 0, highscore: 0, completed: false },
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [previousScreen, setPreviousScreen] = useState<ScreenType>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('For You');
  const [gems, setGems] = useState<number>(3850);
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>(INITIAL_PROFILE);
  const [products] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product>(INITIAL_PRODUCTS[0]);
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>(INITIAL_REDEEMED_REWARDS);
  const [lastRedemption, setLastRedemption] = useState<RedeemedReward | null>(null);
  const [cashOutRecords, setCashOutRecords] = useState<CashOutRecord[]>(INITIAL_CASHOUT_RECORDS);
  const [lastCashOut, setLastCashOut] = useState<CashOutRecord | null>(null);
  const [storeMode, setStoreMode] = useState<StoreRedemptionMode>('vouchers');
  const [showPrototypeNotes, setShowPrototypeNotes] = useState<boolean>(false);
  const [activeToast, setActiveToast] = useState<ToastNotification | null>(null);
  const [selectedVoucherModal, setSelectedVoucherModal] = useState<RedeemedReward | null>(null);

  // Stage progression states
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [unlockedStage, setUnlockedStage] = useState<number>(4);
  const [stageRecords, setStageRecords] = useState<Record<number, StageRecord>>(INITIAL_STAGE_RECORDS);

  const navigateTo = (screen: ScreenType) => {
    setPreviousScreen(currentScreen);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (currentScreen === 'product_detail') {
      navigateTo('loot_market');
    } else if (currentScreen === 'earn_gems') {
      navigateTo('product_detail');
    } else if (currentScreen === 'checkout') {
      navigateTo('product_detail');
    } else if (currentScreen === 'success') {
      navigateTo('loot_market');
    } else {
      navigateTo(previousScreen || 'home');
    }
  };

  const selectProduct = (product: Product, navigate: boolean = true) => {
    setSelectedProduct(product);
    if (navigate) {
      navigateTo('product_detail');
    }
  };

  const showToast = (title: string, message: string, gemsAdded?: number) => {
    const id = Math.random().toString();
    setActiveToast({ id, title, message, gems: gemsAdded });
    setTimeout(() => {
      setActiveToast((prev) => (prev?.id === id ? null : prev));
    }, 3800);
  };

  const dismissToast = () => setActiveToast(null);

  const setPlayerAlias = (alias: string) => {
    setPlayerProfile(prev => ({
      ...prev,
      alias,
      handle: `@${alias.toLowerCase().replace(/[^a-z0-9]+/g, '_')}_rini`,
      rank: `Apex ${alias} (Grandmaster)`
    }));
    showToast('Alias Updated! ⚔️', `You are now known as "${alias}"`);
  };

  const completeStageProgress = (level: number, score: number, stars: number, gemBonus: number, xpBonus: number) => {
    setStageRecords(prev => {
      const existing = prev[level] || { stars: 0, highscore: 0, completed: false };
      return {
        ...prev,
        [level]: {
          stars: Math.max(existing.stars, stars),
          highscore: Math.max(existing.highscore, score),
          completed: true
        }
      };
    });

    if (level >= unlockedStage && level < 8) {
      setUnlockedStage(level + 1);
    }

    setGems(prev => prev + gemBonus);
    setPlayerProfile(prev => {
      const newXp = prev.currentXp + xpBonus;
      const leveledUp = newXp >= prev.nextLevelXp;
      return {
        ...prev,
        totalGemsEarned: prev.totalGemsEarned + gemBonus,
        currentXp: leveledUp ? newXp - prev.nextLevelXp : newXp,
        level: leveledUp ? prev.level + 1 : prev.level,
        nextLevelXp: leveledUp ? Math.floor(prev.nextLevelXp * 1.25) : prev.nextLevelXp
      };
    });

    showToast(`Level ${level} Cleared! ⭐`, `+${gemBonus} Gems & +${xpBonus} XP collected!`, gemBonus);
  };

  const completeMission = (missionId: string) => {
    const targetMission = missions.find(m => m.id === missionId);
    if (!targetMission || targetMission.completed) return;

    setMissions(prev =>
      prev.map(m => (m.id === missionId ? { ...m, completed: true, progress: m.target } : m))
    );

    const reward = targetMission.gemReward;
    setGems(prev => prev + reward);
    setPlayerProfile(prev => ({
      ...prev,
      totalGemsEarned: prev.totalGemsEarned + reward,
      currentXp: prev.currentXp + reward * 2
    }));

    showToast('Mission Completed! 🎯', `You earned +${reward} Gems from "${targetMission.title}"`, reward);
  };

  const completeAllMissions = () => {
    let totalAdded = 0;
    setMissions(prev =>
      prev.map(m => {
        if (!m.completed) {
          totalAdded += m.gemReward;
          return { ...m, completed: true, progress: m.target };
        }
        return m;
      })
    );

    if (totalAdded > 0) {
      setGems(prev => prev + totalAdded);
      showToast('All Missions Completed! ⚡', `Added +${totalAdded} Gems to your balance!`, totalAdded);
    }
  };

  const earnGemsFromPlay = (amount: number, reason: string = 'Game High Score') => {
    setGems(prev => prev + amount);
    setPlayerProfile(prev => ({
      ...prev,
      totalGemsEarned: prev.totalGemsEarned + amount
    }));
    showToast('Score Bonus! 🏆', `+${amount} Gems earned in ${reason}`, amount);
  };

  // Flexible Co-Pay Calculation: Allows player to use any amount of gems alongside real cash
  const calculateCoPay = (product: Product, gemsToUse: number) => {
    const clampedGems = Math.max(0, Math.min(product.gemPrice * 1.25, gemsToUse));
    // Exchange rate: product.gemPrice covers (product.value - product.cashPrice) of the voucher
    const maxDiscount = product.value - product.cashPrice;
    const discountRatio = Math.min(1, clampedGems / product.gemPrice);
    const savingsAmount = Math.round(maxDiscount * discountRatio);
    const cashToPay = Math.max(0, product.value - savingsAmount);
    const discountPercent = Math.min(100, Math.round((savingsAmount / product.value) * 100));

    return {
      gemsUsed: clampedGems,
      cashToPay,
      savingsAmount,
      discountPercent
    };
  };

  const redeemProduct = async (
    product: Product,
    paymentMethod: string = 'UPI / GPay',
    customGems?: number,
    customCash?: number
  ): Promise<boolean> => {
    const gemsToSpend = customGems !== undefined ? customGems : product.gemPrice;
    const cashToPay = customCash !== undefined ? customCash : product.cashPrice;

    if (gems < gemsToSpend) {
      showToast('Insufficient Gems 💎', `You need ${gemsToSpend - gems} more Gems to unlock this reward.`);
      return false;
    }

    // Deduct gems
    const newGems = Math.max(0, gems - gemsToSpend);
    setGems(newGems);

    // Create redemption record
    const randomCode = `${product.brand.toUpperCase().slice(0, 4)}-${Math.floor(1000 + Math.random() * 9000)}-QR${Math.floor(10 + Math.random() * 90)}`;
    const randomPin = Math.floor(1000 + Math.random() * 9000).toString();

    const newRedemption: RedeemedReward = {
      id: `red-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      value: product.value,
      gemsSpent: gemsToSpend,
      cashPaid: cashToPay,
      status: 'Redeemed',
      code: randomCode,
      pin: randomPin,
      redeemedAt: 'Just now',
      expiresAt: '27 Aug 2027',
      category: product.category,
      image: product.image
    };

    setRedeemedRewards(prev => [newRedemption, ...prev]);
    setLastRedemption(newRedemption);
    setPlayerProfile(prev => ({
      ...prev,
      totalMoneySaved: prev.totalMoneySaved + (product.value - cashToPay)
    }));

    navigateTo('success');
    return true;
  };

  const cashOutToUPI = async (
    upiId: string,
    gemAmount: number,
    inrAmount: number,
    paymentMethod: string = 'Instant UPI (Auto-Payout)'
  ): Promise<boolean> => {
    if (gems < gemAmount) {
      showToast('Insufficient Gems 💎', `You have ${gems.toLocaleString()} Gems, but need ${gemAmount.toLocaleString()} Gems to withdraw ₹${inrAmount}.`);
      return false;
    }

    // Deduct gems
    setGems(prev => Math.max(0, prev - gemAmount));

    // Generate realistic UPI UTR reference
    const utr = `UPI-UTR-${Date.now().toString().slice(-8)}${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord: CashOutRecord = {
      id: `cashout-${Date.now()}`,
      upiId,
      gemsConverted: gemAmount,
      amountInr: inrAmount,
      status: 'Completed',
      utrNumber: utr,
      timestamp: 'Just now',
      paymentMethod
    };

    setCashOutRecords(prev => [newRecord, ...prev]);
    setLastCashOut(newRecord);
    setPlayerProfile(prev => ({
      ...prev,
      totalCashOutInr: (prev.totalCashOutInr || 0) + inrAmount
    }));

    showToast('Real Money Transferred! 💸', `₹${inrAmount} sent successfully to ${upiId}`);
    return true;
  };

  const resetDemo = () => {
    setGems(3850);
    setMissions(INITIAL_MISSIONS.map(m => ({ ...m, completed: false })));
    setRedeemedRewards(INITIAL_REDEEMED_REWARDS);
    setLastRedemption(null);
    setCashOutRecords(INITIAL_CASHOUT_RECORDS);
    setLastCashOut(null);
    setStoreMode('vouchers');
    setSelectedProduct(INITIAL_PRODUCTS[0]);
    setPlayerProfile(INITIAL_PROFILE);
    setUnlockedStage(4);
    setStageRecords(INITIAL_STAGE_RECORDS);
    navigateTo('home');
    showToast('Demo Reset ✨', 'Reset balance to 3,850 💎 and initialized wallet.');
  };

  return (
    <GameContext.Provider
      value={{
        currentScreen,
        previousScreen,
        selectedProduct,
        selectedCategory,
        gems,
        playerProfile,
        missions,
        products,
        redeemedRewards,
        lastRedemption,
        cashOutRecords,
        lastCashOut,
        storeMode,
        setStoreMode,
        showPrototypeNotes,
        activeToast,
        selectedStage,
        setSelectedStage,
        unlockedStage,
        stageRecords,
        completeStageProgress,
        setPlayerAlias,
        navigateTo,
        goBack,
        selectProduct,
        setSelectedCategory,
        completeMission,
        completeAllMissions,
        redeemProduct,
        cashOutToUPI,
        resetDemo,
        earnGemsFromPlay,
        setShowPrototypeNotes,
        dismissToast,
        selectedVoucherModal,
        setSelectedVoucherModal,
        calculateCoPay
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
