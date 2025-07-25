import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Moon, Sun, BarChart3 } from 'lucide-react';
import { ViewMode, DataLayer, ColorTheme, DateRange, FilterOptions } from './types';
import { useMarketData } from './hooks/useMarketData';
import Calendar from './components/Calendar/Calendar';
import DataPanel from './components/DataPanel/DataPanel';
import Controls from './components/Controls/Controls';
import LoadingSpinner from './components/LoadingSpinner';

function App() {
  const { data, loading, getDataForDate } = useMarketData();
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('daily');
  const [dataLayer, setDataLayer] = useState<DataLayer>('volatility');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('default');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [filters, setFilters] = useState<FilterOptions>({
    instrument: 'BTC/USD',
    timeframe: '1D',
    currency: 'USD',
    minVolatility: 0,
    maxVolatility: 100
  });

  const selectedData = selectedDate ? getDataForDate(format(selectedDate, 'yyyy-MM-dd')) : null;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleDateRangeSelect = (start: Date, end: Date | null) => {
    setDateRange({ start, end });
  };

  const handleExport = () => {
    const exportData = {
      selectedDate: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null,
      dateRange,
      filters,
      viewMode,
      dataLayer,
      timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `market-analysis-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Market Seasonality Explorer
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Interactive calendar for financial market analysis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {selectedDate && (
                <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-sm text-blue-700 dark:text-blue-300">
                    Selected: {format(selectedDate, 'MMM d, yyyy')}
                  </span>
                </div>
              )}
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <Controls
              viewMode={viewMode}
              dataLayer={dataLayer}
              colorTheme={colorTheme}
              filters={filters}
              onViewModeChange={setViewMode}
              onDataLayerChange={setDataLayer}
              onColorThemeChange={setColorTheme}
              onFiltersChange={setFilters}
              onExport={handleExport}
            />
          </div>

          {/* Calendar */}
          <div className="lg:col-span-3">
            <Calendar
              data={data}
              viewMode={viewMode}
              dataLayer={dataLayer}
              colorTheme={colorTheme}
              currency={filters.currency}
              selectedDate={selectedDate}
              dateRange={dateRange}
              onDateSelect={handleDateSelect}
              onDateRangeSelect={handleDateRangeSelect}
            />
          </div>
        </div>
      </div>

      {/* Data Panel */}
      <DataPanel
        selectedDate={selectedDate}
        data={selectedData || null}
        currency={filters.currency}
        onClose={() => setSelectedDate(null)}
        historicalData={data}
      />

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Market Seasonality Explorer © 2025. Built for financial analysis and visualization.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
              <span>Keyboard shortcuts: Arrow keys to navigate, ESC to reset</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;