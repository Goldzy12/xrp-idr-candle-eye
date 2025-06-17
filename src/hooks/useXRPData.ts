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

export interface RealtimeData {
  time: number;
  price: number;
  volume: number;
}

export const useXRPData = () => {
  const [tickerData, setTickerData] = useState<TickerData | null>(null);
  const [realtimeData, setRealtimeData] = useState<RealtimeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTickerData = async () => {
    try {
      const response = await fetch('https://indodax.com/api/ticker/xrpidr');
      if (!response.ok) throw new Error('Failed to fetch ticker data');
      const data = await response.json();
      setTickerData(data.ticker);
      
      // Add to realtime data
      const newPoint: RealtimeData = {
        time: Date.now(),
        price: parseFloat(data.ticker.last),
        volume: parseFloat(data.ticker.vol_xrp)
      };
      
      setRealtimeData(prev => {
        const updated = [...prev, newPoint];
        // Keep only last 50 data points
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
    
    // Update data every 10 seconds
    const interval = setInterval(() => {
      fetchTickerData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return { tickerData, realtimeData, loading, error };
};
