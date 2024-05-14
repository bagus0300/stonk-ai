import dayjs from "dayjs";

export const getDateDaysBefore = (days_duration: number) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days_duration);
  return dayjs(startDate).format("YYYY-MM-DD");
};
