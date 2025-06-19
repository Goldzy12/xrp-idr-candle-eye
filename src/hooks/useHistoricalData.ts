
import { useState, useEffect } from 'react';

export interface HistoricalCandle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type TimeFrame = '15m' | '1h' | '1d' | '1M';

const CRYPTO_PAIRS = {
  XRP: 'xrpidr',
  BTC: 'btcidr',
  ETH: 'ethidr',
  BNB: 'bnbidr',
  USDT: 'usdtidr',
  ADA: 'adaidr'
};

// Generate mock historical data that looks realistic
const generateHistoricalData = (currentPrice: number, timeframe: TimeFrame, count: number = 100): HistoricalCandle[] => {
  const data: HistoricalCandle[] = [];
  const now = Date.now();
  
  // Calculate time intervals based on timeframe
  const intervals = {
    '15m': 15 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '1d': 24 * 60 * 60 * 1000,
    '1M': 30 * 24 * 60 * 60 * 1000
  };
  
  const interval = intervals[timeframe];
  let price = currentPrice * (0.85 + Math.random() * 0.3); // Start with variation
  
  for (let i = count - 1; i >= 0; i--) {
    const timestamp = now - (i * interval);
    
    // Generate realistic price movement
    const volatility = timeframe === '15m' ? 0.02 : timeframe === '1h' ? 0.05 : timeframe === '1d' ? 0.1 : 0.2;
    const change = (Math.random() - 0.5) * volatility;
    
    const open = price;
    const trend = Math.random() - 0.5;
    const high = open * (1 + Math.abs(trend) * volatility);
    const low = open * (1 - Math.abs(trend) * volatility);
    const close = open * (1 + change);
    
    // Ensure proper OHLC relationships
    const actualHigh = Math.max(open, close, high);
    const actualLow = Math.min(open, close, low);
    
    const volume = Math.random() * 1000000 + 100000;
    
    data.push({
      timestamp,
      open,
      high: actualHigh,
      low: actualLow,
      close,
      volume
    });
    
    price = close; // Next candle starts where this one ended
  }
  
  // Adjust the last few candles to end near current price
  if (data.length > 0) {
    const lastIndex = data.length - 1;
    const priceDiff = currentPrice - data[lastIndex].close;
    const adjustment = priceDiff / 5; // Gradually adjust last 5 candles
    
    for (let i = Math.max(0, lastIndex - 4); i <= lastIndex; i++) {
      const factor = (i - (lastIndex - 4)) / 4;
      data[i].close += adjustment * factor;
      data[i].high = Math.max(data[i].open, data[i].close, data[i].high);
      data[i].low = Math.min(data[i].open, data[i].close, data[i].low);
    }
  }
  
  return data;
};

export const useHistoricalData = (cryptoSymbol: keyof typeof CRYPTO_PAIRS, timeframe: TimeFrame) => {
  const [data, setData] = useState<HistoricalCandle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistoricalData = async () => {
      setLoading(true);
      try {
        // Fetch current price first to generate realistic historical data
        const pair = CRYPTO_PAIRS[cryptoSymbol];
        const response = await fetch(`https://indodax.com/api/ticker/${pair}`);
        if (!response.ok) throw new Error('Failed to fetch current price');
        
        const tickerData = await response.json();
        const currentPrice = parseFloat(tickerData.ticker.last);
        
        // Generate historical data based on timeframe
        const count = timeframe === '15m' ? 96 : timeframe === '1h' ? 168 : timeframe === '1d' ? 90 : 24; // Different counts for different timeframes
        const historicalData = generateHistoricalData(currentPrice, timeframe, count);
        
        setData(historicalData);
        setError(null);
      } catch (err) {
        console.error('Error fetching historical data:', err);
        setError('Failed to fetch historical data');
      } finally {
        setLoading(false);
      }
    };

    fetchHistoricalData();
  }, [cryptoSymbol, timeframe]);

  return { data, loading, error };
};
