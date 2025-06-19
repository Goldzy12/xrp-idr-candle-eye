
export const formatIDR = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

export const formatVolume = (volume: number | string | undefined): string => {
  if (volume === undefined || volume === null || volume === '') {
    return '0';
  }
  
  const num = typeof volume === 'string' ? parseFloat(volume) : volume;
  
  if (isNaN(num)) {
    return '0';
  }
  
  if (num >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  } else if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toFixed(0);
};

export const formatPercentage = (current: number, previous: number): string => {
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? '+' : ''}${change.toFixed(2)}%`;
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });
};
