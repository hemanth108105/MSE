export interface MarketData {
  date: string;
  volatility: number; // 0-100
  liquidity: number; // Volume in millions
  performance: number; // Percentage change
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  rsi: number;
  movingAverage: number;
}

export interface CalendarCell {
  date: Date;
  data?: MarketData;
  isToday: boolean;
  isCurrentMonth: boolean;
  isSelected: boolean;
  isInRange: boolean;
}

export type ViewMode = 'daily' | 'weekly' | 'monthly';
export type DataLayer = 'volatility' | 'liquidity' | 'performance' | 'all';
export type ColorTheme = 'default' | 'contrast' | 'colorblind';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface FilterOptions {
  instrument: string;
  timeframe: string;
  currency: string;
  minVolatility: number;
  maxVolatility: number;
}