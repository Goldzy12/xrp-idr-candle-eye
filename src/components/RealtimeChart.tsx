
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { RealtimeData } from '@/hooks/useXRPData';
import { formatIDR, formatTime } from '@/utils/formatters';

interface RealtimeChartProps {
  data: RealtimeData[];
  loading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    
    return (
      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
        <p className="text-gray-300 text-sm mb-2">{formatTime(data.time)}</p>
        <div className="space-y-1 text-sm">
          <p className="text-gray-400">Harga: <span className="text-green-400">{formatIDR(data.price)}</span></p>
          <p className="text-gray-400">Volume: <span className="text-blue-400">{data.volume.toFixed(2)} XRP</span></p>
        </div>
      </div>
    );
  }
  return null;
};

export const RealtimeChart: React.FC<RealtimeChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="h-64 md:h-96 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg md:text-xl font-bold text-white">XRP/IDR Real-time Chart</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-3 h-3 bg-green-400 rounded"></div>
          <span className="hidden md:inline">Real-time Price</span>
          <span className="md:hidden">Live</span>
        </div>
      </div>
      
      <div className="h-64 md:h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 20, right: 20, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="time"
              tickFormatter={(value) => formatTime(value)}
              stroke="#9ca3af"
              fontSize={12}
            />
            <YAxis
              domain={['dataMin - 50', 'dataMax + 50']}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
              stroke="#9ca3af"
              fontSize={12}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: '#10b981', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
