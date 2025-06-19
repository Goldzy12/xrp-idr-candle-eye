
import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from 'recharts';
import { HistoricalCandle, TimeFrame } from '@/hooks/useHistoricalData';
import { formatIDR, formatVolume } from '@/utils/formatters';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';

interface HistoricalCandlestickChartProps {
  data: HistoricalCandle[];
  loading: boolean;
  cryptoSymbol: string;
  timeframe: TimeFrame;
}

const CandlestickBar = (props: any) => {
  const { payload, x, y, width, height } = props;
  
  if (!payload) return null;
  
  const { open, high, low, close } = payload;
  const isUp = close >= open;
  const color = isUp ? '#10b981' : '#ef4444';
  
  const wickX = x + width / 2;
  const bodyWidth = Math.max(width * 0.6, 2);
  const bodyX = x + (width - bodyWidth) / 2;
  
  // Calculate positions
  const highY = y;
  const lowY = y + height;
  const openY = y + ((high - open) / (high - low)) * height;
  const closeY = y + ((high - close) / (high - low)) * height;
  
  const bodyTop = Math.min(openY, closeY);
  const bodyHeight = Math.abs(closeY - openY);
  
  return (
    <g>
      {/* Upper wick */}
      <line
        x1={wickX}
        y1={highY}
        x2={wickX}
        y2={Math.min(openY, closeY)}
        stroke={color}
        strokeWidth={1}
      />
      {/* Lower wick */}
      <line
        x1={wickX}
        y1={Math.max(openY, closeY)}
        x2={wickX}
        y2={lowY}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body */}
      <rect
        x={bodyX}
        y={bodyTop}
        width={bodyWidth}
        height={Math.max(bodyHeight, 1)}
        fill={isUp ? color : color}
        stroke={color}
        strokeWidth={1}
        fillOpacity={isUp ? 0.8 : 1}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isUp = data.close >= data.open;
    const change = ((data.close - data.open) / data.open * 100).toFixed(2);
    
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-gray-300 text-sm mb-2">
          {new Date(data.timestamp).toLocaleString('id-ID')}
        </p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-400">Open: <span className="text-white">{formatIDR(data.open)}</span></p>
          <p className="text-gray-400">High: <span className="text-green-400">{formatIDR(data.high)}</span></p>
          <p className="text-gray-400">Low: <span className="text-red-400">{formatIDR(data.low)}</span></p>
          <p className="text-gray-400">Close: <span className={isUp ? 'text-green-400' : 'text-red-400'}>{formatIDR(data.close)}</span></p>
          <p className="text-gray-400">Change: <span className={isUp ? 'text-green-400' : 'text-red-400'}>{change}%</span></p>
          <p className="text-gray-400">Volume: <span className="text-blue-400">{formatVolume(data.volume)}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

const formatXAxisLabel = (timestamp: number, timeframe: TimeFrame): string => {
  const date = new Date(timestamp);
  
  switch (timeframe) {
    case '15m':
    case '1h':
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
    case '1d':
      return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' });
    case '1M':
      return date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
    default:
      return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  }
};

export const HistoricalCandlestickChart: React.FC<HistoricalCandlestickChartProps> = ({ 
  data, 
  loading, 
  cryptoSymbol, 
  timeframe 
}) => {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  // Calculate technical indicators
  const dataWithMA = data.map((item, index) => {
    const ma5 = index >= 4 ? 
      data.slice(index - 4, index + 1).reduce((sum, d) => sum + d.close, 0) / 5 : null;
    const ma20 = index >= 19 ? 
      data.slice(index - 19, index + 1).reduce((sum, d) => sum + d.close, 0) / 20 : null;
    
    return { ...item, ma5, ma20 };
  });

  return (
    <div className="space-y-4">
      {/* Price Chart */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">{cryptoSymbol}/IDR Historical Chart ({timeframe})</h2>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2 text-gray-400">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>Naik</span>
              <TrendingDown className="w-4 h-4 text-red-400" />
              <span>Turun</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-3 h-3 bg-yellow-400 rounded"></div>
              <span className="text-gray-400">MA5</span>
              <div className="w-3 h-3 bg-purple-400 rounded"></div>
              <span className="text-gray-400">MA20</span>
            </div>
          </div>
        </div>
        
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={dataWithMA} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => formatXAxisLabel(value, timeframe)}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis
                domain={['dataMin - 100', 'dataMax + 100']}
                tickFormatter={(value) => formatIDR(value)}
                stroke="#9ca3af"
                fontSize={12}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="high"
                shape={<CandlestickBar />}
              />
              <Line
                type="monotone"
                dataKey="ma5"
                stroke="#fbbf24"
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
              <Line
                type="monotone"
                dataKey="ma20"
                stroke="#a855f7"
                strokeWidth={2}
                dot={false}
                connectNulls={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Volume Chart */}
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-bold text-white">Volume ({timeframe})</h3>
        </div>
        
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis
                dataKey="timestamp"
                tickFormatter={(value) => formatXAxisLabel(value, timeframe)}
                stroke="#9ca3af"
                fontSize={12}
              />
              <YAxis
                tickFormatter={(value) => formatVolume(value)}
                stroke="#9ca3af"
                fontSize={12}
                width={80}
              />
              <Tooltip
                formatter={(value: any) => [formatVolume(value), 'Volume']}
                labelFormatter={(value) => new Date(value).toLocaleString('id-ID')}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #4b5563',
                  borderRadius: '0.5rem'
                }}
              />
              <Bar
                dataKey="volume"
                fill="#3b82f6"
                fillOpacity={0.7}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
