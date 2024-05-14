import dayjs from "dayjs";

export const dateToISOString = (date: Date) => dayjs(date).format("YYYY-MM-DD");

export const getDateDaysBefore = (days_duration: number) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days_duration);
  return dateToISOString(startDate);
};
