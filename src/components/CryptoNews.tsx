
import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  publishedAt: string;
  source: string;
}

export const CryptoNews: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate mock news data since we don't have access to CoinMarketCap API
    const generateMockNews = () => {
      const mockNews: NewsItem[] = [
        {
          id: '1',
          title: 'XRP Sees Strong Volume Growth as Regulatory Clarity Improves',
          summary: 'Trading volume for XRP has increased significantly following recent regulatory developments...',
          url: '#',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: 'CoinDesk'
        },
        {
          id: '2',
          title: 'Indonesian Crypto Exchange INDODAX Reports Record Trading Activity',
          summary: 'INDODAX has seen unprecedented trading volumes across major cryptocurrencies including XRP...',
          url: '#',
          publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          source: 'CoinTelegraph'
        },
        {
          id: '3',
          title: 'Ripple Partners with Indonesian Banks for Cross-Border Payments',
          summary: 'New partnerships aim to facilitate faster and cheaper international transfers using XRP...',
          url: '#',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          source: 'Reuters'
        },
        {
          id: '4',
          title: 'Market Analysis: XRP Price Action Shows Bullish Momentum',
          summary: 'Technical indicators suggest potential upward movement for XRP in the coming days...',
          url: '#',
          publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
          source: 'CryptoSlate'
        },
        {
          id: '5',
          title: 'Indonesian Rupiah Strengthens Against Major Cryptocurrencies',
          summary: 'The IDR has shown resilience in crypto trading pairs, affecting XRP/IDR dynamics...',
          url: '#',
          publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          source: 'Bloomberg'
        }
      ];

      setNews(mockNews);
      setLoading(false);
    };

    generateMockNews();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Baru saja';
    if (diffInHours < 24) return `${diffInHours} jam lalu`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} hari lalu`;
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <Newspaper className="w-6 h-6 text-orange-400" />
        <h2 className="text-lg md:text-xl font-bold text-white">Berita Crypto Terkini</h2>
      </div>

      <div className="space-y-4">
        {news.map((item) => (
          <div key={item.id} className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-white font-semibold text-sm md:text-base line-clamp-2">
                {item.title}
              </h3>
              <ExternalLink className="w-4 h-4 text-gray-400 ml-2 flex-shrink-0" />
            </div>
            
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">
              {item.summary}
            </p>
            
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>{item.source}</span>
              <span>{formatTimeAgo(item.publishedAt)}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
        <p className="text-blue-200 text-sm">
          ℹ️ Berita ini adalah simulasi. Untuk berita real-time, diperlukan API key dari provider berita.
        </p>
      </div>
    </div>
  );
};
