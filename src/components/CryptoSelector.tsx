
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CryptoSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

const CRYPTO_OPTIONS = [
  { value: 'XRP', label: 'XRP - Ripple', icon: '🚀' },
  { value: 'BTC', label: 'BTC - Bitcoin', icon: '₿' },
  { value: 'ETH', label: 'ETH - Ethereum', icon: 'Ξ' },
  { value: 'BNB', label: 'BNB - Binance Coin', icon: '🔥' },
  { value: 'USDT', label: 'USDT - Tether', icon: '💵' },
  { value: 'ADA', label: 'ADA - Cardano', icon: '🎯' },
];

export const CryptoSelector: React.FC<CryptoSelectorProps> = ({ value, onValueChange }) => {
  return (
    <div className="w-full max-w-xs">
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
          <SelectValue placeholder="Pilih Cryptocurrency" />
        </SelectTrigger>
        <SelectContent className="bg-gray-700 border-gray-600">
          {CRYPTO_OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="text-white hover:bg-gray-600 focus:bg-gray-600"
            >
              <div className="flex items-center space-x-2">
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
