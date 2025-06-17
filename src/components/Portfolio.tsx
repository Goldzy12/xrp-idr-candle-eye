
import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Minus, Calculator } from 'lucide-react';
import { formatIDR } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PortfolioProps {
  currentPrice?: string;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  date: Date;
}

export const Portfolio: React.FC<PortfolioProps> = ({ currentPrice }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('xrp-portfolio');
    if (saved) {
      const parsed = JSON.parse(saved);
      setTransactions(parsed.map((t: any) => ({ ...t, date: new Date(t.date) })));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('xrp-portfolio', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (type: 'buy' | 'sell') => {
    if (!amount || !price) return;

    const transaction: Transaction = {
      id: Date.now().toString(),
      type,
      amount: parseFloat(amount),
      price: parseFloat(price),
      date: new Date()
    };

    setTransactions(prev => [...prev, transaction]);
    setAmount('');
    setPrice('');
  };

  const calculatePortfolio = () => {
    let totalXRP = 0;
    let totalInvested = 0;

    transactions.forEach(tx => {
      if (tx.type === 'buy') {
        totalXRP += tx.amount;
        totalInvested += tx.amount * tx.price;
      } else {
        totalXRP -= tx.amount;
        totalInvested -= tx.amount * tx.price;
      }
    });

    const currentValue = totalXRP * (currentPrice ? parseFloat(currentPrice) : 0);
    const pnl = currentValue - totalInvested;
    const pnlPercentage = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0;

    return { totalXRP, totalInvested, currentValue, pnl, pnlPercentage };
  };

  const portfolio = calculatePortfolio();

  return (
    <div className="bg-gray-800 rounded-lg p-4 md:p-6 border border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <Wallet className="w-6 h-6 text-blue-400" />
        <h2 className="text-lg md:text-xl font-bold text-white">Portfolio XRP</h2>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Total XRP</div>
          <div className="text-xl font-bold text-white">
            {portfolio.totalXRP.toFixed(2)}
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Invested</div>
          <div className="text-xl font-bold text-blue-400">
            {formatIDR(portfolio.totalInvested)}
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">Current Value</div>
          <div className="text-xl font-bold text-white">
            {formatIDR(portfolio.currentValue)}
          </div>
        </div>
        
        <div className="bg-gray-700 rounded-lg p-4">
          <div className="text-gray-400 text-sm mb-1">P&L</div>
          <div className={`text-xl font-bold ${
            portfolio.pnl >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {formatIDR(portfolio.pnl)}
          </div>
          <div className={`text-sm ${
            portfolio.pnl >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            ({portfolio.pnlPercentage >= 0 ? '+' : ''}{portfolio.pnlPercentage.toFixed(2)}%)
          </div>
        </div>
      </div>

      {/* Add Transaction */}
      <div className="bg-gray-700 rounded-lg p-4 mb-6">
        <h3 className="text-white font-semibold mb-4">Tambah Transaksi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="number"
            placeholder="Jumlah XRP"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-gray-600 border-gray-500 text-white"
          />
          <Input
            type="number"
            placeholder="Harga per XRP (IDR)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-gray-600 border-gray-500 text-white"
          />
        </div>
        <div className="flex gap-2 mt-4">
          <Button
            onClick={() => addTransaction('buy')}
            className="bg-green-600 hover:bg-green-700 flex-1"
          >
            <Plus className="w-4 h-4 mr-2" />
            Buy
          </Button>
          <Button
            onClick={() => addTransaction('sell')}
            className="bg-red-600 hover:bg-red-700 flex-1"
          >
            <Minus className="w-4 h-4 mr-2" />
            Sell
          </Button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-white font-semibold mb-4">Riwayat Transaksi</h3>
        {transactions.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Belum ada transaksi</p>
        ) : (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {transactions.slice().reverse().map((tx) => (
              <div key={tx.id} className="flex justify-between items-center p-2 bg-gray-600 rounded">
                <div className="flex items-center space-x-2">
                  {tx.type === 'buy' ? (
                    <Plus className="w-4 h-4 text-green-400" />
                  ) : (
                    <Minus className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-white">{tx.amount} XRP</span>
                </div>
                <div className="text-right">
                  <div className="text-white">{formatIDR(tx.price)}</div>
                  <div className="text-gray-400 text-xs">
                    {tx.date.toLocaleDateString('id-ID')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
