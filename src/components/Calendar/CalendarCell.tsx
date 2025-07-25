import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CalendarCell as CalendarCellType, DataLayer, ViewMode } from '../../types';
import { getVolatilityColor, formatPercentage, formatCurrency, formatCurrencyByType } from '../../utils/dataGenerator';

interface CalendarCellProps {
  cell: CalendarCellType;
  dataLayer: DataLayer;
  colorTheme: string;
  viewMode: ViewMode;
  currency?: string;
  onClick: () => void;
  onHover: (date: Date | null) => void;
  isHovered: boolean;
}

const CalendarCell: React.FC<CalendarCellProps> = ({
  cell,
  dataLayer,
  colorTheme,
  viewMode,
  currency = 'USD',
  onClick,
  onHover,
  isHovered
}) => {
  const { date, data, isToday, isCurrentMonth, isSelected, isInRange } = cell;

  const getBackgroundColor = () => {
    if (!data || !isCurrentMonth) return 'transparent';
    
    switch (dataLayer) {
      case 'volatility':
        return getVolatilityColor(data.volatility, colorTheme);
      case 'liquidity':
        const opacity = Math.min(data.liquidity / 2000, 1);
        return `rgba(59, 130, 246, ${opacity})`;
      case 'performance':
        if (data.performance > 0) return 'rgba(16, 185, 129, 0.3)';
        if (data.performance < 0) return 'rgba(239, 68, 68, 0.3)';
        return 'rgba(156, 163, 175, 0.3)';
      default:
        return getVolatilityColor(data.volatility, colorTheme);
    }
  };

  const getPerformanceIcon = () => {
    if (!data) return null;
    
    if (data.performance > 1) {
      return <TrendingUp className="w-3 h-3 text-green-600" />;
    } else if (data.performance < -1) {
      return <TrendingDown className="w-3 h-3 text-red-600" />;
    }
    return <Minus className="w-3 h-3 text-gray-400" />;
  };

  const getLiquidityIndicator = () => {
    if (!data) return null;
    
    const intensity = Math.min(data.liquidity / 2000, 1);
    const height = `${intensity * 100}%`;
    
    return (
      <div className="absolute bottom-1 left-1 right-1 h-1 bg-gray-200 rounded-sm overflow-hidden">
        <div 
          className="h-full bg-blue-500 transition-all duration-300"
          style={{ width: height }}
        />
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        relative h-16 rounded-lg cursor-pointer transition-all duration-200 border-2 group
        ${isSelected ? 'border-blue-600 shadow-lg' : 'border-transparent'}
        ${isInRange ? 'ring-2 ring-blue-300' : ''}
        ${isToday ? 'ring-2 ring-yellow-400' : ''}
        ${isCurrentMonth ? 'hover:shadow-md' : 'opacity-50'}
        ${isHovered ? 'shadow-lg scale-105 z-10' : ''}
      `}
      style={{ 
        backgroundColor: getBackgroundColor(),
        color: data && data.volatility > 70 ? 'white' : 'inherit'
      }}
      onClick={onClick}
      onMouseEnter={() => onHover(date)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Date Number */}
      <div className="absolute top-1 left-2 text-sm font-medium">
        {format(date, 'd')}
      </div>

      {/* Performance Icon */}
      {dataLayer === 'performance' && (
        <div className="absolute top-1 right-1">
          {getPerformanceIcon()}
        </div>
      )}

      {/* Liquidity Indicator */}
      {(dataLayer === 'liquidity' || dataLayer === 'all') && getLiquidityIndicator()}

      {/* Volatility Dot */}
      {data && dataLayer === 'volatility' && (
        <div className="absolute bottom-1 right-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ 
              backgroundColor: data.volatility > 70 ? 'white' : getVolatilityColor(data.volatility, colorTheme)
            }}
          />
        </div>
      )}

      {/* Tooltip on Hover */}
      {isHovered && data && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20"
        >
          <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-xl min-w-[200px]">
            <div className="font-semibold mb-2">{format(date, 'MMM d, yyyy')}</div>
            <div className="space-y-1">
              <div>Volatility: {data.volatility.toFixed(1)}%</div>
              <div>Performance: {formatPercentage(data.performance)}</div>
              <div>Volume: ${(data.liquidity).toFixed(0)}M</div>
              <div>Price: {formatCurrencyByType(data.close, currency)}</div>
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CalendarCell;