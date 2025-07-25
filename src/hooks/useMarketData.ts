import { useState, useEffect, useMemo } from 'react';
import { MarketData, ViewMode, DateRange, FilterOptions } from '../types';
import { generateMarketData } from '../utils/dataGenerator';
import { isWithinInterval, parseISO } from 'date-fns';

export const useMarketData = () => {
  const [data, setData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call delay
    const timer = setTimeout(() => {
      setData(generateMarketData(365));
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getFilteredData = useMemo(() => {
    return (dateRange: DateRange, filters: FilterOptions) => {
      return data.filter(item => {
        const itemDate = parseISO(item.date);
        
        // Date range filter
        if (dateRange.start && dateRange.end) {
          if (!isWithinInterval(itemDate, { start: dateRange.start, end: dateRange.end })) {
            return false;
          }
        }
        
        // Volatility filter
        if (item.volatility < filters.minVolatility || item.volatility > filters.maxVolatility) {
          return false;
        }
        
        return true;
      });
    };
  }, [data]);

  const getDataForDate = useMemo(() => {
    return (date: string) => {
      return data.find(item => item.date === date);
    };
  }, [data]);

  return {
    data,
    loading,
    getFilteredData,
    getDataForDate
  };
};