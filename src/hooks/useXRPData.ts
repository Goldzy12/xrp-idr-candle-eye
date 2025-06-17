
import { useState, useEffect } from 'react';

export interface TickerData {
  high: string;
  low: string;
  vol_xrp: string;
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

export const useXRPData = () => {
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [candleData, setCandleData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickerData = async () => {
    try {
      const response = await fetch('https://indodax.com/api/ticker/xrpidr');
      if (!response.ok) throw new Error('Failed to fetch ticker data');
      const data = await response.json();
      setTickerData(data.ticker);
      setError(null);
    } catch (err) {
      console.error('Error fetching ticker data:', err);
      setError('Failed to fetch ticker data');
    }
  };

  const generateCandleData = () => {
    // Generate sample candlestick data for demonstration
    // In a real application, you would fetch this from INDODAX trades API
    const now = Date.now();
    const newData: CandleData[] = [];
    
    for (let i = 30; i >= 0; i--) {
      const time = now - (i * 60000); // 1 minute intervals
      const basePrice = 11000 + Math.sin(i * 0.1) * 500; // Simulate price movement
      const open = basePrice + (Math.random() - 0.5) * 100;
      const close = open + (Math.random() - 0.5) * 200;
      const high = Math.max(open, close) + Math.random() * 50;
      const low = Math.min(open, close) - Math.random() * 50;
      const volume = Math.random() * 1000000;

      newData.push({
        time,
        open: Math.round(open),
        high: Math.round(high),
        low: Math.round(low),
        close: Math.round(close),
        volume: Math.round(volume)
      });
    }
    
    setCandleData(newData);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchTickerData();
      generateCandleData();
      setLoading(false);
    };

    fetchData();
    
    // Update data every 10 seconds
    const interval = setInterval(() => {
      fetchTickerData();
      generateCandleData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return { tickerData, candleData, loading, error };
};
