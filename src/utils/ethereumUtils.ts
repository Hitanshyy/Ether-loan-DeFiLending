
// This is a simplified utility file for Ethereum interactions
// In a production app, you would use ethers.js or web3.js
// and implement full contract interaction functionality

// Mock data for tokens
export const tokens = [
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    icon: '⟠',
    price: 3000,
    depositRate: 1.5,
    borrowRate: 3.5,
    totalDeposited: 1250,
    totalBorrowed: 750,
    liquidityAvailable: 500,
    collateralFactor: 80,
  },
  {
    symbol: 'DAI',
    name: 'Dai Stablecoin',
    address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    icon: '◈',
    price: 1,
    depositRate: 2.8,
    borrowRate: 4.2,
    totalDeposited: 5000000,
    totalBorrowed: 3500000,
    liquidityAvailable: 1500000,
    collateralFactor: 75,
  },
  {
    symbol: 'USDC',
    name: 'USD Coin',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    icon: '$',
    price: 1,
    depositRate: 3.0,
    borrowRate: 4.5,
    totalDeposited: 8000000,
    totalBorrowed: 6000000,
    liquidityAvailable: 2000000,
    collateralFactor: 75,
  },
];

// Mock user positions
export const mockUserPositions = {
  deposits: [
    {
      token: 'ETH',
      amount: 5,
      value: 15000,
      interestEarned: 0.12,
    },
    {
      token: 'DAI',
      amount: 10000,
      value: 10000,
      interestEarned: 45.21,
    }
  ],
  borrows: [
    {
      token: 'USDC',
      amount: 5000,
      value: 5000,
      interest: 12.5,
      collateral: 'ETH',
      collateralAmount: 2.5,
      healthFactor: 150
    }
  ]
};

// Calculate health factor
export const calculateHealthFactor = (collateralValue: number, borrowValue: number, collateralFactor: number) => {
  if (borrowValue === 0) return Infinity;
  return (collateralValue * collateralFactor / 100) / borrowValue;
};

// Format health factor for display
export const formatHealthFactor = (healthFactor: number) => {
  if (healthFactor === Infinity) return '∞';
  return healthFactor.toFixed(2);
};

// Get health factor color based on value
export const getHealthFactorColor = (healthFactor: number) => {
  if (healthFactor === Infinity || healthFactor >= 2) return 'text-green-500';
  if (healthFactor >= 1.5) return 'text-yellow-500';
  if (healthFactor >= 1.2) return 'text-orange-500';
  return 'text-red-500';
};

// Format currency amounts
export const formatCurrency = (amount: number, symbol: string = '', decimals: number = 2) => {
  return `${amount.toLocaleString('en-US', { maximumFractionDigits: decimals })} ${symbol}`;
};

// Format percentage
export const formatPercentage = (percentage: number) => {
  return `${percentage.toFixed(2)}%`;
};

// Simulate a transaction
export const simulateTransaction = async (
  type: 'deposit' | 'withdraw' | 'borrow' | 'repay',
  token: string,
  amount: number
): Promise<boolean> => {
  console.log(`Simulating ${type} of ${amount} ${token}`);
  
  // In a real app, this would interact with a smart contract
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 90% success rate
      const success = Math.random() < 0.9;
      console.log(`Transaction ${success ? 'successful' : 'failed'}`);
      resolve(success);
    }, 2000);
  });
};
