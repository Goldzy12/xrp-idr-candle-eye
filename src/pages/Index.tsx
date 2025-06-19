import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { PriceInfo } from '@/components/PriceInfo';
import { CandlestickChart } from '@/components/CandlestickChart';
import { Portfolio } from '@/components/Portfolio';
import { CryptoNews } from '@/components/CryptoNews';
import { CryptoSelector } from '@/components/CryptoSelector';
import { useXRPData } from '@/hooks/useXRPData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const [selectedCrypto, setSelectedCrypto] = useState<'XRP' | 'BTC' | 'ETH' | 'BNB' | 'USDT' | 'ADA'>('XRP');
  const { tickerData, candleData, realtimeData, loading, error } = useXRPData(selectedCrypto);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onRefresh={handleRefresh} isRefreshing={loading} />
      
      <main className="container mx-auto px-3 md:px-6 py-4 md:py-6">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        <div className="mb-6">
          <CryptoSelector value={selectedCrypto} onValueChange={setSelectedCrypto as any} />
        </div>
        
        <PriceInfo data={tickerData} loading={loading} cryptoSymbol={selectedCrypto} />
        
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="chart">Chart & Volume</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="news">Berita</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart">
            <CandlestickChart data={candleData} loading={loading} cryptoSymbol={selectedCrypto} />
          </TabsContent>
          
          <TabsContent value="portfolio">
            <Portfolio currentPrice={tickerData?.last} />
          </TabsContent>
          
          <TabsContent value="news">
            <CryptoNews />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Data diperbarui setiap 10 detik dari API INDODAX</p>
          <p className="mt-1">Last update: {new Date().toLocaleString('id-ID')}</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
