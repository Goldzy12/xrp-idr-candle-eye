
import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CandleData } from '@/hooks/useXRPData';
import { formatIDR, formatTime, formatVolume } from '@/utils/formatters';

interface CandlestickChartProps {
  data: CandleData[];
  loading: boolean;
}

const CandlestickBar = (props: any) => {
  const { payload, x, y, width, height } = props;
  
  if (!payload) return null;
  
  const { open, high, low, close } = payload;
  const isUp = close > open;
  const color = isUp ? '#10b981' : '#ef4444';
  
  const bodyTop = Math.min(open, close);
  const bodyBottom = Math.max(open, close);
  const bodyHeight = Math.abs(close - open);
  
  // Scale calculations for the chart
  const yScale = height / (high - low);
  const wickTop = y + (high - Math.max(open, close)) * yScale;
  const wickBottom = y + height - (Math.min(open, close) - low) * yScale;
  const bodyY = y + (high - Math.max(open, close)) * yScale;
  
  return (
    <g>
      {/* Upper wick */}
      <line
        x1={x + width / 2}
        y1={wickTop}
        x2={x + width / 2}
        y2={bodyY}
        stroke={color}
        strokeWidth={1}
      />
      {/* Lower wick */}
      <line
        x1={x + width / 2}
        y1={wickBottom}
        x2={x + width / 2}
        y2={bodyY + bodyHeight * yScale}
        stroke={color}
        strokeWidth={1}
      />
      {/* Body */}
      <rect
        x={x + width * 0.2}
        y={bodyY}
        width={width * 0.6}
        height={Math.max(bodyHeight * yScale, 1)}
        fill={isUp ? color : color}
        stroke={color}
        strokeWidth={1}
      />
    </g>
  );
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isUp = data.close > data.open;
    
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-gray-300 text-sm mb-2">{formatTime(data.time)}</p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-400">Open: <span className="text-white">{formatIDR(data.open)}</span></p>
          <p className="text-gray-400">High: <span className="text-green-400">{formatIDR(data.high)}</span></p>
          <p className="text-gray-400">Low: <span className="text-red-400">{formatIDR(data.low)}</span></p>
          <p className="text-gray-400">Close: <span className={isUp ? 'text-green-400' : 'text-red-400'}>{formatIDR(data.close)}</span></p>
          <p className="text-gray-400">Volume: <span className="text-blue-400">{formatVolume(data.volume)}</span></p>
        </div>
      </div>
    );
  }
  return null;
};

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">XRP/IDR Candlestick Chart</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <span>Naik</span>
          <div className="w-3 h-3 bg-red-400 rounded"></div>
          <span>Turun</span>
        </div>
      </div>
      
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              tickFormatter={(value) => formatTime(value)}
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
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
