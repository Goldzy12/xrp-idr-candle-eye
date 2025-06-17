
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Brain } from 'lucide-react';
import { formatIDR } from '@/utils/formatters';

interface PricePredictionProps {
  currentPrice?: string;
}

interface PredictionData {
  prediction: number;
  confidence: number;
  trend: 'up' | 'down' | 'sideways';
  timeframe: string;
}

export const PricePrediction: React.FC<PricePredictionProps> = ({ currentPrice }) => {
  const [predictions, setPredictions] = useState<PredictionData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentPrice) return;

    const generatePredictions = () => {
      const current = parseFloat(currentPrice);
      const predictions: PredictionData[] = [
        {
          prediction: current * (1 + (Math.random() - 0.5) * 0.1),
          confidence: 65 + Math.random() * 20,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          timeframe: '1 jam'
        },
        {
          prediction: current * (1 + (Math.random() - 0.5) * 0.2),
          confidence: 55 + Math.random() * 20,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          timeframe: '24 jam'
        },
        {
          prediction: current * (1 + (Math.random() - 0.5) * 0.3),
          confidence: 45 + Math.random() * 20,
          trend: Math.random() > 0.5 ? 'up' : 'down',
          timeframe: '7 hari'
        }
      ];

      setPredictions(predictions);
      setLoading(false);
    };

    generatePredictions();
    const interval = setInterval(generatePredictions, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [currentPrice]);

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <Brain className="w-6 h-6 text-purple-400" />
        <h2 className="text-lg md:text-xl font-bold text-white">Prediksi Harga AI</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {predictions.map((pred, index) => (
          <div key={index} className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">{pred.timeframe}</span>
              {pred.trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-400" />
              )}
            </div>
            
            <div className={`text-xl font-bold mb-2 ${
              pred.trend === 'up' ? 'text-green-400' : 'text-red-400'
            }`}>
              {formatIDR(pred.prediction)}
            </div>
            
            <div className="text-sm text-gray-400">
              Confidence: {pred.confidence.toFixed(0)}%
            </div>
            
            <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
              <div 
                className="bg-purple-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${pred.confidence}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
        <p className="text-yellow-200 text-sm">
          ⚠️ Prediksi ini hanya simulasi dan tidak boleh dijadikan dasar keputusan investasi.
        </p>
      </div>
    </div>
  );
};
