import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { MobileFrame } from './components/MobileFrame';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';
import { VoucherModal } from './components/VoucherModal';

// Screens
import { GameHomeScreen } from './screens/GameHomeScreen';
import { LootMarketScreen } from './screens/LootMarketScreen';
import { ProductDetailScreen } from './screens/ProductDetailScreen';
import { EarnGemsScreen } from './screens/EarnGemsScreen';
import { CheckoutScreen } from './screens/CheckoutScreen';
import { SuccessScreen } from './screens/SuccessScreen';
import { MyRewardsScreen } from './screens/MyRewardsScreen';
import { PlayMiniGameScreen } from './screens/PlayMiniGameScreen';
import { ProfileScreen } from './screens/ProfileScreen';

const MainScreenRouter: React.FC = () => {
  const { currentScreen } = useGame();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return <GameHomeScreen />;
      case 'loot_market':
        return <LootMarketScreen />;
      case 'product_detail':
        return <ProductDetailScreen />;
      case 'earn_gems':
        return <EarnGemsScreen />;
      case 'checkout':
        return <CheckoutScreen />;
      case 'success':
        return <SuccessScreen />;
      case 'my_rewards':
        return <MyRewardsScreen />;
      case 'play_game':
        return <PlayMiniGameScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <GameHomeScreen />;
    }
  };

  return (
    <div className="relative min-h-full bg-slate-950 flex flex-col justify-between">
      {/* Active Screen */}
      <div className="flex-1 w-full animate-in fade-in duration-150">
        {renderScreen()}
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Overlays & Modals */}
      <Toast />
      <VoucherModal />
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 antialiased">
        {/* Mobile Device Frame wrapper for polished presentation */}
        <MobileFrame>
          <MainScreenRouter />
        </MobileFrame>
      </div>
    </GameProvider>
  );
}
