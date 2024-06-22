const getPriceDiff = (firstPrice: number, secondPrice: number): number => {
  const priceDiff = secondPrice - firstPrice;
  return parseFloat(priceDiff.toFixed(2));
};

const getPercentChange = (firstPrice: number, secondPrice: number): number => {
  const percentChange = ((secondPrice - firstPrice) / firstPrice) * 100;
  return parseFloat(percentChange.toFixed(2));
};

export const getPriceColorStr = (firstPrice: number, secondPrice: number): string => {
  return firstPrice < secondPrice ? "text-green-500" : "text-red-500";
};

export const getPriceDiffStr = (firstPrice: number, secondPrice: number): string => {
  const difference = getPriceDiff(firstPrice, secondPrice);
  return difference >= 0 ? `+${difference}` : `${difference}`;
};

export const getPercentChangeStr = (firstPrice: number, secondPrice: number): string => {
  const percentChange = getPercentChange(firstPrice, secondPrice);
  return percentChange >= 0 ? `+${percentChange}%` : `${percentChange}%`;
};

export const getPriceStrArrow = (firstPrice: number, secondPrice: number): string => {
  const priceDiff = getPriceDiff(firstPrice, secondPrice);
  const percentChange = getPercentChange(firstPrice, secondPrice);

  const arrow = priceDiff >= 0 ? "▲" : "▼";
  const formattedPriceDiff = priceDiff >= 0 ? `+${priceDiff}` : `${priceDiff}`;
  const formattedPercentChange = percentChange >= 0 ? `+${percentChange}%` : `${percentChange}%`;

  return `${arrow}${formattedPriceDiff} (${formattedPercentChange})`;
};
