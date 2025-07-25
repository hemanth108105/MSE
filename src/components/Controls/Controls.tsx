import React from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar as CalendarIcon, 
  BarChart3, 
  TrendingUp, 
  Activity,
  Palette,
  Download,
  Settings
} from 'lucide-react';
import { ViewMode, DataLayer, FilterOptions, ColorTheme } from '../../types';

interface ControlsProps {
  viewMode: ViewMode;
  dataLayer: DataLayer;
  colorTheme: ColorTheme;
  filters: FilterOptions;
  onViewModeChange: (mode: ViewMode) => void;
  onDataLayerChange: (layer: DataLayer) => void;
  onColorThemeChange: (theme: ColorTheme) => void;
  onFiltersChange: (filters: FilterOptions) => void;
  onExport: () => void;
}

const Controls: React.FC<ControlsProps> = ({
  viewMode,
  dataLayer,
  colorTheme,
  filters,
  onViewModeChange,
  onDataLayerChange,
  onColorThemeChange,
  onFiltersChange,
  onExport
}) => {
  const viewModes: { mode: ViewMode; label: string; icon: React.ReactNode }[] = [
    { mode: 'daily', label: 'Daily', icon: <CalendarIcon className="w-4 h-4" /> },
    { mode: 'weekly', label: 'Weekly', icon: <BarChart3 className="w-4 h-4" /> },
    { mode: 'monthly', label: 'Monthly', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const dataLayers: { layer: DataLayer; label: string; icon: React.ReactNode }[] = [
    { layer: 'volatility', label: 'Volatility', icon: <Activity className="w-4 h-4" /> },
    { layer: 'liquidity', label: 'Liquidity', icon: <BarChart3 className="w-4 h-4" /> },
    { layer: 'performance', label: 'Performance', icon: <TrendingUp className="w-4 h-4" /> },
    { layer: 'all', label: 'All Layers', icon: <Palette className="w-4 h-4" /> },
  ];

  const colorThemes: { theme: ColorTheme; label: string }[] = [
    { theme: 'default', label: 'Default' },
    { theme: 'contrast', label: 'High Contrast' },
    { theme: 'colorblind', label: 'Colorblind Friendly' },
  ];

  const instruments = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'ADA/USD'];
  const currencies = [
    { code: 'USD', label: 'US Dollar ($)', symbol: '$' },
    { code: 'INR', label: 'Indian Rupee (₹)', symbol: '₹' },
    { code: 'EUR', label: 'Euro (€)', symbol: '€' },
    { code: 'GBP', label: 'British Pound (£)', symbol: '£' }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Controls</h2>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      {/* View Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          View Mode
        </label>
        <div className="flex gap-2">
          {viewModes.map(({ mode, label, icon }) => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onViewModeChange(mode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === mode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {icon}
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Data Layer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Data Layer
        </label>
        <div className="grid grid-cols-2 gap-2">
          {dataLayers.map(({ layer, label, icon }) => (
            <motion.button
              key={layer}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onDataLayerChange(layer)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                dataLayer === layer
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {icon}
              {label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Filters
        </label>
        
        {/* Instrument */}
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Instrument</label>
          <select
            value={filters.instrument}
            onChange={(e) => onFiltersChange({ ...filters, instrument: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {instruments.map(instrument => (
              <option key={instrument} value={instrument}>{instrument}</option>
            ))}
          </select>
        </div>

        {/* Currency */}
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">Currency</label>
          <select
            value={filters.currency}
            onChange={(e) => onFiltersChange({ ...filters, currency: e.target.value })}
            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {currencies.map(currency => (
              <option key={currency.code} value={currency.code}>{currency.label}</option>
            ))}
          </select>
        </div>

        {/* Volatility Range */}
        <div>
          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-2">
            Volatility Range: {filters.minVolatility}% - {filters.maxVolatility}%
          </label>
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max="100"
              value={filters.minVolatility}
              onChange={(e) => onFiltersChange({ ...filters, minVolatility: Number(e.target.value) })}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={filters.maxVolatility}
              onChange={(e) => onFiltersChange({ ...filters, maxVolatility: Number(e.target.value) })}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Color Theme */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Color Theme
        </label>
        <select
          value={colorTheme}
          onChange={(e) => onColorThemeChange(e.target.value as ColorTheme)}
          className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {colorThemes.map(({ theme, label }) => (
            <option key={theme} value={theme}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Controls;