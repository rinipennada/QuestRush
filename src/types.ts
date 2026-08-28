export type ScreenType = 
  | 'home'
  | 'loot_market'
  | 'product_detail'
  | 'earn_gems'
  | 'checkout'
  | 'success'
  | 'my_rewards'
  | 'play_game'
  | 'profile';

export type ProductCategory = 
  | 'For You'
  | 'All Rewards'
  | 'Food & Dining'
  | 'Rides & Travel'
  | 'Fashion & Apparel'
  | 'Retail & Shopping'
  | 'Electronics & Tech'
  | 'Gaming & Entertainment';

export interface Product {
  id: string;
  name: string;
  brand: string;
  value: number; // e.g. 1000
  gemPrice: number; // e.g. 4500
  cashPrice: number; // e.g. 199
  originalCashValue: number; // e.g. 1000
  category: ProductCategory;
  image: string;
  brandLogo: string;
  tag?: string;
  isPersonalized?: boolean;
  description: string;
  terms: string[];
  inStock: boolean;
  rating: number;
  redeemCount: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  gemReward: number;
  completed: boolean;
  type: 'win_games' | 'daily_challenge' | 'play_time' | 'high_score';
  progress: number;
  target: number;
  iconName: string;
}

export interface RedeemedReward {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  value: number;
  gemsSpent: number;
  cashPaid: number;
  status: 'Redeemed' | 'Processing' | 'Used';
  code: string;
  pin?: string;
  redeemedAt: string;
  expiresAt: string;
  category: ProductCategory;
  image: string;
}

export interface CashOutRecord {
  id: string;
  upiId: string;
  gemsConverted: number;
  amountInr: number;
  status: 'Completed' | 'Processing';
  utrNumber: string;
  timestamp: string;
  paymentMethod: string;
}

export type StoreRedemptionMode = 'vouchers' | 'cashout';

export interface PlayerProfile {
  name: string;
  alias: string;
  handle: string;
  avatar: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  energy: number;
  maxEnergy: number;
  streakDays: number;
  totalGemsEarned: number;
  totalMoneySaved: number;
  totalCashOutInr: number;
  rank: string;
  titles: string[];
}

export interface GameStage {
  level: number;
  name: string;
  subtitle: string;
  difficulty: 'Novice' | 'Adept' | 'Master' | 'Nightmare' | 'Boss';
  targetScore: number;
  gemReward: number;
  xpReward: number;
  hazardSpeed: number;
  gemSpawnRate: number;
  hasBoss?: boolean;
  bossName?: string;
  description: string;
  bgGradient: string;
  accentColor: string;
}
