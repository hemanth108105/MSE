import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, parseISO } from 'date-fns';
import { MarketData } from '../../types';
import { formatCurrency, formatCurrencyByType } from '../../utils/dataGenerator';

interface MetricsChartProps {
  data: MarketData[];
  selectedDate: Date;
  currency?: string;
}

const MetricsChart: React.FC<MetricsChartProps> = ({ data, selectedDate, currency = 'USD' }) => {
  const chartData = data.map(item => ({
    date: item.date,
    price: item.close,
    volatility: item.volatility,
    volume: item.volume / 10, // Scale down for better visualization
    displayDate: format(parseISO(item.date), 'MMM d')
  }));

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-gray-900 dark:text-white mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {
                entry.dataKey === 'price' ? formatCurrencyByType(entry.value, currency) :
                entry.dataKey === 'volatility' ? `${entry.value.toFixed(1)}%` :
                `$${entry.value.toFixed(0)}M`
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 12 }}
            className="text-gray-600 dark:text-gray-400"
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            className="text-gray-600 dark:text-gray-400"
          />
          <Tooltip content={<CustomTooltip />} />
          
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#3B82F6" 
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 5 }}
            name="Price"
          />
          
          <Line 
            type="monotone" 
            dataKey="volatility" 
            stroke="#EF4444" 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 2 }}
            name="Volatility"
          />
          
          <Line 
            type="monotone" 
            dataKey="volume" 
            stroke="#10B981" 
            strokeWidth={1}
            opacity={0.7}
            dot={{ r: 1 }}
            name="Volume (10M)"
          />
          
          {/* Reference line for selected date */}
          <ReferenceLine 
            x={format(selectedDate, 'MMM d')} 
            stroke="#F59E0B" 
            strokeWidth={2}
            strokeDasharray="8 4"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricsChart;