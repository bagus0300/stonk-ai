import dayjs from 'dayjs'

export const getDateDaysBefore = (days_duration: number) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days_duration);
  return dayjs(startDate).format("YYYY-MM-DD");
};

export const getPriceDifference = (openPrice: number, closePrice: number) => {
  const difference = closePrice - openPrice;
  return difference >= 0 ? `+${difference.toFixed(2)}` : difference.toFixed(2);
};

export const getPriceAction = (openPrice: number, closePrice: number) => {
  return (((closePrice - openPrice) / closePrice) * 100).toFixed(2);
};
