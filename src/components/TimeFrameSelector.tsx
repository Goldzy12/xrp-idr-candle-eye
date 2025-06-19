
import React from 'react';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

export type TimeFrame = '15m' | '1h' | '1d' | '1M';

interface TimeFrameSelectorProps {
  value: TimeFrame;
  onChange: (timeframe: TimeFrame) => void;
}

const timeFrameOptions = [
  { value: '15m' as TimeFrame, label: '15m' },
  { value: '1h' as TimeFrame, label: '1h' },
  { value: '1d' as TimeFrame, label: '1d' },
  { value: '1M' as TimeFrame, label: '1M' },
];

export const TimeFrameSelector: React.FC<TimeFrameSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="flex items-center space-x-2">
      <Clock className="w-4 h-4 text-gray-400" />
      <div className="flex space-x-1">
        {timeFrameOptions.map((option) => (
          <Button
            key={option.value}
            variant={value === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => onChange(option.value)}
            className={`h-8 px-3 text-xs ${
              value === option.value 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-gray-700 hover:bg-gray-600 text-gray-300 border-gray-600'
            }`}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
