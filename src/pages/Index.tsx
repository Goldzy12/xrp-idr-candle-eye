
import React from 'react';
import { Header } from '@/components/Header';
import { PriceInfo } from '@/components/PriceInfo';
import { CandlestickChart } from '@/components/CandlestickChart';
import { useXRPData } from '@/hooks/useXRPData';

const Index = () => {
  const { tickerData, candleData, loading, error } = useXRPData();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onRefresh={handleRefresh} isRefreshing={loading} />
      
      <main className="container mx-auto px-6 py-6">
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error:</p>
            <p>{error}</p>
          </div>
        )}
        
        <PriceInfo data={tickerData} loading={loading} />
        <CandlestickChart data={candleData} loading={loading} />
        
        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>Data diperbarui setiap 10 detik dari API INDODAX</p>
          <p className="mt-1">Last update: {new Date().toLocaleString('id-ID')}</p>
        </div>
      </main>
    </div>
  );
};

export default Index;
