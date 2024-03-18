export const getDateDaysBefore = (days_duration: number) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days_duration);
  return convertDatetimeToString(startDate)
};

export const convertDatetimeToString = (datetime: Date) => {
  const year = datetime.getFullYear();
  const month = datetime.getMonth() + 1;
  const day = datetime.getDate();

  // Format month and day to ensure they are in 'MM' or 'DD' format
  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedDay = day < 10 ? `0${day}` : `${day}`;

  return `${year}-${formattedMonth}-${formattedDay}`;
}

export const getPriceDifference = (openPrice: number, closePrice: number) => {
  const difference = closePrice - openPrice;
  return difference >= 0 ? `+${difference.toFixed(2)}` : difference.toFixed(2);
};

export const getPriceAction = (openPrice: number, closePrice: number) => {
  return (((closePrice - openPrice) / closePrice) * 100).toFixed(2);
};