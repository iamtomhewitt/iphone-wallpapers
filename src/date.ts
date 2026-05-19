export const getTotalDaysInCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
  return isLeapYear ? 366 : 365;
};

export const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = (now.getTime() - start.getTime()) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
};

/**
 * Passing `1` will give `2026-01-01T00:00:00.000Z`
 */
export const dayOfYearToDate = (day: number, year = new Date().getFullYear()) => {
  const date = new Date(year, 0);
  date.setDate(day);
  return date;
};