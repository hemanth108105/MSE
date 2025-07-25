import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { X, TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { MarketData } from '../../types';
import { formatCurrency, formatPercentage, formatCurrencyByType } from '../../utils/dataGenerator';
import MetricsChart from './MetricsChart';

interface DataPanelProps {
  selectedDate: Date | null;
  data: MarketData | null;
  currency: string;
  onClose: () => void;
  historicalData: MarketData[];
}

const DataPanel: React.FC<DataPanelProps> = ({
  selectedDate,
  data,
  currency,
  onClose,
  historicalData
}) => {
  if (!selectedDate || !data) return null;

  const recentData = historicalData.slice(-30); // Last 30 days for chart

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Market Data
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-4 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Price</span>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {formatCurrencyByType(data.close, currency)}
              </div>
              <div className={`text-sm ${data.performance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatPercentage(data.performance)}
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-4 rounded-xl"
            >
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Volatility</span>
              </div>
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                {data.volatility.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {data.volatility > 50 ? 'High' : data.volatility > 25 ? 'Medium' : 'Low'}
              </div>
            </motion.div>
          </div>

          {/* OHLC Data */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">OHLC Data</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Open:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrencyByType(data.open, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">High:</span>
                <span className="font-medium text-green-600">{formatCurrencyByType(data.high, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Low:</span>
                <span className="font-medium text-red-600">{formatCurrencyByType(data.low, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Close:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrencyByType(data.close, currency)}</span>
              </div>
            </div>
          </div>

          {/* Technical Indicators */}
          <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Technical Indicators</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">RSI:</span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 dark:text-white">{data.rsi.toFixed(1)}</span>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    data.rsi > 70 ? 'bg-red-100 text-red-800' :
                    data.rsi < 30 ? 'bg-green-100 text-green-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {data.rsi > 70 ? 'Overbought' : data.rsi < 30 ? 'Oversold' : 'Neutral'}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Moving Average:</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatCurrencyByType(data.movingAverage, currency)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Volume:</span>
                <span className="font-medium text-gray-900 dark:text-white">${data.volume.toFixed(0)}M</span>
              </div>
            </div>
          </div>

          {/* Chart */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">30-Day Trend</h3>
            <MetricsChart data={recentData} selectedDate={selectedDate} currency={currency} />
          </div>

          {/* Market Analysis */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Market Analysis</h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>
                {data.performance > 0 ? '📈' : data.performance < 0 ? '📉' : '➡️'} 
                {' '}Price {data.performance > 0 ? 'increased' : data.performance < 0 ? 'decreased' : 'remained stable'} by {Math.abs(data.performance).toFixed(2)}%
              </p>
              <p>
                {data.volatility > 50 ? '⚡' : data.volatility > 25 ? '📊' : '😴'}
                {' '}Volatility is {data.volatility > 50 ? 'high' : data.volatility > 25 ? 'moderate' : 'low'} at {data.volatility.toFixed(1)}%
              </p>
              <p>
                {data.volume > 1000 ? '🚀' : data.volume > 500 ? '📈' : '💤'}
                {' '}Trading volume is {data.volume > 1000 ? 'very high' : data.volume > 500 ? 'moderate' : 'low'}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DataPanel;