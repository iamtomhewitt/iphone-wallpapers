export const getTotalDaysInCurrentYear = () => {
  const currentYear = new Date().getFullYear();
  const isLeapYear = (currentYear % 4 === 0 && currentYear % 100 !== 0) || (currentYear % 400 === 0);
  return isLeapYear ? 366 : 365;
};

/**
 * Passing `1` will give `2026-01-01T00:00:00.000Z`
 */
export const dayOfYearToDate = (day: number, year = new Date().getFullYear()) => {
  const date = new Date(year, 0);
  date.setDate(day);
  return date;
};

export const getFirstDayOfYear = (): DayKey => {
  return new Date(`${new Date().getFullYear()}-01-01`)
    .toDateString()
    .toLowerCase()
    .split(' ')[0] as DayKey;
};

export const dayKeyToNumber = (key: DayKey) => {
  const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  return days.indexOf(key);
};

export const dayNumberToDate = (dayNumber: number) => {
  const [day, month, year] = dayOfYearToDate(dayNumber).toLocaleDateString().split('/');
  return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
};

export const getTimeData = async () => {
  return await fetch('https://time.now/developer/api/timezone/Europe/London')
    .then((response: any) => response.json());
};

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';