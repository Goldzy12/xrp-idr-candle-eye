
import React from 'react';
import { TrendingUp, TrendingDown, Volume2 } from 'lucide-react';
import { TickerData } from '@/hooks/useXRPData';
import { formatIDR, formatVolume } from '@/utils/formatters';

interface PriceInfoProps {
  data: TickerData | null;
  loading: boolean;
  cryptoSymbol?: string;
}

export const PriceInfo: React.FC<PriceInfoProps> = ({ data, loading, cryptoSymbol = 'XRP' }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!data) return null;

  const currentPrice = parseFloat(data.last);
  const highPrice = parseFloat(data.high);
  const lowPrice = parseFloat(data.low);
  const isUp = currentPrice > (highPrice + lowPrice) / 2;

  // Get the appropriate volume field based on crypto symbol
  const getVolumeData = () => {
    switch (cryptoSymbol) {
      case 'BTC':
        return data.vol_btc;
      case 'ETH':
        return data.vol_eth;
      case 'BNB':
        return data.vol_bnb;
      case 'USDT':
        return data.vol_usdt;
      case 'ADA':
        return data.vol_ada;
      default:
        return data.vol_xrp;
    }
  };

  const volumeData = getVolumeData();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-gray-400 text-sm">Harga Terakhir</span>
          {isUp ? (
            <TrendingUp className="w-4 h-4 text-green-400" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-400" />
          )}
        </div>
        <div className={`text-2xl font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
          {formatIDR(currentPrice)}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="text-gray-400 text-sm mb-2">Harga Tertinggi 24h</div>
        <div className="text-2xl font-bold text-green-400">
          {formatIDR(highPrice)}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="text-gray-400 text-sm mb-2">Harga Terendah 24h</div>
        <div className="text-2xl font-bold text-red-400">
          {formatIDR(lowPrice)}
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
        <div className="flex items-center text-gray-400 text-sm mb-2">
          <Volume2 className="w-4 h-4 mr-1" />
          Volume 24h ({cryptoSymbol})
        </div>
        <div className="text-2xl font-bold text-blue-400">
          {formatVolume(volumeData)}
        </div>
      </div>
    </div>
  );
};
