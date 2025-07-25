import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameDay, 
  isSameMonth,
  addMonths,
  subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CalendarCell as CalendarCellType, MarketData, ViewMode, DataLayer, DateRange } from '../../types';
import { getVolatilityColor, formatPercentage } from '../../utils/dataGenerator';
import CalendarCell from './CalendarCell';

interface CalendarProps {
  data: MarketData[];
  viewMode: ViewMode;
  dataLayer: DataLayer;
  colorTheme: string;
  currency: string;
  selectedDate: Date | null;
  dateRange: DateRange;
  onDateSelect: (date: Date) => void;
  onDateRangeSelect: (start: Date, end: Date | null) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  data,
  viewMode,
  dataLayer,
  colorTheme,
  currency,
  selectedDate,
  dateRange,
  onDateSelect,
  onDateRangeSelect
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);
  const [isRangeSelecting, setIsRangeSelecting] = useState(false);

  const dataByDate = React.useMemo(() => {
    const map = new Map<string, MarketData>();
    data.forEach(item => {
      map.set(item.date, item);
    });
    return map;
  }, [data]);

  const generateCalendarCells = useCallback((): CalendarCellType[] => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    const cells: CalendarCellType[] = [];
    let day = calendarStart;

    while (day <= calendarEnd) {
      const dateKey = format(day, 'yyyy-MM-dd');
      const marketData = dataByDate.get(dateKey);
      
      cells.push({
        date: new Date(day),
        data: marketData,
        isToday: isSameDay(day, new Date()),
        isCurrentMonth: isSameMonth(day, currentMonth),
        isSelected: selectedDate ? isSameDay(day, selectedDate) : false,
        isInRange: dateRange.start && dateRange.end ? 
          (day >= dateRange.start && day <= dateRange.end) : false
      });

      day = addDays(day, 1);
    }

    return cells;
  }, [currentMonth, dataByDate, selectedDate, dateRange]);

  const cells = generateCalendarCells();

  const handleCellClick = (date: Date) => {
    if (isRangeSelecting) {
      if (!dateRange.start) {
        onDateRangeSelect(date, null);
      } else if (!dateRange.end) {
        onDateRangeSelect(dateRange.start, date);
        setIsRangeSelecting(false);
      } else {
        onDateRangeSelect(date, null);
      }
    } else {
      onDateSelect(date);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedDate) return;

    let newDate = selectedDate;
    
    switch (e.key) {
      case 'ArrowLeft':
        newDate = addDays(selectedDate, -1);
        break;
      case 'ArrowRight':
        newDate = addDays(selectedDate, 1);
        break;
      case 'ArrowUp':
        newDate = addDays(selectedDate, -7);
        break;
      case 'ArrowDown':
        newDate = addDays(selectedDate, 7);
        break;
      case 'Escape':
        onDateSelect(new Date());
        return;
      default:
        return;
    }

    e.preventDefault();
    onDateSelect(newDate);
    
    // Update current month if needed
    if (!isSameMonth(newDate, currentMonth)) {
      setCurrentMonth(newDate);
    }
  }, [selectedDate, currentMonth, onDateSelect]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <motion.h2 
            key={format(currentMonth, 'MMMM yyyy')}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-semibold text-gray-900 dark:text-white min-w-[200px] text-center"
          >
            {format(currentMonth, 'MMMM yyyy')}
          </motion.h2>
          
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRangeSelecting(!isRangeSelecting)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isRangeSelecting 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            {isRangeSelecting ? 'Cancel Range' : 'Select Range'}
          </button>
          
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div
            key={day}
            className="h-10 flex items-center justify-center text-sm font-medium text-gray-500 dark:text-gray-400"
          >
            {day}
          </div>
        ))}

        {/* Calendar Cells */}
        <AnimatePresence mode="wait">
          {cells.map((cell, index) => (
            <CalendarCell
              key={`${format(cell.date, 'yyyy-MM-dd')}-${index}`}
              cell={cell}
              dataLayer={dataLayer}
              colorTheme={colorTheme}
              viewMode={viewMode}
              currency={currency}
              onClick={() => handleCellClick(cell.date)}
              onHover={setHoveredDate}
              isHovered={hoveredDate ? isSameDay(cell.date, hoveredDate) : false}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Low Volatility</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">Medium Volatility</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded"></div>
          <span className="text-gray-600 dark:text-gray-400">High Volatility</span>
        </div>
      </div>
    </div>
  );
};

export default Calendar;