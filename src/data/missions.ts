import { Mission, RedeemedReward, CashOutRecord } from '../types';

export const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'mission-win-games',
    title: 'Win 2 Games',
    description: 'Crush the high score in QuestRush Arena or Puzzle Blitz mode.',
    gemReward: 200,
    completed: false,
    type: 'win_games',
    progress: 1,
    target: 2,
    iconName: 'Trophy'
  },
  {
    id: 'mission-daily-challenge',
    title: "Complete Today's Challenge",
    description: 'Score 5,000 combo points in the Neon Dash bonus level.',
    gemReward: 300,
    completed: false,
    type: 'daily_challenge',
    progress: 4200,
    target: 5000,
    iconName: 'Flame'
  },
  {
    id: 'mission-play-time',
    title: 'Play for 10 Minutes',
    description: 'Keep your active play streak alive and unlock daily rewards.',
    gemReward: 150,
    completed: false,
    type: 'play_time',
    progress: 7,
    target: 10,
    iconName: 'Clock'
  }
];

export const INITIAL_REDEEMED_REWARDS: RedeemedReward[] = [
  {
    id: 'red-swiggy-01',
    productId: 'swiggy-500',
    productName: 'Swiggy ₹500 Food Voucher',
    brand: 'Swiggy',
    value: 500,
    gemsSpent: 1800,
    cashPaid: 99,
    status: 'Redeemed',
    code: 'SWIG-8821-QR9',
    pin: '4421',
    redeemedAt: 'Yesterday, 8:45 PM',
    expiresAt: '28 Feb 2027',
    category: 'Food & Dining',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80'
  },
  {
    id: 'red-amazon-02',
    productId: 'amazon-500',
    productName: 'Amazon ₹500 Gift Card',
    brand: 'Amazon',
    value: 500,
    gemsSpent: 2400,
    cashPaid: 79,
    status: 'Processing',
    code: 'AMZN-PROCESSING-QUEUE',
    redeemedAt: '3 days ago, 11:20 AM',
    expiresAt: '15 Aug 2027',
    category: 'All Rewards',
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=600&auto=format&fit=crop&q=80'
  }
];

export const INITIAL_CASHOUT_RECORDS: CashOutRecord[] = [
  {
    id: 'cashout-demo-01',
    upiId: 'rini@okaxis',
    gemsConverted: 1500,
    amountInr: 150,
    status: 'Completed',
    utrNumber: 'UPI-UTR-492019482910',
    timestamp: '2 days ago, 4:15 PM',
    paymentMethod: 'Google Pay (UPI)'
  }
];

