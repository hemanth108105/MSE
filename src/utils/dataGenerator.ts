import { MarketData } from '../types';
import { format, subDays, addDays } from 'date-fns';

// Generate realistic mock market data
export const generateMarketData = (days: number = 365): MarketData[] => {
  const data: MarketData[] = [];
  const basePrice = 50000; // Starting price (like Bitcoin)
  let currentPrice = basePrice;
  
  for (let i = days; i >= 0; i--) {
    const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
    
    // Simulate market patterns
    const seasonalityFactor = Math.sin((365 - i) / 365 * Math.PI * 2) * 0.1;
    const trendFactor = (365 - i) / 365 * 0.2;
    const randomFactor = (Math.random() - 0.5) * 0.05;
    
    const change = seasonalityFactor + trendFactor + randomFactor;
    const newPrice = currentPrice * (1 + change);
    
    const volatility = Math.abs(change) * 100 + Math.random() * 20;
    const volume = (Math.random() * 1000 + 500) * (1 + volatility / 100);
    
    data.push({
      date,
      volatility: Math.min(100, volatility),
      liquidity: volume,
      performance: change * 100,
      open: currentPrice,
      close: newPrice,
      high: Math.max(currentPrice, newPrice) * (1 + Math.random() * 0.02),
      low: Math.min(currentPrice, newPrice) * (1 - Math.random() * 0.02),
      volume,
      rsi: 30 + Math.random() * 40, // RSI between 30-70
      movingAverage: currentPrice * (1 + (Math.random() - 0.5) * 0.01)
    });
    
    currentPrice = newPrice;
  }
  
  return data.reverse();
};

export const getVolatilityColor = (volatility: number, theme: string = 'default'): string => {
  const colors = {
    default: {
      low: '#10B981', // Green
      medium: '#F59E0B', // Yellow
      high: '#EF4444' // Red
    },
    contrast: {
      low: '#000000',
      medium: '#666666',
      high: '#FFFFFF'
    },
    colorblind: {
      low: '#0173B2', // Blue
      medium: '#DE8F05', // Orange
      high: '#CC78BC' // Pink
    }
  };
  
  const themeColors = colors[theme as keyof typeof colors] || colors.default;
  
  if (volatility < 30) return themeColors.low;
  if (volatility < 70) return themeColors.medium;
  return themeColors.high;
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatCurrencyByType = (value: number, currency: string = 'USD'): string => {
  const localeMap: { [key: string]: string } = {
    'USD': 'en-US',
    'INR': 'en-IN',
    'EUR': 'en-GB',
    'GBP': 'en-GB'
  };

  return new Intl.NumberFormat(localeMap[currency] || 'en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'INR' ? 0 : 0,
    maximumFractionDigits: currency === 'INR' ? 0 : 0
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};