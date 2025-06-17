
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { PriceInfo } from '@/components/PriceInfo';
import { RealtimeChart } from '@/components/RealtimeChart';
import { PricePrediction } from '@/components/PricePrediction';
import { Portfolio } from '@/components/Portfolio';
import { CryptoNews } from '@/components/CryptoNews';
import { useXRPData } from '@/hooks/useXRPData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Index = () => {
  const { tickerData, realtimeData, loading, error } = useXRPData();

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
        
        <PriceInfo data={tickerData} loading={loading} />
        
        <Tabs defaultValue="chart" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6">
            <TabsTrigger value="chart">Chart</TabsTrigger>
            <TabsTrigger value="prediction">Prediksi AI</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="news">Berita</TabsTrigger>
          </TabsList>
          
          <TabsContent value="chart">
            <RealtimeChart data={realtimeData} loading={loading} />
          </TabsContent>
          
          <TabsContent value="prediction">
            <PricePrediction currentPrice={tickerData?.last} />
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
