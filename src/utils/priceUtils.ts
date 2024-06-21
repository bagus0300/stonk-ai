export const getPriceDiffStr = (openPrice: number, closePrice: number) => {
  const difference = closePrice - openPrice;
  return difference >= 0 ? `+${difference.toFixed(2)}` : difference.toFixed(2);
};

export const getPercentChangeStr = (openPrice: number, closePrice: number) => {
  const percentChange = ((closePrice - openPrice) / openPrice) * 100;
  return percentChange >= 0
    ? `+${percentChange.toFixed(2)}%`
    : `${percentChange.toFixed(2)}%`;
};
