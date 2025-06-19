
import { useState, useEffect } from 'react';

export interface TickerData {
  high: string;
  low: string;
  vol_xrp?: string;
  vol_btc?: string;
  vol_eth?: string;
  vol_bnb?: string;
  vol_usdt?: string;
  vol_ada?: string;
  vol_idr: string;
  last: string;
  buy: string;
  sell: string;
  server_time: number;
}

export interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface RealtimeData {
  time: number;
  price: number;
  volume: number;
}

const CRYPTO_PAIRS = {
  XRP: 'xrpidr',
  BTC: 'btcidr',
  ETH: 'ethidr',
  BNB: 'bnbidr',
  USDT: 'usdtidr',
  ADA: 'adaidr'
};

export const useXRPData = (cryptoSymbol: keyof typeof CRYPTO_PAIRS = 'XRP') => {
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [realtimeData, setRealtimeData] = useState<RealtimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickerData = async () => {
    try {
      const pair = CRYPTO_PAIRS[cryptoSymbol];
      const response = await fetch(`https://indodax.com/api/ticker/${pair}`);
      if (!response.ok) throw new Error('Failed to fetch ticker data');
      const data = await response.json();
      setTickerData(data.ticker);
      
      // Generate mock candlestick data based on current price
      const currentPrice = parseFloat(data.ticker.last);
      const high = parseFloat(data.ticker.high);
      const low = parseFloat(data.ticker.low);
      
      // Get volume based on crypto symbol
      const getVolume = () => {
        switch (cryptoSymbol) {
          case 'BTC':
            return parseFloat(data.ticker.vol_btc || '0');
          case 'ETH':
            return parseFloat(data.ticker.vol_eth || '0');
          case 'BNB':
            return parseFloat(data.ticker.vol_bnb || '0');
          case 'USDT':
            return parseFloat(data.ticker.vol_usdt || '0');
          case 'ADA':
            return parseFloat(data.ticker.vol_ada || '0');
          default:
            return parseFloat(data.ticker.vol_xrp || '0');
        }
      };
      
      const volume = getVolume();
      
      const newCandle: CandleData = {
        time: Date.now(),
        open: currentPrice * (0.98 + Math.random() * 0.04),
        high: high,
        low: low,
        close: currentPrice,
        volume: volume
      };
      
      setCandleData(prev => {
        const updated = [...prev, newCandle];
        return updated.slice(-20); // Keep last 20 candles
      });
      
      // Add to realtime data
      const newPoint: RealtimeData = {
        time: Date.now(),
        price: currentPrice,
        volume: volume
      };
      
      setRealtimeData(prev => {
        const updated = [...prev, newPoint];
        return updated.slice(-50);
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching ticker data:', err);
      setError('Failed to fetch ticker data');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchTickerData();
      setLoading(false);
    };

    fetchData();
    
    const interval = setInterval(() => {
      fetchTickerData();
    }, 10000);

    return () => clearInterval(interval);
  }, [cryptoSymbol]);

  return { tickerData, candleData, realtimeData, loading, error };
};
