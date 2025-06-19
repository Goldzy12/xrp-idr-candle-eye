
import React from 'react';
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  ReferenceLine,
} from 'recharts';
import { CandleData } from '@/hooks/useXRPData';
import { formatIDR } from '@/utils/formatters';

interface RealtimeCandlestickChartProps {
  data: CandleData[];
  loading: boolean;
  cryptoSymbol: string;
}

// Custom Candlestick Component
const CustomCandlestick = (props: any) => {
  const { payload, x, y, width, height } = props;
  
  if (!payload) return null;
  
  const { open, high, low, close } = payload;
  const isGreen = close >= open;
  const color = isGreen ? '#00d4aa' : '#ff6b6b';
  
  const bodyHeight = Math.abs(close - open);
  const bodyY = Math.min(open, close);
  
  // Scale values relative to the chart
  const scale = height / (high - low);
  const scaledHigh = (high - low) * scale;
  const scaledLow = 0;
  const scaledBodyY = (bodyY - low) * scale;
  const scaledBodyHeight = bodyHeight * scale;
  
  return (
    <g>
      {/* High-Low line (wick) */}
      <line
        x1={x + width / 2}
        y1={y + height - scaledHigh}
        x2={x + width / 2}
        y2={y + height - scaledLow}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body */}
      <rect
        x={x + width * 0.2}
        y={y + height - scaledBodyY - scaledBodyHeight}
        width={width * 0.6}
        height={Math.max(scaledBodyHeight, 1)}
        fill={isGreen ? color : color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isGreen = data.close >= data.open;
    
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-gray-300 text-sm mb-2">
          {new Date(data.time).toLocaleString('id-ID')}
        </p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-400">Open: <span className="text-white">{formatIDR(data.open)}</span></p>
          <p className="text-gray-400">High: <span className="text-white">{formatIDR(data.high)}</span></p>
          <p className="text-gray-400">Low: <span className="text-white">{formatIDR(data.low)}</span></p>
          <p className="text-gray-400">Close: <span className={isGreen ? 'text-green-400' : 'text-red-400'}>{formatIDR(data.close)}</span></p>
          <p className="text-gray-400">Volume: <span className="text-blue-400">{data.volume.toFixed(2)}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

export const RealtimeCandlestickChart: React.FC<RealtimeCandlestickChartProps> = ({ 
  data, 
  loading, 
  cryptoSymbol 
}) => {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="h-64 md:h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="h-64 md:h-96 flex items-center justify-center">
          <p className="text-gray-400">No data available</p>
        </div>
      </div>
    );
  }

  // Calculate price range for reference lines
  const prices = data.flatMap(d => [d.open, d.high, d.low, d.close]);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice - minPrice;
  
  // Create reference lines at key levels
  const referenceLines = [];
  const stepSize = priceRange / 5;
  for (let i = 1; i < 5; i++) {
    referenceLines.push(minPrice + (stepSize * i));
  }

  // Transform data for the chart
  const chartData = data.map(candle => ({
    ...candle,
    // For the bar chart representation
    range: [Math.min(candle.open, candle.close), Math.max(candle.open, candle.close)],
    isGreen: candle.close >= candle.open,
  }));

  return (
    <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-white">
          {cryptoSymbol}/IDR Realtime Candlestick
        </h2>
        <div className="flex items-center space-x-4 text-sm text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>Bullish</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span>Bearish</span>
          </div>
        </div>
      </div>
      
      <div className="h-64 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="1 1" 
              stroke="#374151" 
              horizontalPoints={[]}
              verticalPoints={[]}
            />
            <XAxis
              dataKey="time"
              tickFormatter={(value) => new Date(value).toLocaleTimeString('id-ID', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
              stroke="#9ca3af"
              fontSize={12}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={['dataMin - 100', 'dataMax + 100']}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              stroke="#9ca3af"
              fontSize={12}
              width={60}
              axisLine={false}
              tickLine={false}
            />
            
            {/* Reference lines for price levels */}
            {referenceLines.map((price, index) => (
              <ReferenceLine 
                key={index}
                y={price} 
                stroke="#4B5563" 
                strokeDasharray="2 2"
                strokeOpacity={0.5}
              />
            ))}
            
            <Tooltip content={<CustomTooltip />} />
            
            {/* Custom candlestick rendering using Bar component */}
            <Bar
              dataKey="close"
              fill="transparent"
              shape={<CustomCandlestick />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 text-center text-gray-500 text-sm">
        <p>Data diperbarui setiap 10 detik • Candlestick realtime</p>
      </div>
    </div>
  );
};
